export interface Routing {
  id: number;
  name: string;
  domain: string;
  ip: string;
  port: number;
  createdAt: string;
  updatedAt: string;
  certificateId: number | undefined;
  caching: boolean;
}
