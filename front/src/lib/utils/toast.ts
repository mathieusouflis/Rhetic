import toast from "react-hot-toast";

export const toastUtils = {
  loading: (message: string = "Chargement en cours...") => {
    return toast.loading(message);
  },

  success: (message: string = "Opération réussie", id?: string) => {
    if (id) {
      toast.success(message, { id });
    } else {
      toast.success(message);
    }
  },

  error: (message: string = "Une erreur est survenue", id?: string) => {
    if (id) {
      toast.error(message, { id });
    } else {
      toast.error(message);
    }
  },

  info: (message: string) => {
    toast(message);
  },

  dismiss: (id: string) => {
    toast.dismiss(id);
  },

  dismissAll: () => {
    toast.dismiss();
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    const {
      loading = "Chargement en cours...",
      success = "Opération réussie",
      error = "Une erreur est survenue",
    } = messages;

    return toast.promise(promise, {
      loading,
      success,
      error: (err) => err?.message || error,
    });
  },

  withApiCall: async <T>(
    apiCall: () => Promise<T>,
    messages: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ): Promise<T> => {
    const {
      loading = "Chargement en cours...",
      success = "Opération réussie",
      error = "Une erreur est survenue",
    } = messages;

    const toastId = toast.loading(loading);

    try {
      const result = await apiCall();
      toast.success(success, { id: toastId });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || error;
      toast.error(errorMessage, { id: toastId });
      throw err;
    }
  },
};
