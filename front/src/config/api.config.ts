import { ENV } from "./constants";

export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;
