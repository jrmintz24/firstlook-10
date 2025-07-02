
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Index";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
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
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
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
