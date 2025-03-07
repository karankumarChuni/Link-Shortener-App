import axios from "axios";

// Get API URL from environment, default to localhost if missing
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (credentials) =>
  api.post("/auth/register", credentials);
export const shortenUrl = (url) =>
  api.post("/urls/shorten", { originalUrl: url });
export const getUrlStats = () => api.get("/urls/stats");
