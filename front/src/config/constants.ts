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

export const ICONS = {
  default_rhetic:
    "https://plus.unsplash.com/premium_vector-1736179520150-670b3f9460fe?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  default_user:
    "https://plus.unsplash.com/premium_vector-1736285114948-cf14eaca8475?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export const ROUTES = {
  AUTH: {
    LOGIN: { path: "/login", isPublic: true },
    SOCIAL: { path: "/auth/socials", isPublic: true },
    REGISTER: { path: "/register", isPublic: true },
    FORGOT_PASSWORD: { path: "/forgot-password", isPublic: true },
    RESET_PASSWORD: { path: "/reset-password", isPublic: true },
  },

  HOME: { path: "/", isPublic: false },
  EXPLORE: { path: "/explore", isPublic: false },
  POPULAR: { path: "/popular", isPublic: false },

  USER: {
    PROFILE: { path: "/profile", isPublic: false },
    NOTIFICATIONS: { path: "/notifications", isPublic: false },
    MESSAGES: { path: "/messages", isPublic: false },
    SAVED: { path: "/saved", isPublic: false },
    DETAILS: { path: "/users/:user_id", isPublic: false },
  },

  CONTENT: {
    POST: { path: "/posts/:id", isPublic: false },
    RHETIC: { path: "/rhetic/:id", isPublic: false },
    COMMENT: { path: "/comment/:id", isPublic: false },
  },

  SETTINGS: {
    ACCOUNT: { path: "/settings/account", isPublic: false },
    PROFILE: { path: "/settings/profile", isPublic: false },
    NOTIFICATIONS: { path: "/settings/notifications", isPublic: false },
    SHORTCUTS: { path: "/settings/shortcuts", isPublic: false },
    GENERAL: { path: "/settings/general", isPublic: false },
    LANGUAGE: { path: "/settings/language", isPublic: false },
  },

  RHETIC_SETTINGS: {
    GENERAL: { path: "/rhetic/:rhetic_id/settings/general", isPublic: false },
  },
} as const;
