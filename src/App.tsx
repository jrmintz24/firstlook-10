
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Index';
import BuyerDashboard from './pages/BuyerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import TourAgreementPage from "./pages/TourAgreement";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/tour-agreement" element={<TourAgreementPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
