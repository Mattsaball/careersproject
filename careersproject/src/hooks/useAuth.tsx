// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { setAuthToken, clearAuthToken, tokenStore } from "@/api/api";

type User = { id: number; name: string; email: string };

type AuthContextType = {
  user: User | null;
  booting: boolean;
  login: (token: string, user: User) => Promise<void> | void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(true);

  // On first mount, if a token exists, validate it and hydrate user
  useEffect(() => {
    const token = tokenStore.get?.(); // depends on your api.ts; use correct getter
    if (!token) {
      setBooting(false);
      return;
    }
    setAuthToken(token); // sets axios default Authorization
    axios
      .get("/api/auth/me")
      .then((res) => setUser(res.data)) // ensure /me returns {id,name,email}
      .catch(() => {
        clearAuthToken();
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      booting,
      async login(token, u) {
        setAuthToken(token); // persist + axios header
        setUser(u);
      },
      logout() {
        clearAuthToken();
        setUser(null);
      },
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
