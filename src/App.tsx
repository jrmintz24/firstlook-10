
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AuthCallback } from './pages/AuthCallback';
import BuyerAuth from './pages/BuyerAuth';
import AgentAuth from './pages/AgentAuth';
import AgentLanding from './pages/AgentLanding';
import BuyerDashboard from './pages/BuyerDashboard';
import RedesignedBuyerDashboard from './pages/RedesignedBuyerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminAuth from './pages/AdminAuth';
import SignAgreement from './pages/SignAgreement';
import TourSession from './pages/TourSession';
import SingleHomeTour from './pages/SingleHomeTour';
import HomebuyingGuide from './pages/HomebuyingGuide';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Subscriptions from './pages/Subscriptions';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import OfferQuestionnaire from './pages/OfferQuestionnaire';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/buyer-auth" element={<BuyerAuth />} />
          <Route path="/agent-auth" element={<AgentAuth />} />
          <Route path="/agent-landing" element={<AgentLanding />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <BuyerDashboard />
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
            path="/redesigned-buyer-dashboard" 
            element={
              <ProtectedRoute>
                <RedesignedBuyerDashboard />
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
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Offer Creation Route */}
          <Route 
            path="/offer-questionnaire" 
            element={
              <ProtectedRoute>
                <OfferQuestionnaire />
              </ProtectedRoute>
            } 
          />
          
          {/* Other Routes */}
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/sign-agreement/:token" element={<SignAgreement />} />
          <Route path="/tour-session/:id" element={<TourSession />} />
          <Route path="/single-home-tour" element={<SingleHomeTour />} />
          <Route path="/homebuying-guide" element={<HomebuyingGuide />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
