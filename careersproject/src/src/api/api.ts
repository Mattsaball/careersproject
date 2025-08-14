// src/api/api.ts
import axios from "axios";

// If you prefer env vars later, swap to import.meta.env.VITE_API_URL
const BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // set true only if you use cookies
});

// Optional: attach JWT automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
