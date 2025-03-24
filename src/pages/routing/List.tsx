import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Filter, Plus, Check, X, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { Routing } from '@/types/routing';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

export default function RoutingList() {
  const { authFetch, selectedProject } = useAuthStore();
  const [routings, setRoutings] = useState<Routing[] | null>(null);
  const [selectedRouting, setSelectedRouting] = useState<Routing | null>(null);

  useEffect(() => {
    authFetch(`/api/routings?projectId=${selectedProject?.id}`)
      .then((response) => {
        if (!response.ok) throw Error(`라우팅 목록 조회 실패: ${response.status}`);

        return response.json();
      })
      .then(({ contents }) => {
        setRoutings(contents);
      })
      .catch((error) => {
        console.error(error);
        toast.error('라우팅 정보를 조회할 수 없습니다.');
      });
  }, [authFetch, selectedProject]);

  const handleDelete = () => {
    if (selectedRouting === null) throw Error('selectedRouting is null');

    authFetch(`/api/routing?routingId=${selectedRouting.id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (!response.ok) {
        console.error(response);
        toast.error('라우팅 설정 삭제에 실패했습니다');
      } else {
        toast.warning('라우팅 설정이 삭제되었습니다');
        setRoutings((prev) => prev!.filter((routing) => routing.id !== selectedRouting.id));
      }
    });

    setSelectedRouting(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">웹 라우팅 설정</h1>
          {routings === null ? (
            <Skeleton className="w-[24rem] h-[1rem] mt-2 rounded-full" />
          ) : (
            <p className="mt-1 text-base text-gray-500">
              <p className="mt-1 text-base text-gray-500">현재 {routings.length}개의 웹 프록시가 설정되어 있습니다.</p>
            </p>
          )}
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
                <TableHead>포트</TableHead>
                <TableHead className="w-32 min-w-32 text-center">기타 설정</TableHead>
                <TableHead className="w-32 min-w-32 text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routings === null ? (
                <>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                </>
              ) : routings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    현재 프로젝트에 등록된 웹 프록시 설정이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                routings.map((routing) => (
                  <TableRow key={routing.id}>
                    <TableCell className="truncate max-w-48">
                      <HoverCard>
                        <HoverCardTrigger>{routing.name}</HoverCardTrigger>
                        <HoverCardContent className="w-80 whitespace-normal">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold">{routing.name}</p>
                              <p className="text-sm">
                                {routing.domain} ({routing.ip}:{routing.port})
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">{routing.createdAt} 생성</p>
                              <p className="text-xs text-muted-foreground">{routing.updatedAt} 수정</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>{routing.domain}</TableCell>
                    <TableCell>{routing.ip}</TableCell>
                    <TableCell>{routing.port}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-1">
                        {routing.certificateId !== undefined ? (
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
                        {routing.caching ? (
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
                        <Button variant="secondary" className="size-8" onClick={() => setSelectedRouting(routing)}>
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={selectedRouting !== null} onOpenChange={(open) => open || setSelectedRouting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>웹 라우팅 설정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 '{selectedRouting?.name}' 라우팅 설정을 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
