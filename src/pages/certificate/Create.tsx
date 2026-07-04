import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Globe, HardDrive, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { publicDnsTargetIp } from '@/config/env';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '관리자 이메일 주소를 입력해주세요' })
      .email({ message: '올바른 이메일 주소를 입력해주세요' }),
    domain: z
      .string()
      .min(1, { message: '도메인 주소를 입력해주세요' })
      .regex(/^(?=.{1,253}$)(?:(?:\*\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
        message: '올바른 도메인 주소를 입력해주세요',
      }),
    apiToken: z.string(),
    dnsChallenge: z.boolean(),
  })
  .refine((data) => !data.dnsChallenge || (data.dnsChallenge && data.apiToken !== ''), {
    message: 'Cloudflare API 토큰을 입력해주세요',
    path: ['apiToken'],
  })
  .refine((data) => !data.domain.startsWith('*.') || data.dnsChallenge, {
    message: '와일드카드 도메인 인증서는 DNS Challenge를 사용해야 합니다',
    path: ['domain'],
  });

export default function CertificateCreate() {
  const navigate = useNavigate();
  const { authFetch, selectedProject } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      domain: '',
      dnsChallenge: false,
      apiToken: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, domain, apiToken, dnsChallenge } = values;
    const challenge = dnsChallenge ? 'dns_cloudflare' : 'http';

    const response = await authFetch(`/api/certificate?projectId=${selectedProject?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        domain,
        challenge,
        apiToken,
      }),
    });

    if (!response.ok) {
      console.error(response);

      const { code } = await response.json();
      if (code == 'UNAUTHORIZED_USER') {
        toast.error('권한이 없는 사용자입니다');
      } else {
        toast.error('인증서 등록에 실패했습니다');
      }
    } else {
      toast.success('SSL 인증서가 등록되었습니다');
      navigate('/certificate');
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mb-2">
        <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">신규 SSL 인증서 등록</h1>
        <p className="mt-1 text-base text-gray-500">웹 프록시 서버에 새로운 SSL 인증서 설정를 등록합니다.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl">인증서 기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>관리자 이메일 주소</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
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
                      {publicDnsTargetIp && (
                        <FormDescription>등록할 도메인에 대해 DNS 설정({publicDnsTargetIp})을 먼저 진행해주세요</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">추가 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dnsChallenge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">DNS Challenge 설정</FormLabel>
                      <FormDescription className="text-sm text-gray-500">
                        DNS Challenge 방식으로 SSL 인증서를 발급합니다. Cloudflare DNS를 지원합니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {field.value ? (
                          <Badge variant="secondary">
                            <HardDrive className="h-3 w-3" />
                            DNS Challenge
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Globe className="h-3 w-3" />
                            HTTP Challenge
                          </Badge>
                        )}
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('dnsChallenge') && (
                <>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="apiToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Cloudflare DNS API 토큰</FormLabel>
                        <FormControl>
                          <Input placeholder="Cloudflare API Token" {...field} />
                        </FormControl>
                        <FormDescription>
                          <a
                            href="https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            API 토큰 생성 문서
                          </a>
                          를 참고하여 Cloudflare DNS API 토큰을 생성해주세요.
                        </FormDescription>
                        <FormMessage />
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
              저장
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
