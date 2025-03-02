import { Filter, Plus, Trash, HardDrive, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';

const certificates = [
  {
    id: 1,
    domain: '*.aoldacloud.com',
    created_at: '2021-09-01 11:43:00',
    updated_at: '2021-09-01 12:00:00',
    email: 'admin@aoldacloud.com',
    dns_challenge: 'cloudflare:gFMEHqxje9DPRHgyYgIVlRCkp2btVFTOkkcL1HlC1PlCsgjZK0sk9IgXgeLtvg0M',
    expires_at: '2022-09-01 12:00:00',
  },
  {
    id: 2,
    domain: '*.ajou.app',
    created_at: '2021-09-01 12:00:00',
    updated_at: '2021-09-01 12:01:00',
    email: 'admin@aoldacloud.com',
    dns_challenge: 'cloudflare:gFMEHqxje9DPRHgyYgIVlRCkp2btVFTOkkcL1HlC1PlCsgjZK0sk9IgXgeLtvg0M',
    expires_at: '2022-09-01 12:01:00',
  },
  {
    id: 3,
    domain: 'blog.username.blog',
    created_at: '2021-09-01 12:01:00',
    updated_at: '2021-09-01 13:00:00',
    email: 'username@example.com',
    dns_challenge: 'cloudflare:DFrPF3Rp70aUJOekkXobvx5yTzYGxo5cGvHJsPX3fKxVJLQsA78GcOL2v9I6Bw9s',
    expires_at: '2022-09-01 13:00:00',
  },
  {
    id: 4,
    domain: 'test.aolda.app',
    created_at: '2021-09-01 13:00:00',
    updated_at: '2021-09-02 12:00:00',
    email: 'aolda@example.com',
    dns_challenge: null,
    expires_at: '2022-09-02 12:00:00',
  },
];

export default function CertificateList() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="scroll-m-20 text-3xl font-semibold first:mt-0">SSL 인증서 설정</h1>
          <p className="mt-1 text-base text-gray-500">현재 {certificates.length}개의 SSL 인증서가 등록되어 있습니다.</p>
        </div>
        <Button className="ml-2" asChild>
          <Link to="./create">
            <Plus className="h-4 w-4" /> 새 인증서 추가
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Filter className="mr-3" />
            <Input placeholder="도메인, 관리자 이메일로 검색..." />
            <Button variant="secondary">검색</Button>
          </div>
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
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>{certificate.domain}</HoverCardTrigger>
                      <HoverCardContent className="w-80 whitespace-normal">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">
                              {certificate.dns_challenge === null ? (
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
                            <p className="text-xs text-muted-foreground mt-2">{certificate.created_at} 생성</p>
                            <p className="text-xs text-muted-foreground">{certificate.updated_at} 수정</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>{certificate.email}</TableCell>
                  <TableCell>{certificate.expires_at}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-1">
                      {certificate.dns_challenge === null ? (
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
                      <Button variant="secondary" className="size-8">
                        <Link to={`./delete/${certificate.id}`}>
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
