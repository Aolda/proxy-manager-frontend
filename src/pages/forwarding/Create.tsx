import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string({ required_error: '서버 이름을 입력해주세요' }).min(1, { message: '서버 이름을 입력해주세요' }),
  port: z
    .number({ required_error: '도메인 주소를 입력해주세요' })
    .min(20000, { message: '포트 번호는 20000 이상이어야 합니다' })
    .max(29999, { message: '포트 번호는 29999 이하여야 합니다' }),
  instance_ip: z
    .string({ required_error: '인스턴스 IP를 입력해주세요' })
    .regex(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, {
      message: '올바른 IP 주소를 입력해주세요',
    })
    .startsWith('10.16.', { message: '인스턴스 IP는 10.16.0.0/16 대역을 사용해야 합니다' }),
});

export default function ForwardingCreate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      port: undefined,
      instance_ip: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('제출된 데이터:', values);
    toast.warning('포트포워딩 설정을 등록합니다');
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mb-2">
        <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">신규 포트포워딩 등록</h1>
        <p className="mt-1 text-base text-gray-500">새로운 SSH 포트포워딩 설정을 등록합니다.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl">SSH 포트포워딩 설정</CardTitle>
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
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>포트 번호</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={20000}
                          max={29999}
                          placeholder="20000 ~ 29999"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>ssh.aoldacloud.com:&lt;포트번호&gt;로 접속 가능합니다</FormDescription>
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
