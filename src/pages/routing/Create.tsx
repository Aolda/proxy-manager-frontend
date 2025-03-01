import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string({ required_error: '서버 이름을 입력해주세요' }).min(1, { message: '서버 이름을 입력해주세요' }),
  domain: z
    .string({ required_error: '도메인 주소를 입력해주세요' })
    .regex(/^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
      message: '올바른 도메인 주소를 입력해주세요',
    }),
  instance_ip: z
    .string({ required_error: '인스턴스 IP를 입력해주세요' })
    .regex(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, {
      message: '올바른 IP 주소를 입력해주세요',
    })
    .startsWith('10.16.', { message: '인스턴스 IP는 10.16.0.0/16 대역을 사용해야 합니다' }),
  enable_ssl: z.boolean(),
  enable_cache: z.boolean(),
});

export default function RoutingCreate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      domain: '',
      instance_ip: '',
      enable_ssl: false,
      enable_cache: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('제출된 데이터:', values);
    toast.warning('라우팅 설정을 등록합니다');
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mb-2">
        <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">신규 라우팅 등록</h1>
        <p className="mt-1 text-base text-gray-500">웹 프록시 서버에 새로운 라우팅 설정을 등록합니다.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl">라우팅 기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <FormDescription>*.ajou.app 도메인은 별도 설정 없이 자유롭게 사용할 수 있습니다</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instance_ip"
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
                name="enable_ssl"
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

              <Separator />

              <FormField
                control={form.control}
                name="enable_cache"
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
