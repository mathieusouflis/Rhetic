export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/local",
    REGISTER: "/auth/local/register",
    LOGOUT: "/auth/logout",
    ME: "/users/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: "/users/me",
    UPDATE: (id: string) => `/users/${id}`,
  },
  UPLOAD: {
    SINGLE: "/upload",
    MULTIPLE: "/upload/multiple",
  },
} as const;
