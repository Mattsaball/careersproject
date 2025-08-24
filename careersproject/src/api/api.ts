// src/api/api.ts
import axios, { AxiosError } from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

export const tokenStore = {
  get: () => localStorage.getItem("token"),
  set: (t: string) => localStorage.setItem("token", t),
  clear: () => localStorage.removeItem("token"),
};

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // fine to keep
});

// ---- Token helpers ----
export function setAuthToken(token: string) {
  tokenStore.set(token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthToken() {
  tokenStore.clear();
  delete api.defaults.headers.common["Authorization"];
}

// Call once on app boot to restore persisted token (if any)
export function bootstrapAuthFromStorage() {
  const token = tokenStore.get();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

// ---- Single response interceptor ----
// 401 => token invalid/expired -> clear and redirect to login.
// 403 => forbidden (feature-gated or CORS) -> DON'T auto-logout; let caller handle it.
let redirecting = false;
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    if (status === 401 && !redirecting) {
      redirecting = true;
      clearAuthToken();
      const next = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.href = `/login?next=${next}`;
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
