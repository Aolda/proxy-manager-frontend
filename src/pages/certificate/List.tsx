import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Filter, Plus, Trash, HardDrive, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { Certificate } from '@/types/certificate';

export default function CertificateList() {
  const { selectedProject, authFetch } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [certificates, setCertificates] = useState<Certificate[] | null>([]);

  useEffect(() => {
    setCertificates(null);

    const apiSearchParams = new URLSearchParams(searchParams);
    apiSearchParams.set('projectId', selectedProject?.id || '');

    authFetch(`/api/certificates?${apiSearchParams.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error(`인증서 목록 조회 실패: (${response.status})`);

        return response.json();
      })
      .then(({ contents }) => {
        setCertificates(contents);
      })
      .catch((error) => {
        console.error(error);
        toast.error('인증서 정보를 조회할 수 없습니다.');
      });
  }, [authFetch, selectedProject, searchParams]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">SSL 인증서 설정</h1>
          {certificates === null ? (
            <Skeleton className="w-[18rem] h-[1rem] mt-2 rounded-full" />
          ) : (
            <p className="mt-1 text-base text-gray-500">
              현재 {certificates.length}개의 SSL 인증서가 등록되어 있습니다.
            </p>
          )}
        </div>
        <Button asChild>
          <Link to="./create" className={selectedProject?.role !== 'admin' ? 'opacity-50 pointer-events-none' : ''}>
            <Plus className="h-4 w-4" /> 새 인증서 추가
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('query')?.toString();
              if (query) {
                setSearchParams({ query });
              } else {
                setSearchParams({});
              }
            }}
          >
            <div className="flex w-full items-center space-x-2 mb-4">
              <Filter className="mr-3" />
              <Input placeholder="도메인, 관리자 이메일로 검색..." />
              <Button variant="secondary">검색</Button>
            </div>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>도메인</TableHead>
                <TableHead>관리자 메일</TableHead>
                <TableHead>인증서 만료일</TableHead>
                <TableHead className="w-24 min-w-24 text-center">인증 방식</TableHead>
                <TableHead className="w-16 min-w-16 text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates === null ? (
                <>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[1rem] my-2 rounded-full" />
                    </TableCell>
                  </TableRow>
                </>
              ) : certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    현재 프로젝트에 등록된 인증서가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger>{certificate.domain}</HoverCardTrigger>
                        <HoverCardContent className="w-80 whitespace-normal">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold">
                                {certificate.dnsChallenge === null ? (
                                  <Badge variant="secondary" className="mr-2">
                                    HTTP
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="mr-2">
                                    DNS
                                  </Badge>
                                )}
                                {certificate.domain}
                              </p>
                              <p className="text-sm">{certificate.email}</p>
                              <p className="text-xs text-muted-foreground mt-2">{certificate.createdAt} 생성</p>
                              <p className="text-xs text-muted-foreground">{certificate.updatedAt} 수정</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>{certificate.email}</TableCell>
                    <TableCell>{certificate.expiresAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-1">
                        {certificate.dnsChallenge === null ? (
                          <Badge variant="secondary">
                            <Globe className="h-3 w-3" />
                            HTTP
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <HardDrive className="h-3 w-3" />
                            DNS
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button disabled={selectedProject?.role !== 'admin'} variant="secondary" className="size-8">
                          <Link to={`./delete/${certificate.id}`}>
                            <Trash />
                          </Link>
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
    </div>
  );
}
