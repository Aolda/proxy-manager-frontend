export type Action = 'create' | 'update' | 'delete';
export type Type = 'routing' | 'certificate' | 'forwarding';

export const ActionLabels: Record<Action, string> = {
  create: '생성',
  update: '수정',
  delete: '삭제',
};

export const TypeLabels: Record<Type, string> = {
  routing: '라우팅',
  certificate: '인증서',
  forwarding: '포워딩',
};

export interface Log {
  id: number;
  user: {
    id: string;
    name: string;
  };
  action: Action;
  type: Type;
  description: string;
  createdAt: string;
}

export interface LogListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  contents: Log[];
  first: boolean;
  last: boolean;
}
