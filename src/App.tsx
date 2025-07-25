
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './contexts/SimpleAuth0Context' // Complex Auth0 context - disabled
import { SimpleAuth0Provider as AuthProvider } from './contexts/SimpleAuth0Context' // Simple Auth0 auth
import { Auth0ProviderWrapper } from './providers/Auth0Provider'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import { AuthCallback } from './pages/AuthCallback'
import Index from './pages/Index'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import BuyerAuth from './pages/BuyerAuth'
import AgentAuth from './pages/AgentAuth'
import AdminAuth from './pages/AdminAuth'
import BuyerDashboard from './pages/BuyerDashboard'
import AgentDashboard from './pages/AgentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Subscriptions from './pages/Subscriptions'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import HomebuyingGuide from './pages/HomebuyingGuide'
import AgentLanding from './pages/AgentLanding'
import SingleHomeTour from './pages/SingleHomeTour'
import TourSession from './pages/TourSession'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import { useAnalytics } from './hooks/useAnalytics'
import { useAutomaticIDXPropertySaver } from './hooks/useAutomaticIDXPropertySaver'
import './utils/initializeIDXExtractor'
import './utils/iHomeFinderExtractor'
import RedesignedBuyerDashboard from './pages/RedesignedBuyerDashboard'
import SignAgreement from './pages/SignAgreement'
import OfferQuestionnaire from './pages/OfferQuestionnaire'
import MyOffers from './pages/MyOffers'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import Search from './pages/Search'
import Idx from './pages/Idx'
import Listing from './pages/Listing'
import ListingDetails from './pages/ListingDetails'
import Listings from './pages/Listings'
import ScheduleTour from './pages/ScheduleTour'
import MakeOffer from './pages/MakeOffer'
import AuthDebug from './pages/AuthDebug'
import Auth0Debug from './pages/Auth0Debug'
import TestAuth from './pages/TestAuth'
import OAuthCallback from './pages/OAuthCallback'
// import Auth0Callback from './pages/Auth0Callback' // Old complex callback
import Auth0Callback from './pages/Auth0CallbackSimple' // Simplified Auth0 callback
// import Debug from './pages/Debug' // Commented out for production

const queryClient = new QueryClient()

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
};

// IDX Property Saver wrapper component
const IDXPropertySaverWrapper = ({ children }: { children: React.ReactNode }) => {
  useAutomaticIDXPropertySaver();
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0ProviderWrapper>
        <AuthProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsWrapper>
              <IDXPropertySaverWrapper>
                <ScrollToTop />
                <Navigation />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/test" element={<TestAuth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<Auth0Callback />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />

                {/* IDX Pages - Public Routes */}
                <Route path="/idx" element={<Idx />} />
                <Route path="/listing" element={<Listing />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listing/:listingId" element={<ListingDetails />} />

                {/* Authentication Pages */}
                <Route path="/buyer-auth" element={<BuyerAuth />} />
                <Route path="/agent-auth" element={<AgentAuth />} />
                <Route path="/admin-auth" element={<AdminAuth />} />

                {/* Onboarding - Protected Route */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Dashboards with specific user type requirements */}
                <Route
                  path="/buyer-dashboard"
                  element={
                    <ProtectedRoute requiredUserType="buyer">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* New Redesigned Buyer Dashboard */}
                <Route
                  path="/buyer-dashboard-v2"
                  element={
                    <ProtectedRoute requiredUserType="buyer">
                      <RedesignedBuyerDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/agent-dashboard"
                  element={
                    <ProtectedRoute requiredUserType="agent">
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requiredUserType="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* My Offers - Protected Route for buyers only */}
                <Route
                  path="/my-offers"
                  element={
                    <ProtectedRoute requiredUserType="buyer">
                      <MyOffers />
                    </ProtectedRoute>
                  }
                />

                {/* Profile - Protected Route for both buyers and agents */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Offer Questionnaire - Protected Route for buyers only */}
                <Route
                  path="/offer-questionnaire"
                  element={
                    <ProtectedRoute requiredUserType="buyer">
                      <OfferQuestionnaire />
                    </ProtectedRoute>
                  }
                />

                {/* Informational Pages */}
                <Route path="/homebuying-guide" element={<HomebuyingGuide />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/agents" element={<AgentLanding />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/single-home-tour" element={<SingleHomeTour />} />
                <Route path="/tour-session" element={<TourSession />} />

                {/* Legacy Dashboard Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Property Search Pages */}
                <Route path="/search" element={<Search />} />

                {/* Tour and Offer Pages */}
                <Route path="/schedule-tour" element={<ScheduleTour />} />
                <Route path="/make-offer" element={<MakeOffer />} />
                
                {/* Debug Pages */}
                <Route path="/auth0-debug" element={<Auth0Debug />} />
                {/* <Route path="/debug" element={<Debug />} /> */}

                {/* Agreement signing page */}
                <Route path="/sign-agreement" element={<SignAgreement />} />

                {/* Auth Debug Page - Temporary */}
                <Route path="/auth-debug" element={<AuthDebug />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
                </Routes>
              </IDXPropertySaverWrapper>
            </AnalyticsWrapper>
          </BrowserRouter>
        </TooltipProvider>
        </AuthProvider>
      </Auth0ProviderWrapper>
    </QueryClientProvider>
  )
}

export default App
