export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface UserPreferences {
  id: string;
  theme: "light" | "dark" | "auto";
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  showNsfw: boolean;
  user: User;
}

export interface UserBlock {
  id: string;
  blocker: User;
  blocked: User;
  reason?: string;
  createdAt: string;
}
