
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleRequestShowing = () => {
    if (user) {
      // If user is authenticated, go directly to dashboard
      navigate('/buyer-dashboard');
    } else {
      // If not authenticated, show property form which will lead to sign up
      setShowPropertyForm(true);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    navigate('/buyer-dashboard');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onRequestShowing={handleRequestShowing} />

      {/* Industry Changes Section */}
      <IndustryChangesSection />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* How It Works */}
      <HowItWorks />

      {/* Membership Preview Section */}
      <MembershipPreviewSection onRequestShowing={handleRequestShowing} />

      {/* Why Choose FirstLook */}
      <WhyChooseSection />

      {/* Problem-Solution Section */}
      <ProblemSolutionSection />

      {/* Offer Support Section */}
      <OfferSupportSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection onRequestShowing={handleRequestShowing} />

      {/* Property Request Form Modal */}
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />

      {/* Footer with updated copyright */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FirstLook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
