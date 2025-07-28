
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import HeroSection from '../components/buyer-os/HeroSection'
import FAQSection from '../components/buyer-os/FAQSection'
import ValueProposition from '../components/buyer-os/ValueProposition'
import HowItWorks from '../components/buyer-os/HowItWorks'
import IndustryAndStories from '../components/buyer-os/IndustryAndStories'
import CommissionExplainer from '../components/buyer-os/CommissionExplainer'
import PricingSection from '../components/buyer-os/PricingSection'
import TrustIndicators from '../components/buyer-os/TrustIndicators'
import FinalCTASection from '../components/buyer-os/FinalCTASection'
import TourQuotaBanner from '../components/buyer-os/TourQuotaBanner'
import ProblemBridge from '../components/buyer-os/ProblemBridge'
import ModernTourSchedulingModal from '../components/ModernTourSchedulingModal'
import AnimatedSection from '../components/ui/AnimatedSection'
import { useTourQuota } from '../hooks/useTourQuota'
import { useToast } from '../hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showTourModal, setShowTourModal] = useState(false)
  const tourQuota = useTourQuota()

  const handleStartTour = () => {
    // Check if user has exceeded their tour quota
    if (user && tourQuota.isExceeded && !tourQuota.loading) {
      toast({
        title: "Tour Limit Reached",
        description: "You've used all your tours this month. Upgrade your plan for more access.",
        variant: "destructive"
      });
      return;
    }
    
    setShowTourModal(true)
  }

  const handleTourModalSuccess = async () => {
    console.log('Index: Tour modal success - user authenticated:', !!user);
    
    // Simplified success handling - let natural auth flow work
    if (user) {
      console.log('Index: User authenticated, navigating to dashboard');
      toast({
        title: "Tour Request Submitted!",
        description: "Redirecting to your dashboard...",
      });
      navigate('/buyer-dashboard', { replace: true });
    } else {
      console.log('Index: User not authenticated - auth flow will handle navigation');
      // For unauthenticated users, the auth flow will handle navigation
      // The pending tour will be processed when they land on the dashboard
    }
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // For authenticated users, show the homepage normally - let them interact with it
  // The tour modal will handle proper navigation after tour submission

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onStartTour={handleStartTour} />

      {/* FAQ Section - moved directly after hero */}
      <AnimatedSection animation="fade-up" delay={100}>
        <FAQSection />
      </AnimatedSection>

      {/* Value Proposition */}
      <AnimatedSection animation="fade-up" delay={200}>
        <ValueProposition />
      </AnimatedSection>

      {/* Trust Indicators - moved up for early social proof */}
      <AnimatedSection animation="fade-in" delay={150}>
        <TrustIndicators />
      </AnimatedSection>

      {/* Problem Bridge - explains the core issue before solution */}
      <AnimatedSection animation="fade-up" delay={100}>
        <ProblemBridge />
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection animation="slide-up" delay={100}>
        <HowItWorks />
      </AnimatedSection>

      {/* Industry Context + Real Buyer Stories Combined */}
      <AnimatedSection animation="fade-up" delay={150}>
        <IndustryAndStories />
      </AnimatedSection>

      {/* Commission Explainer */}
      <AnimatedSection animation="scale-in" delay={100}>
        <CommissionExplainer />
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection animation="fade-up" delay={100}>
        <PricingSection onStartTour={handleStartTour} />
      </AnimatedSection>

      {/* Final CTA Section */}
      <AnimatedSection animation="slide-up" delay={100}>
        <FinalCTASection onRequestShowing={handleStartTour} />
      </AnimatedSection>

      {/* Tour Quota Banner - only show for authenticated users who exceeded quota */}
      {user && tourQuota.isExceeded && !tourQuota.loading && (
        <TourQuotaBanner 
          used={tourQuota.used}
          limit={tourQuota.limit}
          planTier={user.user_metadata?.plan_tier || 'free'}
        />
      )}

      {/* Modern Tour Scheduling Modal - Only render when needed */}
      {showTourModal && (
        <ModernTourSchedulingModal 
          isOpen={showTourModal}
          onClose={() => setShowTourModal(false)}
          onSuccess={handleTourModalSuccess}
          skipNavigation={false}
        />
      )}
    </div>
  )
}
