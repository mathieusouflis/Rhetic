import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
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

export interface ApiConfig extends AxiosRequestConfig {
  baseURL: string;
  timeout: number;
}

export interface ApiError extends AxiosError {
  status?: number;
  message: string;
  details?: Record<string, any>;
}
