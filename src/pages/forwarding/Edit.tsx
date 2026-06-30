import { z } from 'zod';
import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/authStore';

const formSchema = z.object({
  name: z.string({ required_error: '서버 이름을 입력해주세요' }).min(1, { message: '서버 이름을 입력해주세요' }),
  instanceIp: z
    .string({ required_error: '인스턴스 IP를 입력해주세요' })
    .regex(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, {
      message: '올바른 IP 주소를 입력해주세요',
    })
    .refine((value) => value.startsWith('10.16.') || value.startsWith('10.26.'), {
      message: '인스턴스 IP는 10.16.0.0/16 또는 10.26.0.0/16 대역을 사용해야 합니다',
    }),
});

export default function ForwardingEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authFetch } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const initialData = useRef<z.infer<typeof formSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/forwarding?forwardingId=${id}`)
      .then((response) => {
        if (!response.ok) throw Error(`포트포워딩 정보 조회 실패: ${response.status}`);

        return response.json();
      })
      .then((data) => {
        const name = data.name ?? '';
        const instanceIp = data.instanceIp ?? data.instance_ip ?? '';
        initialData.current = { name, instanceIp };
        form.setValue('name', name);
        form.setValue('instanceIp', instanceIp);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error('포트포워딩 정보를 조회할 수 없습니다.');
        setIsLoading(false);
      });
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!initialData.current) return;

    const payload: Partial<z.infer<typeof formSchema>> = {};
    if (values.name !== initialData.current.name) payload.name = values.name;
    if (values.instanceIp !== initialData.current.instanceIp) payload.instanceIp = values.instanceIp;

    const response = await authFetch(`/api/forwarding?forwardingId=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const { code } = await response.json();
      if (code == 'DUPLICATED_INSTANCE_INFO') {
        form.setError('instanceIp', { type: 'custom' });
        toast.error('이미 존재하는 포트포워딩 설정입니다');
      } else {
        toast.error('포트포워딩 설정 수정에 실패했습니다');
      }
    } else {
      toast.success('포트포워딩 설정이 수정되었습니다');
      navigate('/forwarding');
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mb-2">
        <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">포트포워딩 설정 수정</h1>
        <p className="mt-1 text-base text-gray-500">기존 포트포워딩 설정을 수정합니다.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-4">
            <CardHeader>
              {isLoading ? (
                <Skeleton className="h-[1.75rem] w-[16rem]" />
              ) : (
                <CardTitle className="text-xl">SSH 포트포워딩 설정</CardTitle>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-[16rem] w-full" />
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
                    name="instanceIp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>인스턴스 IP</FormLabel>
                        <FormControl>
                          <Input placeholder="10.16.x.x 또는 10.26.x.x" {...field} />
                        </FormControl>
                        <FormDescription>인스턴스 IP는 provider 대역을 사용합니다</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
