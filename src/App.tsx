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
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { SkipLink } from "@/components/ui/accessibility";
import { usePWA } from "@/hooks/usePWA";
import { useState, useEffect } from "react";

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isOffline } = usePWA();

  useEffect(() => {
    // Add PWA manifest to head
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add theme color meta tag
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#8B5CF6';
    document.head.appendChild(themeColorMeta);

    // Check if user needs onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    return () => {
      document.head.removeChild(manifestLink);
      document.head.removeChild(themeColorMeta);
    };
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
                <SkipLink href="#main-content">
                  Skip to main content
                </SkipLink>
                
                {isOffline && (
                  <div className="bg-yellow-500 text-yellow-900 text-center py-2 text-sm">
                    You're currently offline. Some features may be limited.
                  </div>
                )}
                
                <Navigation />
                <main id="main-content">
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
                </main>
                
                {showOnboarding && (
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                )}
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
