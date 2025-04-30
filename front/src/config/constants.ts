export const APP_CONFIG = {
  name: "Rhetic",
  version: "0.1.0",
  description: "Application Rhetic",
  locale: "fr-FR",
  theme: {
    light: "light",
    dark: "dark",
  },
} as const;

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  IS_PROD: process.env.NODE_ENV === "production",
} as const;

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    // FORGOT_PASSWORD: "/auth/forgot-password",
    // RESET_PASSWORD: "/auth/reset-password",
  },
  POPULAR: "/popular",
  EXPLORE: "/explore",
  NOTIFICATIONS: "/notifications",
  MESSAGES: "/messages",
  SAVED: "/saved",
  PROFILE: "/profile",
  USER: "/users/:user_id",
  POST: "/posts/:post_id",
  RHETIC: "/rhetic/:rhetic_id",
  RHETIC_SETTINGS: {
    GENERAL: "/rhetic/:rhetic_id/settings/general",
  },
  COMMENT: "/comment/:comment_id",
  SETTINGS: {
    ACCOUNT: "/settings/account",
    PROFILE: "/settings/profile",
    NOTIFICATIONS: "/settings/notifications",
    SHORTCUTS: "/settings/shortcuts",
    GENERAL: "/settings/general",
    LANGUAGE: "/settings/language",
  },
} as const;
