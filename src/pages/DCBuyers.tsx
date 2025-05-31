
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import HeroSection from "@/components/dc-buyers/HeroSection";
import TrustIndicators from "@/components/dc-buyers/TrustIndicators";
import ProblemSolutionSection from "@/components/dc-buyers/ProblemSolutionSection";
import BenefitsSection from "@/components/dc-buyers/BenefitsSection";
import NeighborhoodsSection from "@/components/dc-buyers/NeighborhoodsSection";
import TestimonialsSection from "@/components/dc-buyers/TestimonialsSection";
import HowItWorksSection from "@/components/dc-buyers/HowItWorksSection";
import LocalSEOSection from "@/components/dc-buyers/LocalSEOSection";
import FinalCTASection from "@/components/dc-buyers/FinalCTASection";

const DCBuyers = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleSignUp = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Trust Indicators */}
      <HeroSection onRequestShowing={handleRequestShowing} />
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pb-20">
        <div className="container mx-auto px-4">
          <TrustIndicators />
        </div>
      </div>

      {/* Main Content Sections */}
      <ProblemSolutionSection />
      <BenefitsSection onSignUp={handleSignUp} />
      <NeighborhoodsSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <LocalSEOSection />
      <FinalCTASection onRequestShowing={handleRequestShowing} onSignUp={handleSignUp} />

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        userType="buyer"
      />
      
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default DCBuyers;
