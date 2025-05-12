import {
  StrapiCollectionResponse,
  StrapiResponse,
  StrapiDataStructure,
  ApiResponse,
  ApiCollectionResponse,
} from "@/types/api";
import { apiClient } from "./apiClient";
import { PaginationParams } from "./types";

export abstract class BaseService<TStrapi, TApp> {
  protected constructor(
    protected endpoint: string,
    protected transformData?: (data: StrapiDataStructure<TStrapi>) => TApp
  ) {}

  protected transformStrapiData(data: StrapiDataStructure<TStrapi>): TApp {
    if (this.transformData) {
      return this.transformData(data);
    }

    return {
      id: data.id,
      ...data.attributes,
    } as unknown as TApp;
  }

  async findAll(
    params?: PaginationParams
  ): Promise<ApiCollectionResponse<TApp>> {
    const response = await apiClient.get<StrapiCollectionResponse<TStrapi>>(
      this.endpoint,
      { params }
    );

    return {
      data: response.data.data.map((item) => this.transformStrapiData(item)),
      meta: response.data.meta,
    };
  }

  /**
   * Récupère un élément par son ID
   */
  async findOne(id: string): Promise<ApiResponse<TApp>> {
    const response = await apiClient.get<StrapiResponse<TStrapi>>(
      `${this.endpoint}/${id}`
    );

    return {
      data: this.transformStrapiData(response.data.data),
      meta: response.data.meta,
    };
  }

  async create(data: Partial<TStrapi>): Promise<ApiResponse<TApp>> {
    const response = await apiClient.post<StrapiResponse<TStrapi>>(
      this.endpoint,
      { data }
    );

    return {
      data: this.transformStrapiData(response.data.data),
      meta: response.data.meta,
    };
  }

  async update(id: string, data: Partial<TStrapi>): Promise<ApiResponse<TApp>> {
    const response = await apiClient.put<StrapiResponse<TStrapi>>(
      `${this.endpoint}/${id}`,
      { data }
    );

    return {
      data: this.transformStrapiData(response.data.data),
      meta: response.data.meta,
    };
  }

  async delete(id: string): Promise<any> {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  async count(params?: Record<string, unknown>): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      `${this.endpoint}/count`,
      { params }
    );
    return response.data.count;
  }

  async bulkDelete(ids: string[]): Promise<any> {
    const response = await apiClient.post(`${this.endpoint}/bulk-delete`, {
      ids,
    });
    return response.data;
  }

  async bulkUpdate(ids: string[], data: Partial<TStrapi>): Promise<any> {
    const response = await apiClient.put(`${this.endpoint}/bulk-update`, {
      ids,
      data,
    });
    return response.data;
  }
}
