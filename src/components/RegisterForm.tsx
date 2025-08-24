import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/api";

export default function RegisterForm() {
  const { login } = useAuth(); // <-- use login helper
  const [search] = useSearchParams();
  const next = search.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const reg = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // Prefer backend returns { token, user } on register:
      const maybeToken = reg.data?.token;
      const maybeUser = reg.data?.user;
      if (maybeToken && maybeUser) {
        await login(maybeToken, maybeUser);
        navigate(next, { replace: true });
        return;
      }

      // Fallback: immediately login
      const { data } = await api.post("/api/auth/login", { email, password });
      await login(data.token, data.user);
      navigate(next, { replace: true });
    } catch (err: any) {
      if (err?.response?.status === 409) alert("That email is already in use.");
      else alert("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w/full max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center">Create your account</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
