import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contribute from "./pages/Contribute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Page Header */}
        <div className="flex justify-between items-center p-4 bg-white shadow-sm">
          <Link to="/">
            <h1 className="text-xl font-bold">CU Journeys</h1>
          </Link>

          <Link to="/contribute">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Contribute
            </button>
          </Link>
        </div>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
