
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { queryClient } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import DCBuyers from "./pages/DCBuyers";
import FAQ from "./pages/FAQ";
import AgentLanding from "./pages/AgentLanding";
import AgentDashboard from "./pages/AgentDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";
import AgentSignup from "./pages/AgentSignup";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
              <Navigation />
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dc-buyers" element={<DCBuyers />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/agents" element={<AgentLanding />} />
                  <Route path="/agent-signup" element={<AgentSignup />} />
                  <Route path="/agent-dashboard" element={<AgentDashboard />} />
                  <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
