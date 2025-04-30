import type { StrapiResponse, StrapiCollectionResponse } from "@/types/api";

export function normalizeStrapiResponse<T>(response: StrapiResponse<T>) {
  return {
    ...response.data.attributes,
    id: response.data.id,
  } as T & { id: number };
}

export function normalizeStrapiCollection<T>(
  response: StrapiCollectionResponse<T>
) {
  return {
    data: response.data.map((item) => ({
      ...item.attributes,
      id: item.id,
    })),
    pagination: response.meta.pagination,
  };
}

export function buildStrapiQuery(params?: {
  populate?: string | string[];
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}) {
  const queryParams = new URLSearchParams();

  if (params?.populate) {
    const populate = Array.isArray(params.populate)
      ? params.populate.join(",")
      : params.populate;
    queryParams.append("populate", populate);
  }

  if (params?.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      queryParams.append(`filters[${key}]`, String(value));
    }
  }

  if (params?.sort) {
    params.sort.forEach((field) => {
      queryParams.append("sort", field);
    });
  }

  if (params?.pagination) {
    if (params.pagination.page) {
      queryParams.append("pagination[page]", String(params.pagination.page));
    }
    if (params.pagination.pageSize) {
      queryParams.append(
        "pagination[pageSize]",
        String(params.pagination.pageSize)
      );
    }
  }

  return queryParams.toString();
}
