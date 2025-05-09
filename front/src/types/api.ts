export interface StrapiDataStructure<T> {
  id: string;
  attributes: T;
  vote?: any;
}

export interface StrapiResponse<T> {
  data: StrapiDataStructure<T>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  vote?: any;
}

export interface StrapiCollectionResponse<T> {
  data: StrapiDataStructure<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiConfig {
  baseURL: string;
  headers: Record<string, string>;
  timeout: number;
}

export interface QueryParams {
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  sort?: string[];
  status?: string;
  fields?: string[];
  locale?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta?: any;
  vote?: any;
}

export interface ApiCollectionResponse<T> {
  data: T[];
  meta?: any;
}

export type StrapiToAppData<T> = (strapiData: StrapiDataStructure<T>) => any;
export type StrapiToAppCollection<T> = (
  strapiCollection: StrapiDataStructure<T>[]
) => any[];