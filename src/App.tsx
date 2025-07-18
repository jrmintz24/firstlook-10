
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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
import Debug from './pages/Debug'

const queryClient = new QueryClient()

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsWrapper>
              <ScrollToTop />
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

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
                
                {/* Debug Page */}
                <Route path="/debug" element={<Debug />} />

                {/* Agreement signing page */}
                <Route path="/sign-agreement" element={<SignAgreement />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
