export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
