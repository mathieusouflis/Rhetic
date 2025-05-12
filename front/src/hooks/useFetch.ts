import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/apiClient";
import type { AxiosError, AxiosRequestConfig } from "axios";
import type { StrapiResponse, StrapiCollectionResponse } from "@/types/api";

interface UseFetchOptions<T>
  extends Omit<AxiosRequestConfig, "url" | "method"> {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: AxiosError | null;
}

export function useFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (config: AxiosRequestConfig = {}) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await apiClient.request<
          StrapiResponse<T> | StrapiCollectionResponse<T>
        >({
          url,
          ...options,
          ...config,
        });

        const data =
          "data" in response.data ? response.data.data : response.data;

        setState({
          data: data as T,
          isLoading: false,
          error: null,
        });

        options.onSuccess?.(data as T);
        return data;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({
          data: null,
          isLoading: false,
          error: axiosError,
        });

        options.onError?.(axiosError);
        throw error;
      }
    },
    [url, options]
  );

  const get = useCallback(
    (config?: AxiosRequestConfig) => execute({ ...config, method: "GET" }),
    [execute]
  );

  const post = useCallback(
    (data?: any, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "POST", data: { data } }),
    [execute]
  );

  const put = useCallback(
    (data?: any, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "PUT", data: { data } }),
    [execute]
  );

  const del = useCallback(
    (config?: AxiosRequestConfig) => execute({ ...config, method: "DELETE" }),
    [execute]
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    execute,
  };
}

// Example usage:
/*
const MyComponent = () => {
  const { data, isLoading, error, get, post } = useFetch<User>('/users', {
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  useEffect(() => {
    get();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>{data.name}</div>;
};
*/
