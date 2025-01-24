import { UserData } from './UserData';

export interface TicketData {
  id: number | null;
  name: string | null;
  description: string | null;
  status: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  assignedUserId: number | null;
  assignedUser: UserData | null;
}
