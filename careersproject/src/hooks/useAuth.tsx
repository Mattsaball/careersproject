import { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; email: string; name?: string };
type Auth = { token: string; user: User } | null;

const Ctx = createContext<{
  auth: Auth;
  setAuth: (a: Auth) => void;
  logout: () => void;
}>({ auth: null, setAuth: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, _setAuth] = useState<Auth>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        _setAuth(JSON.parse(raw));
      } catch {}
    }
  }, []);

  function setAuth(a: Auth) {
    _setAuth(a);
    if (a) localStorage.setItem("auth", JSON.stringify(a));
    else localStorage.removeItem("auth");
  }

  function logout() {
    setAuth(null);
  }

  return (
    <Ctx.Provider value={{ auth, setAuth, logout }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
