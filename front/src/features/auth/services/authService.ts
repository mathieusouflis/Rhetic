import { apiClient } from "@/lib/api/apiClient";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
  ResetPasswordData,
} from "../types/auth.types";

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return {
      user: response.data.user,
      token: response.data.jwt,
    };
  },

  async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return {
      user: response.data.user,
      token: response.data.jwt,
    };
  },

  async logout() {
    localStorage.removeItem("token");
  },

  async getProfile() {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async updateProfile(id: number, data: Partial<User>) {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE(id.toString()),
      data
    );
    return response.data;
  },

  async forgotPassword(email: string) {
    return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(data: ResetPasswordData) {
    return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
