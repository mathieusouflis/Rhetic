import toast from "react-hot-toast";

export async function withToast<T>(
  apiCall: () => Promise<T>,
  messages: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
): Promise<T> {
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
}
