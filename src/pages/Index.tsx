
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
import PropertyRequestForm from '../components/PropertyRequestForm'
import { useTourQuota } from '../hooks/useTourQuota'
import { useToast } from '../hooks/use-toast'

export default function Index() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [showPropertyRequestForm, setShowPropertyRequestForm] = useState(false)
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
    
    setShowPropertyRequestForm(true)
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is authenticated, let AuthContext handle redirects
  // Don't redirect here to prevent conflicts
  if (user) {
    // Show a different view for authenticated users on the home page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    )
  }

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
      <PricingSection />

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

      {/* Property Request Form Modal */}
      <PropertyRequestForm 
        isOpen={showPropertyRequestForm}
        onClose={() => setShowPropertyRequestForm(false)}
      />
    </div>
  )
}
