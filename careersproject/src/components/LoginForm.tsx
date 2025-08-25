import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/api"; // use the shared client (with interceptors)

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // <-- use login instead of setAuth
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const next = search.get("next") || "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      // expecting { token, user }
      await login(data.token, data.user);
      navigate(next, { replace: true });
    } catch (err: any) {
      // 401s will also be handled by interceptor (redirect), but keep user-friendly msg:
      if (err?.response?.status === 401) {
        alert("Email or password is incorrect.");
      } else {
        alert("Login failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
