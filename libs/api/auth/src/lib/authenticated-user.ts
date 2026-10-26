import type { Role } from '@opshub/api/prisma';

export interface AuthenticatedUser {
  id: string;
  keycloakId: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
}
