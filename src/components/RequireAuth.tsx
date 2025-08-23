import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const authRaw = localStorage.getItem("auth");

  let token: string | null = null;
  if (authRaw) {
    try {
      token = JSON.parse(authRaw)?.token || null;
    } catch {
      token = null;
    }
  }

  if (!token) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}
