import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/authStore';

const formSchema = z.object({
  name: z.string({ required_error: '서버 이름을 입력해주세요' }).min(1, { message: '서버 이름을 입력해주세요' }),
  serverPort: z
    .number({ required_error: '도메인 주소를 입력해주세요' })
    .min(20000, { message: '포트 번호는 20000 이상이어야 합니다' })
    .max(29999, { message: '포트 번호는 29999 이하여야 합니다' }),
  instanceIp: z
    .string({ required_error: '인스턴스 IP를 입력해주세요' })
    .regex(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, {
      message: '올바른 IP 주소를 입력해주세요',
    })
    .startsWith('10.16.', { message: '인스턴스 IP는 10.16.0.0/16 대역을 사용해야 합니다' }),
});

export default function ForwardingCreate() {
  const navigate = useNavigate();
  const { authFetch, selectedProject } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      serverPort: undefined,
      instanceIp: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, serverPort, instanceIp } = values;

    const response = await authFetch(`/api/forwarding?projectId=${selectedProject?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        serverPort,
        instanceIp,
        instancePort: 22,
      }),
    });

    if (!response.ok) {
      console.error(response);

      const { code } = await response.json();
      if (code == 'DUPLICATED_INSTANCE_INFO') {
        form.setError('instanceIp', { type: 'custom' });
        toast.error('이미 존재하는 포트포워딩 설정입니다');
      } else if (code == 'DUPLICATED_SERVER_PORT') {
        form.setError('serverPort', { type: 'custom' });
        toast.error('이미 사용 중인 포트 번호입니다');
      } else if (code == 'UNAUTHORIZED_USER') {
        toast.error('권한이 없는 사용자입니다');
      } else {
        toast.error('포트포워딩 설정 등록에 실패했습니다');
      }
    } else {
      toast.success('포트포워딩 설정이 등록되었습니다');
      navigate('/forwarding');
    }
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
                  name="serverPort"
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
                  name="instanceIp"
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
