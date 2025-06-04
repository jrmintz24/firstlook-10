
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import HowItWorks from "@/components/HowItWorks";
import TrustIndicators from "@/components/TrustIndicators";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import IndustryChangesSection from "@/components/IndustryChangesSection";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import FinalCTASection from "@/components/home/FinalCTASection";

const Index = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();

  const handleRequestShowing = () => {
    if (user) {
      // If user is authenticated, go directly to dashboard
      const dashboardPath = userType === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
      navigate(dashboardPath);
    } else {
      // If not authenticated, show property form which will lead to sign up
      setShowPropertyForm(true);
    }
  };

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && userType) {
      const dashboardPath = userType === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
      navigate(dashboardPath);
    }
  }, [user, userType, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Don't render the home page if user is authenticated and will be redirected
  if (user && userType) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
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

      {/* Why Choose FirstLook */}
      <WhyChooseSection />

      {/* Problem-Solution Section */}
      <ProblemSolutionSection />

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
