
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import HeroSection from '../components/buyer-os/HeroSection'
import ValueProposition from '../components/buyer-os/ValueProposition'
import HowItWorks from '../components/buyer-os/HowItWorks'
import TrustStory from '../components/buyer-os/TrustStory'
import IndustryContext from '../components/buyer-os/IndustryContext'
import CommissionExplainer from '../components/buyer-os/CommissionExplainer'
import PricingSection from '../components/buyer-os/PricingSection'
import FAQSection from '../components/buyer-os/FAQSection'
import TrustIndicators from '../components/buyer-os/TrustIndicators'
import FinalCTASection from '../components/buyer-os/FinalCTASection'
import TourQuotaBanner from '../components/buyer-os/TourQuotaBanner'
import ModernTourSchedulingModal from '../components/ModernTourSchedulingModal'
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
    // If user is authenticated, navigate to dashboard
    if (user) {
      toast({
        title: "Tour Request Submitted!",
        description: "Redirecting to your dashboard...",
      });
      navigate('/buyer-dashboard', { replace: true });
    } else {
      // For unauthenticated users, the auth flow will handle navigation
      console.log('Tour submitted for unauthenticated user - auth flow will handle navigation');
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

      {/* Value Proposition */}
      <ValueProposition />

      {/* How It Works */}
      <HowItWorks />

      {/* Trust Stories */}
      <TrustStory />

      {/* Industry Context - Why FirstLook Exists */}
      <IndustryContext />

      {/* Commission Explainer */}
      <CommissionExplainer />

      {/* Pricing Section */}
      <PricingSection onStartTour={handleStartTour} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Trust Indicators - moved towards bottom */}
      <TrustIndicators />

      {/* Final CTA Section */}
      <FinalCTASection onRequestShowing={handleStartTour} />

      {/* Tour Quota Banner - only show for authenticated users who exceeded quota */}
      {user && tourQuota.isExceeded && !tourQuota.loading && (
        <TourQuotaBanner 
          used={tourQuota.used}
          limit={tourQuota.limit}
          planTier={user.user_metadata?.plan_tier || 'free'}
        />
      )}

      {/* Modern Tour Scheduling Modal */}
      <ModernTourSchedulingModal 
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        onSuccess={handleTourModalSuccess}
        skipNavigation={false}
      />
    </div>
  )
}
