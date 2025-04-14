export interface Certificate {
  id: number;
  email: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  dnsChallenge: string | null;
}
