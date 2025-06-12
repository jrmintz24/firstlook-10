
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import HeroSection from '../components/home/HeroSection'
import HowItWorks from '../components/HowItWorks'
import TrustIndicators from '../components/TrustIndicators'
import ProblemSolutionSection from '../components/ProblemSolutionSection'
import IndustryChangesSection from '../components/IndustryChangesSection'
import FinalCTASection from '../components/home/FinalCTASection'
import PropertyRequestForm from '../components/PropertyRequestForm'
import { useToast } from '../hooks/use-toast'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [showPropertyRequestForm, setShowPropertyRequestForm] = useState(false)

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
    // Open the property request form directly
    setShowPropertyRequestForm(true)
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
      <HowItWorks />

      {/* Problem/Solution Section */}
      <ProblemSolutionSection onRequestShowing={handleRequestShowing} />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Final CTA */}
      <FinalCTASection onRequestShowing={handleRequestShowing} />

      {/* Property Request Form Modal */}
      <PropertyRequestForm 
        isOpen={showPropertyRequestForm}
        onClose={() => setShowPropertyRequestForm(false)}
      />
    </div>
  )
}
