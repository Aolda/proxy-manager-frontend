import { Split, ShieldCheck, Server, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const logs = [
  {
    id: 1,
    timestamp: '2021-09-01 12:00:00',
    action: '웹 라우팅 설정 변경 (console.ajou.app)',
    username: 'admin',
  },
  {
    id: 2,
    timestamp: '2021-09-01 12:01:00',
    action: 'SSL 인증서 발급 (*.ajou.app)',
    username: 'admin',
  },
  {
    id: 3,
    timestamp: '2021-09-01 13:00:00',
    action: 'SSH 포트포워딩 설정 변경 (10.16.1.10)',
    username: 'admin',
  },
  {
    id: 4,
    timestamp: '2021-09-02 12:00:00',
    action: '웹 라우팅 설정 변경 (blog.ajou.app)',
    username: 'hando1220',
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0 mb-2">Aolda Proxy Manager</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">웹 라우팅</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-2 font-bold text-4xl">
              <Split className="size-8" /> 0
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="ml-auto">
              관리하기 <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">SSL 인증서</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-2 font-bold text-4xl">
              <ShieldCheck className="size-8" /> 0
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="ml-auto">
              관리하기 <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">SSH 포트포워딩</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-2 font-bold text-4xl">
              <Server className="size-8" /> 0
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="ml-auto">
              관리하기 <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">최근 활동</CardTitle>
          <CardDescription>최근 설정 내역을 확인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">시간</TableHead>
                <TableHead>설정 내용</TableHead>
                <TableHead className="w-32 text-center">사용자명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.timestamp}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-center">{log.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="ml-auto">
            모든 기록 보기 <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
