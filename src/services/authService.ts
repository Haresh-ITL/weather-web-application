import { authClient } from "./apiClient";

export const register = async (userData: { name: string; email: string; password: string }) => {
  return authClient.post("/register", userData);
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await authClient.post("/login", credentials);
  const { token } = response.data;
  localStorage.setItem("token", token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
