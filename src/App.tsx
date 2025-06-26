import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BuyerDashboard from './pages/BuyerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import PropertyDetails from './pages/PropertyDetails';
import AgentDetails from './pages/AgentDetails';
import ShowingRequestForm from './components/ShowingRequestForm';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import TourAgreementPage from "@/pages/TourAgreement";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
           <Route path="/agents/:id" element={<AgentDetails />} />
          <Route path="/request-showing" element={<ShowingRequestForm />} />
          <Route path="/tour-agreement" element={<TourAgreementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
