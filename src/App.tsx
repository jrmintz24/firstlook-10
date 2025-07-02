import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { QueryClient } from 'react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Index from './pages/Index'
import BuyerDashboard from './pages/BuyerDashboard'
import AgentDashboard from './components/dashboard/AgentDashboard'
import Subscriptions from './pages/Subscriptions'
import ScrollToTop from './components/ScrollToTop'
import { Toaster } from "@/components/ui/toaster"
import HomebuyingGuide from './pages/HomebuyingGuide'
import FAQ from './pages/FAQ'
import OfferQuestionnaire from './pages/OfferQuestionnaire'
import RedesignedBuyerDashboard from './pages/RedesignedBuyerDashboard'
import SimplifiedBuyerDashboard from './pages/SimplifiedBuyerDashboard'
import PropertyRequestDebug from './components/debug/PropertyRequestDebug'

// A wrapper for routes that checks for authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <QueryClient>
        <AuthProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route 
                path="/buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agent-dashboard" 
                element={
                  <ProtectedRoute>
                    <AgentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/homebuying-guide" element={<HomebuyingGuide />} />
              <Route path="/faq" element={<FAQ />} />
              <Route 
                path="/offer-questionnaire" 
                element={
                  <ProtectedRoute>
                    <OfferQuestionnaire />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/redesigned-buyer-dashboard" 
                element={
                  <ProtectedRoute>
                    <RedesignedBuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Add test route for simplified dashboard */}
              <Route 
                path="/buyer-dashboard-simplified" 
                element={
                  <ProtectedRoute>
                    <SimplifiedBuyerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/property-request-debug" 
                element={
                  <ProtectedRoute>
                    <PropertyRequestDebug />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClient>
    </Router>
  )
}

export default App
