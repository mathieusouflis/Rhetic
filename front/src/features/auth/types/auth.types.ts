export interface LoginCredentials {
  identifier: string; // Strapi utilise identifier au lieu de email
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string; // Strapi renvoie un jwt
  user: User;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details: Record<string, any>;
}

export interface ResetPasswordData {
  code: string; // Strapi utilise code au lieu de token
  password: string;
  passwordConfirmation: string;
}
