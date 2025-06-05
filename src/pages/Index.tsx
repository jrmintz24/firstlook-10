
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FullPageLoading } from "@/components/ui/loading-states";
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
  const { user, userType, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRequestShowing = () => {
    if (isAuthenticated) {
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
    if (!loading && isAuthenticated && userType) {
      const dashboardPath = userType === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, userType, loading, navigate]);

  if (loading) {
    return <FullPageLoading message="Loading FirstLook..." />;
  }

  // Don't render the home page if user is authenticated and will be redirected
  if (isAuthenticated && userType) {
    return <FullPageLoading message="Redirecting to your dashboard..." />;
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
      <div id="how-it-works-section">
        <HowItWorks />
      </div>

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
