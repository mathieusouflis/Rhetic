export const handleUnauthorized = () => {
  localStorage.removeItem("token");
  console.log("Token removed from local storage");
  window.location.href = "/login";
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};
