// src/components/RequireAuth.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, booting } = useAuth();

  // Wait for /auth/me validation to finish before deciding
  if (booting) return null; // or a tiny spinner

  if (!user) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
