
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Index";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HomeBuyingGuide from "./pages/HomebuyingGuide";
import ScrollToTop from "./components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import Subscriptions from "./pages/Subscriptions";
import BuyerDashboard from "./pages/BuyerDashboard";
import OptimizedBuyerDashboard from "./pages/OptimizedBuyerDashboard";
import EnhancedBuyerDashboard from "./pages/EnhancedBuyerDashboard";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/homebuying-guide" element={<HomeBuyingGuide />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route
                path="/agent-dashboard"
                element={
                  <ProtectedRoute>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/optimized-buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <OptimizedBuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/enhanced-buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <EnhancedBuyerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
