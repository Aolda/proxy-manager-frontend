import { Filter, Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

const forwardings = [
  {
    id: 1,
    name: '아올다 프록시 매니저 콘솔',
    created_at: '2021-09-01 11:43:00',
    updated_at: '2021-09-01 12:00:00',
    port: 20444,
    instance_ip: '10.16.0.10',
  },
  {
    id: 2,
    name: '아올다 블로그',
    created_at: '2021-09-01 12:00:00',
    updated_at: '2021-09-01 12:01:00',
    port: 22222,
    instance_ip: '10.16.0.11',
  },
  {
    id: 3,
    name: '개인 블로그',
    created_at: '2021-09-01 12:01:00',
    updated_at: '2021-09-01 13:00:00',
    port: 20411,
    instance_ip: '10.16.3.23',
  },
  {
    id: 4,
    name: '아올다 테스트 서버',
    created_at: '2021-09-01 13:00:00',
    updated_at: '2021-09-02 12:00:00',
    port: 20432,
    instance_ip: '10.16.32.1',
  },
];

export default function ForwardingList() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">SSH 포트포워딩 설정</h1>
          <p className="mt-1 text-base text-gray-500">현재 4개의 SSH 포트포워딩이 설정되어 있습니다.</p>
        </div>
        <Button className="ml-2" asChild>
          <Link to="./create">
            <Plus className="h-4 w-4" /> 새 포트포워딩 추가
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Filter className="mr-3" />
            <Input placeholder="이름, 포트, 인스턴스 IP로 검색..." />
            <Button variant="secondary">검색</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">이름</TableHead>
                <TableHead>포트</TableHead>
                <TableHead>인스턴스 IP</TableHead>
                <TableHead className="w-32 min-w-32 text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forwardings.map((forwarding) => (
                <TableRow key={forwarding.id}>
                  <TableCell className="truncate max-w-48">
                    <HoverCard>
                      <HoverCardTrigger>{forwarding.name}</HoverCardTrigger>
                      <HoverCardContent className="w-80 whitespace-normal">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">{forwarding.name}</p>
                            <p className="text-sm">
                              ssh.aoldacloud.com:{forwarding.port} ↔ {forwarding.instance_ip}:22
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">{forwarding.created_at} 생성</p>
                            <p className="text-xs text-muted-foreground">{forwarding.updated_at} 수정</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>{forwarding.port}</TableCell>
                  <TableCell>{forwarding.instance_ip}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Button variant="secondary" className="size-8">
                        <Link to={`./edit/${forwarding.id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="secondary" className="size-8">
                        <Link to={`./delete/${forwarding.id}`}>
                          <Trash />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
