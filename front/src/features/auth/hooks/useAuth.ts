import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { setAuthToken, removeAuthToken } from "../utils/authUtils";

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuthToken(data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuthToken(data.token);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      removeAuthToken();
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authService.getProfile,
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
