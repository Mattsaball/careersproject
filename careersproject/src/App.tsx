// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contribute from "./pages/Contribute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RequireAuth from "./components/RequireAuth";

// ⬅️ ensure axios has Authorization from localStorage right away
import { bootstrapAuthFromStorage } from "./api/api";
bootstrapAuthFromStorage();

const queryClient = new QueryClient();

const AppHeader = () => {
  const { auth, logout, booting } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <Link to="/">
        <h1 className="text-xl font-bold">CU Journeys</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/contribute" className="inline-block">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Contribute
          </button>
        </Link>

        {/* Avoid header flicker while /auth/me is validating */}
        {booting ? null : auth ? (
          <>
            <span className="text-sm">
              Hi, {auth.user?.name ?? auth.user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppHeader />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/contribute"
                element={
                  <RequireAuth>
                    <Contribute />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
