import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Certificate } from '@/types/certificate';
import { useAuthStore } from '@/stores/authStore';
import useDebounce from '@/hooks/useDebounce';

const formSchema = z
  .object({
    name: z.string({ required_error: '서버 이름을 입력해주세요' }).min(1, { message: '서버 이름을 입력해주세요' }),
    domain: z
      .string({ required_error: '도메인 주소를 입력해주세요' })
      .regex(/^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
        message: '올바른 도메인 주소를 입력해주세요',
      }),
    ip: z
      .string({ required_error: '인스턴스 IP를 입력해주세요' })
      .regex(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, {
        message: '올바른 IP 주소를 입력해주세요',
      })
      .startsWith('10.16.', { message: '인스턴스 IP는 10.16.0.0/16 대역을 사용해야 합니다' }),
    port: z.coerce
      .number({ invalid_type_error: '포트 번호를 입력해주세요' })
      .min(1, { message: '포트 번호를 입력해주세요' })
      .max(65535, { message: '올바른 포트 번호를 입력해주세요' }),
    enableSSL: z.boolean(),
    certificateId: z.coerce.number().optional(),
    caching: z.boolean(),
  })
  .refine((data) => !data.enableSSL || (data.enableSSL && data.certificateId !== undefined), {
    message: 'SSL 인증서를 선택해주세요',
    path: ['certificateId'],
  });

export default function RoutingEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authFetch, selectedProject } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      domain: undefined,
      ip: undefined,
      port: undefined,
      enableSSL: false,
      certificateId: undefined,
      caching: false,
    },
  });
  const domain = useWatch({ control: form.control, name: 'domain' });
  const enableSSL = useWatch({ control: form.control, name: 'enableSSL' });
  const debouncedDomain = useDebounce(domain, 500);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const initData = useRef<z.infer<typeof formSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/routing?routingId=${id}`)
      .then((response) => {
        if (!response.ok) {
          console.error(response);
          throw Error();
        }

        return response.json();
      })
      .then(({ name, domain, ip, port, certificateId, caching }) => {
        initData.current = {
          name,
          domain,
          ip,
          port: parseInt(port),
          enableSSL: certificateId ? true : false,
          certificateId: certificateId || -1,
          caching,
        };

        form.setValue('name', initData.current.name);
        form.setValue('domain', initData.current.domain);
        form.setValue('ip', initData.current.ip);
        form.setValue('port', initData.current.port);
        form.setValue('enableSSL', initData.current.enableSSL);
        form.setValue('certificateId', initData.current.certificateId);
        form.setValue('caching', initData.current.caching);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error('라우팅 설정 정보를 조회할 수 없습니다.');
      });
  }, []);

  useEffect(() => {
    if (enableSSL) {
      authFetch(`/api/certificates?projectId=${selectedProject?.id}&domain=${debouncedDomain}`)
        .then((response) => {
          if (!response.ok) {
            toast.error('SSL 인증서 목록을 불러올 수 없습니다');
            return { contents: [] };
          }
          return response.json();
        })
        .then(({ contents }) => {
          setCertificates(contents);
        });
    }
  }, [authFetch, enableSSL, selectedProject, debouncedDomain]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!initData.current) return;

    const payload: Partial<z.infer<typeof formSchema>> = {};
    if (values.name !== initData.current.name) payload.name = values.name;
    if (values.domain !== initData.current.domain) payload.domain = values.domain;
    if (values.ip !== initData.current.ip) payload.ip = values.ip;
    if (values.port !== initData.current.port) payload.port = values.port;
    if (values.caching !== initData.current.caching) payload.caching = values.caching;
    if (!values.enableSSL && values.enableSSL !== initData.current.enableSSL) payload.certificateId = -1;
    if (values.enableSSL && values.certificateId !== initData.current.certificateId)
      payload.certificateId = values.certificateId;

    const response = await authFetch(`/api/routing?routingId=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const { code } = await response.json();
      if (code == 'DUPLICATED_DOMAIN_NAME') {
        form.setError('domain', { type: 'custom' });
        toast.error('이미 사용중인 도메인입니다');
      } else {
        toast.error('라우팅 설정 수정에 실패하였습니다');
      }
    } else {
      toast.success('라우팅 설정이 수정되었습니다');
      navigate('/routing');
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mb-2">
        <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">라우팅 설정 수정</h1>
        <p className="mt-1 text-base text-gray-500">웹 프록시 서버의 기존 라우팅 설정을 수정합니다.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl">라우팅 기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-[24rem] w-full" />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>서버 이름</FormLabel>
                        <FormControl>
                          <Input placeholder="웹 서버 이름" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>도메인</FormLabel>
                        <FormControl>
                          <Input placeholder="example.ajou.app" {...field} />
                        </FormControl>
                        <FormDescription>
                          *.ajou.app 도메인은 별도 설정 없이 자유롭게 사용할 수 있습니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>인스턴스 IP</FormLabel>
                        <FormControl>
                          <Input placeholder="10.16.x.x" {...field} />
                        </FormControl>
                        <FormDescription>인스턴스 IP는 10.16.0.0/16 대역을 사용합니다</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>인스턴스 포트</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="8080" {...field} />
                        </FormControl>
                        <FormDescription>연결할 웹 서비스의 포트 번호를 입력해주세요</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">추가 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-[8rem] w-full" />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="enableSSL"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">SSL 보안 연결</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            HTTPS 프로토콜을 사용하여 보안 연결을 활성화합니다
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            {!field.value && <X className="h-4 w-4 text-gray-500" />}
                            {field.value && <Check className="h-4 w-4" />}
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('enableSSL') && (
                    <FormField
                      control={form.control}
                      name="certificateId"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="SSL 인증서 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {certificates.length === 0 ? (
                                  <SelectLabel className="text-muted-foreground">
                                    사용 가능한 SSL 인증서가 없습니다. &nbsp;
                                    <Link to="/certificate/create" className="font-medium underline underline-offset-4">
                                      추가하기
                                    </Link>
                                  </SelectLabel>
                                ) : (
                                  certificates.map((certificate) => (
                                    <SelectItem value={certificate.id.toString()}>{certificate.domain}</SelectItem>
                                  ))
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <FormField
                    control={form.control}
                    name="caching"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">정적 파일 캐싱 활성화</FormLabel>
                          <FormDescription className="text-sm text-gray-500">
                            빠른 응답을 위해 정적 파일에 대한 캐싱을 활성화합니다
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            {!field.value && <X className="h-4 w-4 text-gray-500" />}
                            {field.value && <Check className="h-4 w-4" />}
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link to="..">취소</Link>
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
