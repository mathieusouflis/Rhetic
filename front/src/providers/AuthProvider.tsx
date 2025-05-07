"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/authService";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "@/features/auth/utils/authUtils";
import { ROUTES } from "@/config/constants";
import { isPublicRoute } from "@/config/routes";
import type {
  User,
  LoginCredentials,
  RegisterData,
} from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api/apiClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getProfile,
    enabled: !!getAuthToken(),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && pathname) {
      const token = getAuthToken();
      const isPublic = isPublicRoute(pathname);

      if (!token && !isPublic) {
        router.push(ROUTES.AUTH.LOGIN.path);
      }
    }
  }, [pathname, isLoading, router]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(ROUTES.HOME.path);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(ROUTES.HOME.path);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      removeAuthToken();
      queryClient.clear();
      router.push(ROUTES.AUTH.LOGIN.path);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
