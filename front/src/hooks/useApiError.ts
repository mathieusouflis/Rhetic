import { useState } from "react";
import toast from "react-hot-toast";

export interface ApiError {
  status?: number;
  message: string;
  details?: Record<string, any>;
  code?: string;
  originalError?: any;
  validation?: {
    errors: Array<{ path: string; message: string; rule: string }>;
  };
}

export function useApiError() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const parseError = (err: any, fallbackMessage: string): string => {
    if (err.message) {
      return err.message;
    }

    if (err.data?.error?.message) {
      return err.data.error.message;
    }

    if (err.response?.data?.error?.message) {
      return err.response.data.error.message;
    }

    if (err.details?.errors && Array.isArray(err.details.errors)) {
      return err.details.errors.map((e: any) => e.message).join(". ");
    }

    if (err.validation?.errors && Array.isArray(err.validation.errors)) {
      return err.validation.errors.map((e: any) => e.message).join(". ");
    }

    if (err.status) {
      switch (err.status) {
        case 400:
          return "Requête invalide. Veuillez vérifier vos données.";
        case 401:
          return "Non autorisé. Veuillez vous connecter.";
        case 403:
          return "Accès refusé. Vous n'avez pas les autorisations nécessaires.";
        case 404:
          return "Ressource non trouvée.";
        case 429:
          return "Trop de requêtes. Veuillez réessayer plus tard.";
        case 500:
          return "Erreur serveur. Veuillez réessayer plus tard.";
      }
    }

    return fallbackMessage;
  };

  const executeApiCall = async <T>(
    apiCall: () => Promise<T>,
    onSuccess: (data: T) => void,
    customErrorMessage?: string,
    showToast: boolean = true
  ) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await apiCall();
      onSuccess(result);
      return result;
    } catch (err: any) {
      const errorMessage = parseError(
        err,
        customErrorMessage || "Une erreur est survenue. Veuillez réessayer."
      );

      console.error("API Error:", err);
      setError(errorMessage);

      if (showToast) {
        toast.error(errorMessage);
      }

      throw { message: errorMessage, originalError: err };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError("");

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    executeApiCall,
    clearError,
    parseError,
  };
}
