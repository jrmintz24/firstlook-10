
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import AgentLanding from "./pages/AgentLanding";
import BuyerDashboard from "./pages/BuyerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Subscriptions from "./pages/Subscriptions";
import SingleHomeTour from "./pages/SingleHomeTour";
import TourSession from "./pages/TourSession";
import NotFound from "./pages/NotFound";
import BuyerAuth from "./pages/BuyerAuth";
import AgentAuth from "./pages/AgentAuth";
import AdminAuth from "./pages/AdminAuth";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

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
              <Route path="/faq" element={<FAQ />} />
              <Route path="/agents" element={<AgentLanding />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/single-home-tour" element={<SingleHomeTour />} />
              <Route path="/tour-session" element={<TourSession />} />
              <Route path="/buyer-auth" element={<BuyerAuth />} />
              <Route path="/agent-auth" element={<AgentAuth />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
