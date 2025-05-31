
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import DCBuyers from "./pages/DCBuyers";
import FAQ from "./pages/FAQ";
import AgentLanding from "./pages/AgentLanding";
import BuyerDashboard from "./pages/BuyerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dc-buyers" element={<DCBuyers />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/agents" element={<AgentLanding />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
