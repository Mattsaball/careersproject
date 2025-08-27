// careersproject/src/api/api.ts

// ========================
// Auth helpers (expected by App.tsx / useAuth.tsx / LoginForm.tsx)
// ========================
const TOKEN_KEY = "token";

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

export function setAuthToken(token: string) {
  tokenStore.set(token);
}

export function clearAuthToken() {
  tokenStore.clear();
}

export function bootstrapAuthFromStorage() {
  const existing = tokenStore.get();
  if (existing) {
    // If you switch to axios later, set default header here.
    // axios.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
  }
}

function getAuthHeaders() {
  const token = tokenStore.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========================
// Types
// ========================
export type JourneyFilters = {
  industries?: string[];
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
};

export type JourneyDTO = {
  id: number | string;
  name?: string;
  anonymous?: boolean;
  linkedin?: string;
  graduationYear?: number | string;
  clubs?: string;
  resources?: string;
  advice?: string;
  missed?: string;
  industries?: string[];
  createdAt?: string;
};

export type JourneyPage = {
  content: JourneyDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
};

export type JourneyCreate = {
  name?: string;
  anonymous: boolean;
  linkedin?: string;
  graduationYear?: number | string | null;
  clubs?: string;
  resources?: string;
  advice?: string;
  missed?: string;
  industries: string[];
};

export type AuthUser = { id: number; name: string; email: string };
export type AuthResponse = { token: string; user: AuthUser };

// ========================
// UI labels (optional)
// ========================
export const INDUSTRY_LABELS: Record<string, string> = {
  FINANCE: "Finance",
  TECH: "Tech",
  ENGINEERING: "Engineering",
  EDUCATION: "Education",
  PRE_LAW: "Pre-Law",
  PRE_MED: "Pre-Med",
  ACADEMIA: "Academia",
  ARTS: "Arts",
  GOVERNMENT: "Government",
};

// ========================
// API base + small utilities
// ========================
const BASE = "http://localhost:8080";

function toAbsUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${BASE}${path}`;
  return `${BASE}/${path}`;
}

async function parseMaybeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text }; // wrap plain text so callers can still read an error
  }
}

// --- fetch helpers that return AXIOS-LIKE objects ({ data, status, headers }) ---
type AxiosLike<T> = { data: T; status: number; headers: Record<string, string> };

async function httpGetAxios<T = any>(path: string): Promise<AxiosLike<T>> {
  const res = await fetch(toAbsUrl(path), { headers: { ...getAuthHeaders() } });
  const data = await parseMaybeJson(res);
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || "Request failed";
    throw new Error(msg);
  }
  return {
    data: data as T,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
  };
}

async function httpJsonAxios<T = any, B = unknown>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: B
): Promise<AxiosLike<T>> {
  const res = await fetch(toAbsUrl(path), {
    method,
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const data = await parseMaybeJson(res);
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || "Request failed";
    throw new Error(msg);
  }
  return {
    data: data as T,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
  };
}

// ========================
// High-level API calls (typed) — all return axios-like ({ data, ... })
// ========================
export async function getIndustries() {
  return httpGetAxios<string[]>("/api/journeys/industries");
}

export async function getJourneys(filters: JourneyFilters) {
  const p = new URLSearchParams();
  filters.industries?.forEach((i) => p.append("industries", i));
  if (filters.page != null) p.set("page", String(filters.page));
  if (filters.size != null) p.set("size", String(filters.size));
  if (filters.sort) p.set("sort", filters.sort);
  if (filters.q) p.set("q", filters.q);

  return httpGetAxios<JourneyPage>(`/api/journeys?${p.toString()}`);
}

export async function createJourney(payload: JourneyCreate) {
  return httpJsonAxios<JourneyDTO, JourneyCreate>("/api/journeys", "POST", payload);
}

// ---- Auth ----
  // ---- Auth (unauthenticated fetch) ----
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // <-- no auth header
    body: JSON.stringify({ email, password }),
  });
  const data: AuthResponse = await res.json();
  if (!res.ok) throw new Error((data as any)?.message || "Login failed");
  if (data?.token) setAuthToken(data.token);
  return { data, status: res.status, headers: Object.fromEntries(res.headers.entries()) };
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // <-- no auth header
    body: JSON.stringify({ name, email, password }),
  });
  const data: AuthResponse = await res.json();
  if (!res.ok) throw new Error((data as any)?.message || "Register failed");
  if (data?.token) setAuthToken(data.token);
  return { data, status: res.status, headers: Object.fromEntries(res.headers.entries()) };
}


export async function me() {
  return httpGetAxios<AuthUser>("/api/auth/me");
}

// ========================
// Aggregate export (axios-like compatibility too)
// ========================
const apiCompat = {
  get:  <T = any>(path: string) => httpGetAxios<T>(path),
  post: <T = any, B = any>(path: string, body?: B) => httpJsonAxios<T, B>(path, "POST", body),
  put:  <T = any, B = any>(path: string, body?: B) => httpJsonAxios<T, B>(path, "PUT", body),
  patch:<T = any, B = any>(path: string, body?: B) => httpJsonAxios<T, B>(path, "PATCH", body),
  delete:<T = any>(path: string) => httpJsonAxios<T>(path, "DELETE"),
};

export const api = {
  // high-level helpers (ALL axios-like)
  getIndustries,
  getJourneys,
  createJourney,
  INDUSTRY_LABELS,
  login,
  register,
  me,

  // token helpers
  setAuthToken,
  clearAuthToken,
  tokenStore,
  bootstrapAuthFromStorage,

  // axios-like generic methods
  get: apiCompat.get,
  post: apiCompat.post,
  put: apiCompat.put,
  patch: apiCompat.patch,
  delete: apiCompat.delete,
};

export default api;
