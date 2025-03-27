export type Action = 'CREATE' | 'UPDATE' | 'DELETE';
export type Type = 'ROUTING' | 'CERTIFICATE' | 'FORWARDING';

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
