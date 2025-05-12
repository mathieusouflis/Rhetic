export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  populate?: string;
  locale?: string;
}

export interface QueryParams extends PaginationParams {
  [key: string]: unknown;
}
