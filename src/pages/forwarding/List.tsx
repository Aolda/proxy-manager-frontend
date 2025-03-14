import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Filter, Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Forwarding } from '@/types/forwarding';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function ForwardingList() {
  const { selectedProject } = useAuthStore();
  const [forwardings, setForwardings] = useState<Forwarding[] | null>(null);
  const [selectedForwarding, setSelectedForwarding] = useState<Forwarding | null>(null);

  useEffect(() => {
    fetch(`/api/forwardings?projectId=${selectedProject?.id}`)
      .then((response) => {
        if (!response.ok) {
          toast.error('포트포워딩 정보를 조회할 수 없습니다.');
          return { forwardings: [] };
        }

        return response.json();
      })
      .then(({ contents }) => {
        setForwardings(contents);
      });
  }, [selectedProject]);

  const handleDelete = () => {
    if (selectedForwarding === null) throw Error('selectedForwarding is null');

    fetch(`/api/forwarding?forwardingId=${selectedForwarding.id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (!response.ok) {
        console.error(response);
        toast.error('포트포워딩 설정 삭제에 실패했습니다');
      } else {
        toast.warning('포트포워딩 설정이 삭제되었습니다');
        setForwardings((prev) => prev!.filter((forwarding) => forwarding.id !== selectedForwarding.id));
      }
    });

    setSelectedForwarding(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">SSH 포트포워딩 설정</h1>
          {forwardings === null ? (
            <Skeleton className="w-[24rem] h-[1rem] mt-2 rounded-full" />
          ) : (
            <p className="mt-1 text-base text-gray-500">
              현재 {forwardings?.length}개의 SSH 포트포워딩이 설정되어 있습니다.
            </p>
          )}
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
              {forwardings === null ? (
                <>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                </>
              ) : forwardings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    현재 프로젝트에 등록된 포트포워딩 설정이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                forwardings.map((forwarding) => (
                  <TableRow key={forwarding.id}>
                    <TableCell className="truncate max-w-48">
                      <HoverCard>
                        <HoverCardTrigger>{forwarding.name}</HoverCardTrigger>
                        <HoverCardContent className="w-80 whitespace-normal">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold">{forwarding.name}</p>
                              <p className="text-sm">
                                ssh.aoldacloud.com:{forwarding.serverPort} ↔ {forwarding.instanceIp}:
                                {forwarding.instancePort}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">{forwarding.createdAt} 생성</p>
                              <p className="text-xs text-muted-foreground">{forwarding.updatedAt} 수정</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>{forwarding.serverPort}</TableCell>
                    <TableCell>{forwarding.instanceIp}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button variant="secondary" className="size-8">
                          <Link to={`./edit/${forwarding.id}`}>
                            <Pencil />
                          </Link>
                        </Button>
                        <Button
                          variant="secondary"
                          className="size-8"
                          onClick={() => setSelectedForwarding(forwarding)}
                        >
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

      <AlertDialog open={selectedForwarding !== null} onOpenChange={(open) => open || setSelectedForwarding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>포트포워딩 설정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 '{selectedForwarding?.name}' 포트포워딩 설정을 삭제하시겠습니까?
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
