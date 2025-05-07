import type { QueryParams, StrapiDataStructure } from "@/types/api";
import qs from "qs";

export function buildStrapiQuery(params: QueryParams): string {
  // Strapi v4 specific configuration
  return qs.stringify(params, {
    encodeValuesOnly: true, // Encode values only (not keys)
    addQueryPrefix: false, // Don't add '?' at the beginning
    arrayFormat: "brackets", // Format arrays with brackets
    encode: false, // Don't encode already encoded values
    strictNullHandling: false, // Handle null values properly
  });
}

export function normalizeStrapiResponse<T>(
  response: StrapiDataStructure<T>
): T & { id: string } {
  return {
    id: response.id,
    ...response.attributes,
  };
}

export function normalizeStrapiCollection<T>(
  collection: StrapiDataStructure<T>[]
): (T & { id: string })[] {
  return collection.map(normalizeStrapiResponse);
}
