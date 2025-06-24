
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Phone, Shield, Users, ArrowRight, Sparkles, Zap, Home, FileText, DollarSign, X } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { RebateCalculator } from "@/components/subscription/RebateCalculator";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useAuth } from "@/contexts/AuthContext";

const Subscriptions = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const { isSubscribed, subscriptionTier, loading } = useSubscriptionStatus();
  const { user } = useAuth();

  const basicFeatures = [
    { text: "1 home tour/month (single property only)", included: true },
    { text: "Book with a FirstLook Pro", included: true },
    { text: "Tour tracker dashboard", included: true },
    { text: "Upgrade anytime for rebates or offer help", included: true },
    { text: "No rebate access", included: false },
    { text: "No offer support", included: false }
  ];

  const proFeatures = [
    { text: "2 tour sessions/month (up to 3 homes per session)", included: true },
    { text: "Access to offer creator tool", included: true },
    { text: "Priority scheduling", included: true },
    { text: "Rebate access (90% of buyer agent commission)", included: true },
    { text: "Email + chat support", included: true },
    { text: "Dedicated agent-coached offer assistance", included: false }
  ];

  const premiumFeatures = [
    { text: "5 tour sessions/month (up to 3 homes per session)", included: true },
    { text: "Everything in Pro", included: true },
    { text: "Dedicated agent-coached offer assistance", included: true },
    { text: "Max rebate percentage unlocked", included: true },
    { text: "Phone support + local market reports", included: true }
  ];

  const whyChooseFeatures = [
    "Private by Default",
    "Commission Rebates", 
    "Zero Commitment",
    "Local Pros When You Need Them",
    "DC-licensed agents on-demand"
  ];

  const handleGetPremiumAccess = () => {
    console.log('Premium Access button clicked', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    });
    
    setShowSubscribeModal(true);
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleSubscriptionComplete = () => {
    window.location.reload();
  };

  // Show subscription success badge
  const SubscriptionBadge = () => {
    if (!isSubscribed) return null;
    
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-12 mx-4 sm:mx-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-1">You're subscribed! 🎉</h3>
            <p className="text-green-700 font-light">
              Enjoying {subscriptionTier || 'Premium'} membership with unlimited home tours
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-20 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-8 text-gray-900 tracking-tight">
              🏠 You Shouldn't Need <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Permission</span> Just to See a House
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
              Tour homes without pressure, contracts, or gatekeeping.
            </p>

            <p className="text-lg sm:text-xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
              Get started with one free home tour every month — no subscription required.
            </p>

            <SubscriptionBadge />
          </div>
        </div>
      </div>

      {/* Free Tour CTA */}
      <div className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 sm:px-8 text-center relative z-10">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 sm:px-16 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            onClick={handleRequestShowing}
          >
            <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            Book Your Free Tour
            <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="py-20 sm:py-24">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-lg sm:text-xl text-gray-600 font-light">
              Flexible monthly plans. Cancel anytime.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Basic Access */}
            <Card className="border-2 border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-br from-green-50/80 to-emerald-50/50">
                <CardTitle className="text-2xl text-gray-900 font-light mb-6 flex items-center justify-center gap-2">
                  🟢 Basic
                </CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
                  Free
                </div>
                <p className="text-gray-600 font-light text-sm px-4">Perfect for casual or first-time buyers just getting started.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-4 mb-10">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-6 sm:py-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  disabled={loading}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Membership */}
            <Card className="border-2 border-blue-300 shadow-xl hover:shadow-2xl relative overflow-hidden rounded-2xl group hover:-translate-y-1 transition-all duration-500 bg-white scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
              
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                <Star className="w-3 h-3" />
                Most Popular
              </div>

              <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
                <CardTitle className="text-2xl text-gray-900 font-light mb-6 flex items-center justify-center gap-2">
                  🔵 Pro
                </CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
                  $39<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-sm px-4">Ideal for buyers actively touring and comparing multiple homes.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-4 mb-10">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 sm:py-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Premium Membership */}
            <Card className="border-2 border-purple-200/80 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-br from-purple-50/80 to-pink-50/50">
                <CardTitle className="text-2xl text-gray-900 font-light mb-6 flex items-center justify-center gap-2">
                  🟣 Premium
                </CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
                  $149<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-sm px-4">Best for serious buyers who want full-service support without full-service commissions.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-4 mb-10">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 sm:py-8 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  disabled={loading}
                >
                  Go Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add-Ons & Extras */}
      <div className="py-20 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">Add-Ons & Extras</h2>
            <p className="text-lg sm:text-xl text-gray-600 font-light">
              Flexible options for when you need more than your monthly allowance.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl bg-white group hover:-translate-y-1">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="text-2xl mb-3">🏠</div>
                <CardTitle className="text-lg text-gray-900 font-medium mb-2">Extra Tour Session</CardTitle>
                <div className="text-2xl font-light text-gray-900">$25<span className="text-sm text-gray-500">/session</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0 pb-8">
                <p className="text-gray-600 text-sm font-light mb-2">Up to 3 homes per session</p>
                <p className="text-xs text-gray-500">(members)</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl bg-white group hover:-translate-y-1">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="text-2xl mb-3">🏠</div>
                <CardTitle className="text-lg text-gray-900 font-medium mb-2">One-off Tour</CardTitle>
                <div className="text-2xl font-light text-gray-900">$49<span className="text-sm text-gray-500">/home</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0 pb-8">
                <p className="text-gray-600 text-sm font-light mb-2">Perfect for one-off tours</p>
                <p className="text-xs text-gray-500">(non-members)</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl bg-white group hover:-translate-y-1">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="text-2xl mb-3">✍️</div>
                <CardTitle className="text-lg text-gray-900 font-medium mb-2">Offer Write</CardTitle>
                <div className="text-2xl font-light text-gray-900">$399</div>
              </CardHeader>
              <CardContent className="text-center pt-0 pb-8">
                <p className="text-gray-600 text-sm font-light">Professional offer assistance</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl bg-white group hover:-translate-y-1">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="text-2xl mb-3">📄</div>
                <CardTitle className="text-lg text-gray-900 font-medium mb-2">Contract Management</CardTitle>
                <div className="text-2xl font-light text-gray-900">$799</div>
              </CardHeader>
              <CardContent className="text-center pt-0 pb-8">
                <p className="text-gray-600 text-sm font-light">End-to-end support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Commission Rebate Program */}
      <div className="py-20 sm:py-24">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">💰 Why You Get a Rebate (And Others Don't)</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                When a seller lists a home, they often offer a buyer agent commission (e.g., 2.5%) — usually <strong>$10K–$20K+</strong>.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                Here's the catch: <strong>legally, that commission can only be paid to a licensed agent</strong>. Buyers can't collect it directly.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                <strong>That's where FirstLook comes in.</strong> We serve as your placeholder agent of record, enabling the rebate. FirstLook keeps 10% as a service fee and <strong>passes 90% to you</strong> — often thousands of dollars back in your pocket.
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <RebateCalculator />
          </div>
        </div>
      </div>

      {/* Why Buyers Love FirstLook */}
      <div className="py-20 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">Why FirstLook?</h2>
            <p className="text-lg text-gray-600 font-light">The only platform built for modern buyers — not agents.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {whyChooseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      {!isSubscribed && (
        <div className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-6 sm:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 tracking-tight">🎯 Ready to Tour Without the Hassle?</h2>
            <p className="text-lg sm:text-xl text-gray-200 mb-12 font-light">Your first home tour is free with the Basic plan.<br />Upgrade anytime — no contracts, just control.</p>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 px-10 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105"
                  onClick={handleRequestShowing}
                >
                  <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Book a Tour
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  <Sparkles className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Compare Plans
                </Button>
              </div>
              
              <div className="text-center border-t border-white/20 pt-6">
                <Link to="/agents">
                  <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light hover:scale-105 transition-all duration-200">
                    <Users className="mr-2 h-4 w-4" />
                    Join as a Showing Partner →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Boundary Modals */}
      <ErrorBoundary>
        {showPropertyForm && (
          <PropertyRequestForm 
            isOpen={showPropertyForm}
            onClose={() => setShowPropertyForm(false)} 
          />
        )}
      </ErrorBoundary>

      {showSubscribeModal && (
        <SubscribeModal
          isOpen={showSubscribeModal}
          onClose={() => setShowSubscribeModal(false)}
          onSubscriptionComplete={handleSubscriptionComplete}
        />
      )}
    </div>
  );
};

export default Subscriptions;
