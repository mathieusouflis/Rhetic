const isBrowser = typeof window !== "undefined";

export const handleUnauthorized = () => {
  if (isBrowser) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

export const setAuthToken = (token: string) => {
  if (isBrowser) {
    localStorage.setItem("token", token);
  }
};

export const getAuthToken = () => {
  if (isBrowser) {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (isBrowser) {
    localStorage.removeItem("token");
  }
};
