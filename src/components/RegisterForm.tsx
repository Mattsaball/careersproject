import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const API = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:8080";

export default function RegisterForm() {
  const { setAuth } = useAuth();
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
      const reg = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });

      // prefer: backend returns { token, user }
      const maybeToken = reg.data?.token;
      const maybeUser = reg.data?.user;
      if (maybeToken && maybeUser) {
        setAuth({ token: maybeToken, user: maybeUser });
        navigate(next);
        return;
      }

      // fallback: immediately login
      const login = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = login.data;
      setAuth({ token, user });
      navigate(next);
    } catch (err: any) {
      if (err?.response?.status === 409) alert("That email is already in use.");
      else alert("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
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
