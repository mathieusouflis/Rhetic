import { API_PATHS } from "@/lib/api/config";
import { apiClient, fetchOne } from "@/lib/api/apiClient";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../types/auth.types";

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>(
      `${API_PATHS.AUTH}/local`,
      credentials
    );
    return {
      user: response.data.user,
      token: response.data.jwt,
    };
  }

  async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>(
      `${API_PATHS.AUTH}/local/register`,
      data
    );
    return {
      user: response.data.user,
      token: response.data.jwt,
    };
  }

  async getProfile() {
    let response = await fetchOne<User>(API_PATHS.USERS, "me", {
      populate: {
        avatar: true,
      },
    });

    // await fetchOne<User>(API_PATHS.USERS, response.id.toString(), {
    //   populate: {
    //     avatar: true,
    //   },
    // });

    return response;
  }

  async resetPassword(email: string) {
    return apiClient.post(`${API_PATHS.AUTH}/forgot-password`, { email });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return apiClient.post(`${API_PATHS.AUTH}/change-password`, {
      currentPassword,
      password: newPassword,
      passwordConfirmation: confirmPassword,
    });
  }

  async logout() {
    return Promise.resolve();
  }
}

export const authService = new AuthService();
