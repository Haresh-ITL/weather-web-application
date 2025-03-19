// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:3001/auth";

export const register = async (userData: { name: string; email: string; password: string }) => {
  
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (credentials:any) => {
  return axios.post(`${API_URL}/login`, credentials);
};
