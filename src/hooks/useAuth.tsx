// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "@/api/api"; // <- use your existing api.ts

type User = { id: number; email: string; name?: string };
type Auth = { token: string; user: User } | null;

type AuthCtx = {
  auth: Auth;
  isBootstrapped: boolean;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
};

const Ctx = createContext<AuthCtx>({
  auth: null,
  isBootstrapped: false,
  // noops; real impl is below
  login: async () => {},
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth>(null);
  const [isBootstrapped, setBootstrapped] = useState(false);

  // ---- Boot check once ----
  useEffect(() => {
    // 1) migrate any legacy "auth" from localStorage (your old format)
    const legacyRaw = localStorage.getItem("auth");
    if (legacyRaw && !tokenStore.get()) {
      try {
        const legacy = JSON.parse(legacyRaw) as Auth;
        if (legacy?.token) tokenStore.set(legacy.token);
      } catch {}
    }

    const token = tokenStore.get();
    if (!token) {
      // no token → nothing to verify
      localStorage.removeItem("auth");
      setAuth(null);
      setBootstrapped(true);
      return;
    }

    // 2) verify current token
    api
      .get<User>("/api/auth/me")
      .then((r) => {
        const user = r.data;
        const nextAuth = { token, user };
        setAuth(nextAuth);
        localStorage.setItem("auth", JSON.stringify(nextAuth)); // keep for quick reloads
      })
      .catch(() => {
        // invalid/expired token
        tokenStore.clear();
        localStorage.removeItem("auth");
        setAuth(null);
      })
      .finally(() => setBootstrapped(true));
  }, []);

  // ---- API: login / logout / setUser ----
  const login = async (token: string, user?: User) => {
    tokenStore.set(token);
    if (user) {
      const next = { token, user };
      setAuth(next);
      localStorage.setItem("auth", JSON.stringify(next));
      return;
    }
    // if user not provided, fetch via /me
    const { data } = await api.get<User>("/api/auth/me");
    const next = { token, user: data };
    setAuth(next);
    localStorage.setItem("auth", JSON.stringify(next));
  };

  const logout = () => {
    tokenStore.clear();
    localStorage.removeItem("auth");
    setAuth(null);
    // optional: hard redirect to login
    // window.location.href = "/login";
  };

  const setUser = (u: User | null) => {
    if (!u || !auth) {
      logout();
      return;
    }
    const next = { ...auth, user: u };
    setAuth(next);
    localStorage.setItem("auth", JSON.stringify(next));
  };

  const value = useMemo(
    () => ({ auth, isBootstrapped, login, logout, setUser }),
    [auth, isBootstrapped]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
