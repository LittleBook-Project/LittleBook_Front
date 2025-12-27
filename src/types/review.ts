export interface Review {
  id: number;
  description?: string;
  reviewCreationDate?: string;
  rating?: number;
  userUuid: string;
  bookIsbn?: string;
  bookId?: string;
}

export interface CreateReviewRequest {
  description?: string;
  reviewCreationDate?: string;
  rating?: number;
  userUuid: string;
  bookIsbn?: string;
  bookId?: string;
}

export interface UpdateReviewRequest {
  description?: string;
  rating?: number;
}
