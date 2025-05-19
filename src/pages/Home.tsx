import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Split, ShieldCheck, Server, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Log, LogListResponse, ActionLabels, TypeLabels } from '@/types/log';

interface ProjectInfo {
  routing: number;
  forwarding: number;
  certificate: number;
}

export default function Home() {
  const { authFetch, selectedProject } = useAuthStore();
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);

  useEffect(() => {
    setProjectInfo(null);

    authFetch(`/api/main?projectId=${selectedProject?.id}`)
      .then((response) => {
        if (!response.ok) throw new Error(`프로젝트 정보 조회 실패: (${response.status})`);

        return response.json();
      })
      .then((data) => {
        setProjectInfo(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('프로젝트 정보를 조회할 수 없습니다.');
      });
  }, [authFetch, selectedProject]);

  useEffect(() => {
    setLogs(null);

    authFetch(`/api/logs?projectId=${selectedProject?.id}&size=5`)
      .then((response): Promise<LogListResponse> => {
        if (!response.ok) throw new Error(`로그 목록 조회 실패: (${response.status})`);

        return response.json();
      })
      .then(({ contents }) => {
        setLogs(contents);
      })
      .catch((error) => {
        console.error(error);
        toast.error('로그 정보를 조회할 수 없습니다.');
      });
  }, [authFetch, selectedProject]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0 mb-2">Aolda Proxy Manager</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">웹 라우팅</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-4 font-bold text-4xl">
              {projectInfo === null ? (
                <Skeleton className="w-22 h-10 rounded-full" />
              ) : (
                <>
                  <Split className="size-8" /> {projectInfo.routing}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link className="ml-auto" to="/routing">
              <Button variant="ghost">
                관리하기 <ArrowRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">SSL 인증서</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-4 font-bold text-4xl">
              {projectInfo === null ? (
                <Skeleton className="w-22 h-10 rounded-full" />
              ) : (
                <>
                  <ShieldCheck className="size-8" /> {projectInfo.certificate}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link className="ml-auto" to="/certificate">
              <Button variant="ghost">
                관리하기 <ArrowRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">SSH 포트포워딩</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-center items-center gap-4 font-bold text-4xl">
              {projectInfo === null ? (
                <Skeleton className="w-22 h-10 rounded-full" />
              ) : (
                <>
                  <Server className="size-8" /> {projectInfo.forwarding}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link className="ml-auto" to="/forwarding">
              <Button variant="ghost">
                관리하기 <ArrowRight />
              </Button>
            </Link>
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
              {logs === null ? (
                <>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                </>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    조회된 로그가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{TypeLabels[log.type]}</Badge>
                        <Badge variant="secondary">{ActionLabels[log.action]}</Badge>
                        <div>{log.description.split('\n').join(' / ')}</div>
                      </div>
                    </TableCell>
                    <TableCell className="truncate max-w-32 text-center">{log.user.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Link className="ml-auto" to="/log">
            <Button variant="ghost">
              모든 기록 보기 <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
