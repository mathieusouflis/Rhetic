export interface LoginCredentials {
  identifier: string;
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
  fav_subrhetics?: number[];
  joined_subrhetics?: any;
  avatar?: string;
  bio?: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details: Record<string, any>;
}

// export interface ResetPasswordData {
//   code: string;
//   password: string;
//   passwordConfirmation: string;
// }
