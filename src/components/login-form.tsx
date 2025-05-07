import React from 'react';
import { useNavigate } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('로그인에 실패했습니다');
    }

    setIsLoading(false);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>아올다 통합 계정을 사용하여 로그인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">사용자 이름</Label>
                <Input id="username" name="username" type="text" placeholder="사용자 이름" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" name="password" type="password" placeholder="비밀번호" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoaderCircle className="animate-spin" />}
                로그인
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?
              <a href={import.meta.env.VITE_SUPPORT_URL} className="ml-2 underline underline-offset-4">
                아올다 프로젝트 신청하기
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
