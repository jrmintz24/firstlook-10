
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import HeroSection from '../components/home/HeroSection'
import HowItWorks from '../components/HowItWorks'
import WhyChooseSection from '../components/home/WhyChooseSection'
import TrustIndicators from '../components/TrustIndicators'
import ProblemSolutionSection from '../components/ProblemSolutionSection'
import IndustryChangesSection from '../components/IndustryChangesSection'
import FinalCTASection from '../components/home/FinalCTASection'
import QuickSignInModal from '../components/property-request/QuickSignInModal'
import { useToast } from '../hooks/use-toast'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Handle redirects for authenticated users
  useEffect(() => {
    if (!loading && user) {
      const userType = user.user_metadata?.user_type;
      const dashboardPath = userType === 'agent'
        ? '/agent-dashboard'
        : userType === 'admin'
        ? '/admin-dashboard'
        : '/buyer-dashboard';
      
      console.log('Redirecting authenticated user to:', dashboardPath);
      window.location.href = dashboardPath;
    }
  }, [user, loading]);

  const handleRequestShowing = () => {
    if (user) {
      // User is signed in, redirect to correct dashboard based on user type
      const userType = user.user_metadata?.user_type;
      const dashboardPath = userType === 'agent'
        ? '/agent-dashboard'
        : userType === 'admin'
        ? '/admin-dashboard'
        : '/buyer-dashboard';
      window.location.href = dashboardPath;
    } else {
      // Show auth modal for quick sign up
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    toast({
      title: "Welcome to FirstLook!",
      description: "You're now ready to request your first home showing.",
    })
    // The redirect will be handled by the useEffect above
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onRequestShowing={handleRequestShowing} />

      {/* Industry Changes Section */}
      <IndustryChangesSection />

      {/* How It Works */}
      <HowItWorks onStartTour={handleRequestShowing} />

      {/* Why Choose Section */}
      <WhyChooseSection />

      {/* Problem/Solution Section */}
      <ProblemSolutionSection onRequestShowing={handleRequestShowing} />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Final CTA */}
      <FinalCTASection onRequestShowing={handleRequestShowing} />

      {/* Quick Sign In Modal */}
      <QuickSignInModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultUserType="buyer"
      />
    </div>
  )
}
