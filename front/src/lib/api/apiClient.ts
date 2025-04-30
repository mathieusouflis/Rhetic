//TODO: FAIT
import axios from "axios";
import type { ApiConfig } from "@/types/api";
import { handleUnauthorized } from "@/features/auth/utils/authUtils";
import { buildStrapiQuery } from "./strapiHelpers";
import type {
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiError,
} from "@/types/api";
import { API_CONFIG } from "@/config";

const config: ApiConfig = {
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
};

export const apiClient = axios.create(config);

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
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

// Helper functions pour les requêtes Strapi
export async function fetchOne<T>(
  endpoint: string,
  id: number,
  params?: Parameters<typeof buildStrapiQuery>[0]
) {
  const query = params ? `?${buildStrapiQuery(params)}` : "";
  const response = await apiClient.get<StrapiResponse<T>>(
    `${endpoint}/${id}${query}`
  );
  return response.data;
}

export async function fetchMany<T>(
  endpoint: string,
  params?: Parameters<typeof buildStrapiQuery>[0]
) {
  const query = params ? `?${buildStrapiQuery(params)}` : "";
  const response = await apiClient.get<StrapiCollectionResponse<T>>(
    `${endpoint}${query}`
  );
  return response.data;
}

export async function create<T>(endpoint: string, data: Partial<T>) {
  const response = await apiClient.post<StrapiResponse<T>>(endpoint, { data });
  return response.data;
}

export async function update<T>(
  endpoint: string,
  id: number,
  data: Partial<T>
) {
  const response = await apiClient.put<StrapiResponse<T>>(`${endpoint}/${id}`, {
    data,
  });
  return response.data;
}

export async function remove(endpoint: string, id: number) {
  await apiClient.delete(`${endpoint}/${id}`);
}

// Upload de fichiers
export async function upload(
  files: File | File[],
  options?: {
    ref: string;
    refId: number;
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

// Recherche avec filtres complexes
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

// Compte le nombre d'éléments
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
  return response.meta.pagination.total;
}

// Relations et peuplement automatique
export async function fetchWithRelations<T>(
  endpoint: string,
  id: number,
  relations: string[]
) {
  return fetchOne<T>(endpoint, id, {
    populate: relations,
  });
}

// Mise à jour en masse
export async function bulkUpdate<T>(
  endpoint: string,
  ids: number[],
  data: Partial<T>
) {
  const updates = ids.map((id) => update<T>(endpoint, id, data));
  return Promise.all(updates);
}

// Suppression en masse
export async function bulkDelete(endpoint: string, ids: number[]) {
  const deletions = ids.map((id) => remove(endpoint, id));
  return Promise.all(deletions);
}

// // Pagination avec curseur
// export async function fetchWithCursor<T>(
//   endpoint: string,
//   cursor?: string,
//   limit: number = 10
// ) {
//   const params = {
//     pagination: {
//       start: cursor,
//       limit,
//     },
//   };
//   return fetchMany<T>(endpoint, params);
// }

// Helper pour les locales
// export async function fetchLocalized<T>(
//   endpoint: string,
//   id: number,
//   locale: string
// ) {
//   return fetchOne<T>(endpoint, id, {
//     locale,
//   });
// }

// Export des utils de normalisation
export {
  normalizeStrapiResponse,
  normalizeStrapiCollection,
} from "./strapiHelpers";
