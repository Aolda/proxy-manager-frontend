import { Filter, Plus, Check, X, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';

const routings = [
  {
    id: 1,
    name: '아올다 프록시 매니저 콘솔',
    created_at: '2021-09-01 11:43:00',
    updated_at: '2021-09-01 12:00:00',
    domain: 'console.ajou.app',
    instance_ip: '10.16.0.10',
    ssl_id: 10921,
    is_cached: false,
  },
  {
    id: 2,
    name: '아올다 블로그',
    created_at: '2021-09-01 12:00:00',
    updated_at: '2021-09-01 12:01:00',
    domain: 'blog.ajou.app',
    instance_ip: '10.16.0.11',
    ssl_id: 10921,
    is_cached: true,
  },
  {
    id: 3,
    name: '개인 블로그',
    created_at: '2021-09-01 12:01:00',
    updated_at: '2021-09-01 13:00:00',
    domain: 'blog.username.blog',
    instance_ip: '10.16.3.23',
    ssl_id: 10923,
    is_cached: true,
  },
  {
    id: 4,
    name: '아올다 테스트 서버',
    created_at: '2021-09-01 13:00:00',
    updated_at: '2021-09-02 12:00:00',
    domain: 'test.aolda.app',
    instance_ip: '10.16.32.1',
    ssl_id: null,
    is_cached: false,
  },
];

export default function RoutingList() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">웹 라우팅 설정</h1>
          <p className="mt-1 text-base text-gray-500">현재 3개의 웹 프록시가 설정되어 있습니다.</p>
        </div>
        <Button className="ml-2" asChild>
          <Link to="./create">
            <Plus className="h-4 w-4" /> 새 프록시 추가
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Filter className="mr-3" />
            <Input placeholder="이름, 도메인, 인스턴스 IP로 검색..." />
            <Button variant="secondary">검색</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">이름</TableHead>
                <TableHead>도메인</TableHead>
                <TableHead>인스턴스 IP</TableHead>
                <TableHead className="w-32 min-w-32 text-center">기타 설정</TableHead>
                <TableHead className="w-32 min-w-32 text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routings.map((routing) => (
                <TableRow key={routing.id}>
                  <TableCell className="truncate max-w-48">
                    <HoverCard>
                      <HoverCardTrigger>{routing.name}</HoverCardTrigger>
                      <HoverCardContent className="w-80 whitespace-normal">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">{routing.name}</p>
                            <p className="text-sm">
                              {routing.domain} ({routing.instance_ip})
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">{routing.created_at} 생성</p>
                            <p className="text-xs text-muted-foreground">{routing.updated_at} 수정</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>{routing.domain}</TableCell>
                  <TableCell>{routing.instance_ip}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-1">
                      {routing.ssl_id !== null ? (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3" />
                          SSL
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          <X className="h-3 w-3" />
                          SSL
                        </Badge>
                      )}
                      {routing.is_cached ? (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3" />
                          캐시
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          <X className="h-3 w-3" />
                          캐시
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Button variant="secondary" className="size-8">
                        <Link to={`./edit/${routing.id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="secondary" className="size-8">
                        <Link to={`./delete/${routing.id}`}>
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
