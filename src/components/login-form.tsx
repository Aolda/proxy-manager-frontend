import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>아올다 통합 계정을 사용하여 로그인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">사용자 이름</Label>
                <Input id="username" type="text" placeholder="사용자 이름" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" placeholder="비밀번호" required />
              </div>
              <Button type="submit" className="w-full">
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
