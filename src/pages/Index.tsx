
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import HowItWorks from "@/components/HowItWorks";
import TrustIndicators from "@/components/TrustIndicators";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import IndustryChangesSection from "@/components/IndustryChangesSection";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import MembershipPreviewSection from "@/components/home/MembershipPreviewSection";
import OfferSupportSection from "@/components/home/OfferSupportSection";

const Index = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleRequestShowing = () => {
    if (user) {
      navigate(
        user.user_metadata?.user_type === 'agent'
          ? '/agent-dashboard'
          : '/buyer-dashboard'
      );
    } else {
      setShowPropertyForm(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    navigate(
      user.user_metadata?.user_type === 'agent'
        ? '/agent-dashboard'
        : '/buyer-dashboard'
    );
    return null;
  }

  return (
    <div className="min-h-screen">
      <HeroSection onRequestShowing={handleRequestShowing} />
      <IndustryChangesSection />
      <TrustIndicators />
      <HowItWorks />
      <MembershipPreviewSection onRequestShowing={handleRequestShowing} />
      <WhyChooseSection />
      <ProblemSolutionSection onRequestShowing={handleRequestShowing} />
      <OfferSupportSection />
      <FAQSection />
      <FinalCTASection onRequestShowing={handleRequestShowing} />

      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />

      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FirstLook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
