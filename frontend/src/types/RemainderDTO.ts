export interface RemainderDTO {
    _id?: string;
  userId: string;
  time: string;
  isEnabled?: boolean;
  frequency?: 'daily' | 'weekly';
}
