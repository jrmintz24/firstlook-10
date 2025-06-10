
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import HeroSection from '../components/home/HeroSection'
import HowItWorks from '../components/HowItWorks'
import TrustIndicators from '../components/TrustIndicators'
import ProblemSolutionSection from '../components/ProblemSolutionSection'
import IndustryChangesSection from '../components/IndustryChangesSection'
import FinalCTASection from '../components/home/FinalCTASection'
import QuickSignInModal from '../components/property-request/QuickSignInModal'
import { useToast } from '../hooks/use-toast'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleRequestShowing = () => {
    if (user) {
      // User is signed in, redirect to property request
      window.location.href = '/dashboard'
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
    // Redirect to dashboard after successful auth
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-xl text-gray-600 mb-8">
            You're already signed in. Go to your dashboard to manage your showing requests.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
