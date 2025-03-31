import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Log, LogListResponse, Action, Type, ActionLabels, TypeLabels } from '@/types/log';

interface PageInfo {
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
}

export default function LogList() {
  const { authFetch, selectedProject } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const page = parseInt(searchParams.get('page') || '1');
  const action = searchParams.get('action') as Action | null;
  const username = searchParams.get('username');
  const type = searchParams.get('type') as Type | null;

  useEffect(() => {
    setLogs(null);

    const apiSearchParams = new URLSearchParams(searchParams);
    apiSearchParams.set('page', `${page - 1}`);
    apiSearchParams.set('projectId', selectedProject?.id || '');

    authFetch(`/api/logs?${apiSearchParams.toString()}`)
      .then((response): Promise<LogListResponse> => {
        if (!response.ok) throw new Error(`로그 목록 조회 실패: (${response.status})`);

        return response.json();
      })
      .then(({ totalPages, totalElements, first, last, contents }) => {
        setLogs(contents);
        setPageInfo({ totalPages, totalElements, first, last });
      })
      .catch((error) => {
        console.error(error);
        toast.error('로그 정보를 조회할 수 없습니다.');
      });
  }, [authFetch, selectedProject, page, searchParams]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">설정 변경 로그 조회</h1>
          {pageInfo === null ? (
            <Skeleton className="w-[18rem] h-[1rem] mt-2 rounded-full" />
          ) : (
            <p className="mt-1 text-base text-gray-500">총 {pageInfo.totalElements}개의 로그가 조회되었습니다.</p>
          )}
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <Filter />
                  필터
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>설정 타입</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={type || undefined}
                  onValueChange={(value) =>
                    setSearchParams((prev) => {
                      prev.delete('page');
                      prev.set('type', value);
                      return prev;
                    })
                  }
                >
                  <DropdownMenuRadioItem value="routing">라우팅</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="forwarding">포워딩</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="certificate">인증서</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>설정 내용</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={action || undefined}
                  onValueChange={(value) =>
                    setSearchParams((prev) => {
                      prev.delete('page');
                      prev.set('action', value);
                      return prev;
                    })
                  }
                >
                  <DropdownMenuRadioItem value="create">생성</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="update">수정</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="delete">삭제</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <form
              className="flex flex-1 items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const value = searchInputRef.current?.value;
                setSearchParams((prev) => {
                  prev.delete('page');
                  if (value) prev.set('username', value);
                  else prev.delete('username');
                  return prev;
                });
              }}
            >
              <div className="flex flex-1 items-center border rounded-md px-2 gap-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {type && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSearchParams((prev) => {
                        prev.delete('page');
                        prev.delete('type');
                        return prev;
                      })
                    }
                  >
                    {TypeLabels[type]}
                    <X className="cursor-pointer" />
                  </Badge>
                )}
                {action && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSearchParams((prev) => {
                        prev.delete('page');
                        prev.delete('action');
                        return prev;
                      })
                    }
                  >
                    {ActionLabels[action]}
                    <X className="cursor-pointer" />
                  </Badge>
                )}
                <Input
                  placeholder="사용자명으로 검색..."
                  className="pl-2 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  ref={searchInputRef}
                  defaultValue={username || ''}
                />
              </div>
              <Button type="submit" variant="secondary">
                검색
              </Button>
            </form>
          </div>
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
        {pageInfo && pageInfo.totalPages !== 0 && (
          <CardFooter>
            <div className="mx-auto flex w-full justify-center gap-1">
              <PaginationPrevious
                to={`?page=${page - 1}`}
                className={cn({ 'pointer-events-none opacity-50': pageInfo.first })}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">{`${page} / ${pageInfo.totalPages} 페이지`}</Button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  <Pagination>
                    <PaginationContent className="grid gap-1 grid-cols-10">
                      {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink to={`?page=${idx + 1}`} isActive={page === idx + 1} className="w-8 h-8">
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                  </Pagination>
                </PopoverContent>
              </Popover>
              <PaginationNext
                to={`?page=${page + 1}`}
                className={cn({ 'pointer-events-none opacity-50': pageInfo.last })}
              />
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
