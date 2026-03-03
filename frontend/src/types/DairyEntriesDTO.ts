export interface DairyEntriesDTO {
    _id: string;
  userId: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPrivate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
