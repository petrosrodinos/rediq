import { AuthRole } from 'generated/prisma';

export interface SafeUser {
  id: string;
  email: string;
  phone: string | null;
  role: AuthRole;
  created_at: Date;
  updated_at: Date;
}
