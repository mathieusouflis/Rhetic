import axios from "axios";
import type { ApiConfig } from "@/types/api";
import { handleUnauthorized } from "@/features/auth/utils/authUtils";
import { buildStrapiQuery } from "./strapiHelpers";
import type { StrapiResponse, StrapiError } from "@/types/api";
import { API_CONFIG } from "@/config";

interface StrapiResponseStructure<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    [key: string]: any;
  };
}

class ApiClient {
  private client;

  constructor(config: ApiConfig) {
    this.client = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if ([401, 403].includes(error.response?.status)) {
          handleUnauthorized();
        }

        if (error.response?.data?.error) {
          const strapiError: StrapiError = error.response.data.error;
          return Promise.reject({
            ...error,
            message: strapiError.message,
            details: strapiError.details,
            status: strapiError.status,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  public get instance() {
    return this.client;
  }
}

export const apiClient = new ApiClient(API_CONFIG).instance;

export async function fetchOne<T>(
  endpoint: string,
  id: string,
  params?: Parameters<typeof buildStrapiQuery>[0]
) {
  if (!params) {
    params = { status: "published" };
  } else if (!params["status"]) {
    params["status"] = "published";
  }
  const query = params ? `?${buildStrapiQuery(params)}` : "";
  const response = await apiClient.get<T>(`${endpoint}/${id}${query}`);
  return response.data;
}

export async function fetchMany<T>(
  endpoint: string,
  params?: Parameters<typeof buildStrapiQuery>[0]
) {
  try {
    const query = params ? `?${buildStrapiQuery(params)}` : "";

    const response = await apiClient.get<StrapiResponseStructure<T[]>>(
      `${endpoint}${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Debug - Request error:", error);
    console.error("Debug - Request params:", params);
    throw error;
  }
}

export async function create<T>(endpoint: string, data: Partial<T>) {
  const response =
    data !== null
      ? await apiClient.post<StrapiResponse<T>>(endpoint, { data })
      : await apiClient.post<StrapiResponse<T>>(endpoint);
  return response.data;
}

export async function update<T>(
  endpoint: string,
  id: string,
  data: Partial<T>
) {
  const response = await apiClient.put<StrapiResponse<T>>(`${endpoint}/${id}`, {
    data,
  });
  return response.data;
}

export async function remove(endpoint: string, id: string) {
  await apiClient.delete(`${endpoint}/${id}`);
}

export async function upload(
  files: File | File[],
  options?: {
    ref: string;
    refId: string;
    field: string;
  }
) {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((file) => formData.append("files", file));
  } else {
    formData.append("files", files);
  }

  if (options) {
    formData.append("ref", options.ref);
    formData.append("refId", options.refId.toString());
    formData.append("field", options.field);
  }

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function search<T>(
  endpoint: string,
  filters: Record<string, any>,
  options?: Parameters<typeof buildStrapiQuery>[0]
) {
  const queryParams = {
    ...options,
    filters: {
      ...options?.filters,
      ...filters,
    },
  };
  return fetchMany<T>(endpoint, queryParams);
}

export async function count<T>(
  endpoint: string,
  filters?: Record<string, any>
) {
  const response = await fetchMany<T>(endpoint, {
    pagination: {
      page: 1,
      pageSize: 1,
    },
    filters,
  });
  return response.meta.pagination?.total || 0;
}

export async function fetchWithRelations<T>(
  endpoint: string,
  id: string,
  relations: string[]
) {
  return fetchOne<T>(endpoint, id, {
    populate: relations,
  });
}

export async function bulkUpdate<T>(
  endpoint: string,
  ids: string[],
  data: Partial<T>
) {
  const updates = ids.map((id) => update<T>(endpoint, id, data));
  return Promise.all(updates);
}

export async function bulkDelete(endpoint: string, ids: string[]) {
  const deletions = ids.map((id) => remove(endpoint, id));
  return Promise.all(deletions);
}

export async function joinCommunity(communityId: string | number | any) {
  const response = await apiClient.post(`/subrhetics/${communityId}/join`);
  return response.data;
}

export async function leaveCommunity(communityId: string | number | any) {
  const response = await apiClient.post(`/subrhetics/${communityId}/leave`);
  return response.data;
}

export async function upvotePost(postId: string) {
  const response = await apiClient.post(`/posts/${postId}/upvote`);
  return response.data;
}

export async function downvotePost(postId: string) {
  const response = await apiClient.post(`/posts/${postId}/downvote`);
  return response.data;
}
export async function upvoteComment(postId: string) {
  const response = await apiClient.post(`/comments/${postId}/upvote`);
  return response.data;
}

export async function downvoteComment(postId: string) {
  const response = await apiClient.post(`/comments/${postId}/downvote`);
  return response.data;
}

export async function removeVote(postId: string) {
  const response = await apiClient.delete(`/posts/${postId}/vote`);
  return response.data;
}

export async function followUser(userId: string) {
  const response = await apiClient.post(`/user-follows/${userId}/follow`);
  return response.data;
}

export async function unfollowUser(userId: string) {
  const response = await apiClient.delete(`/user-follows/${userId}/follow`);
  return response.data;
}

export {
  normalizeStrapiResponse,
  normalizeStrapiCollection,
} from "./strapiHelpers";
