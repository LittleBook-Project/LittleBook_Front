export interface Book {
  id: string;
  openlibraryId?: string;
  isbn10?: string;
  isbn13?: string;
  title: string;
  subtitle?: string;
  authors?: string;
  publishYear?: number;
  coverUrl?: string;
  description?: string;
  subjects?: string;
  createdAt?: string;
  updatedAt?: string;
  lastSyncedAt?: string;
}
