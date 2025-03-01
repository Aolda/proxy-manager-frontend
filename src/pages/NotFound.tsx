import { Link } from 'react-router';
import { House } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex w-full justify-center p-6 md:p-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex-row">
          <div className="flex flex-col space-y-1.5 w-full">
            <CardTitle className="text-xl">페이지를 찾을 수 없습니다</CardTitle>
            <CardDescription>404 Not Found</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            페이지의 주소가 잘못 입력되었거나, 주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다. 입력하신 주소가
            정확한지 다시 한번 확인해주세요.
          </p>
          <Link to="/">
            <Button className="mt-6">
              <House className="mr-2 h-4 w-4" /> 홈으로
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
