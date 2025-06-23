
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Phone, Shield, Users, ArrowRight, Sparkles, Zap, Home, FileText, DollarSign, X } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
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
    { text: "No rebate access", included: false },
    { text: "No offer support", included: false }
  ];

  const proFeatures = [
    { text: "2 tour sessions/month (up to 3 homes per session)", included: true },
    { text: "Priority scheduling", included: true },
    { text: "Access to commission rebate program", included: true },
    { text: "Email support", included: true },
    { text: "Offer write not included", included: false }
  ];

  const premiumFeatures = [
    { text: "5 tour sessions/month (up to 3 homes per session)", included: true },
    { text: "All Pro features", included: true },
    { text: "1 professional offer write included/month", included: true },
    { text: "Phone support & fast turnaround", included: true },
    { text: "Max rebate access", included: true }
  ];

  const whyChooseFeatures = [
    "Tour without commitment",
    "Rebates with transparency", 
    "Offer help when you need it",
    "DC-licensed agents on-demand",
    "Your contact info stays private"
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
      <div className="bg-green-50/80 backdrop-blur-sm border border-green-100 rounded-3xl p-6 mb-8 mx-4 sm:mx-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">You're subscribed! 🎉</h3>
            <p className="text-green-700 font-light">
              Enjoying {subscriptionTier || 'Premium'} membership with unlimited home tours
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Hero Section */}
      <div className="py-16 sm:py-20 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6 text-gray-900 tracking-tight">
              🏠 You Shouldn't Have to <span className="font-medium text-gray-800">Hire an Agent</span> Just to See a House
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
              Tour homes on your schedule. Ask for help only when you want it.
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              No contracts. No pressure. No gatekeeping. <strong>Your first home tour is free.</strong>
            </p>

            <SubscriptionBadge />
          </div>
        </div>
      </div>

      {/* Free Tour CTA */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-medium shadow-none rounded-2xl transition-all duration-300 hover:scale-105"
            onClick={handleRequestShowing}
          >
            <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            See Your First Home Free
            <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">💸 Choose a Plan That Fits Your Buying Style</h2>
            <p className="text-lg sm:text-xl text-gray-600 font-light">
              Flexible, transparent monthly plans. Cancel anytime.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Basic Access */}
            <Card className="border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden group hover:-translate-y-1">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl text-gray-900 font-light mb-4">🟢 Basic</CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
                  Free
                </div>
                <p className="text-gray-600 font-light text-sm">Perfect for casual or first-time buyers just getting started.</p>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-sm sm:text-base ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl shadow-none transition-all duration-300"
                  disabled={loading}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Membership */}
            <Card className="border-2 border-blue-500/20 shadow-lg hover:shadow-xl relative overflow-hidden rounded-3xl group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              
              {/* Most Popular Badge */}
              <div className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Most Popular
              </div>

              <CardHeader className="text-center pb-6 pt-12">
                <CardTitle className="text-2xl text-gray-900 font-light mb-4">🔵 Pro</CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
                  $39<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-sm">Ideal for buyers actively touring and comparing multiple homes.</p>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-sm sm:text-base ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl shadow-none transition-all duration-300"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Premium Membership */}
            <Card className="border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden group hover:-translate-y-1">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl text-gray-900 font-light mb-4">🟣 Premium</CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
                  $149<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-sm">Best for serious buyers who want full-service support without full-service commissions.</p>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-sm sm:text-base">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl shadow-none transition-all duration-300"
                  disabled={loading}
                >
                  Go Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Extra Tours & On-Demand Options */}
      <div className="py-16 sm:py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">🔄 Extra Tours & On-Demand Options</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-6">👥 For Members (Pro & Premium only)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Extra Tour Session</CardTitle>
                    <div className="text-2xl sm:text-3xl font-light text-gray-900">$59<span className="text-sm text-gray-500">/session</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 text-sm sm:text-base font-light">Up to 3 homes per session</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Single Home Tour</CardTitle>
                    <div className="text-2xl sm:text-3xl font-light text-gray-900">$25<span className="text-sm text-gray-500">/home</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 text-sm sm:text-base font-light">Perfect for one-off tours</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">🚪 For Non-Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Single Home Tour</CardTitle>
                    <div className="text-2xl sm:text-3xl font-light text-gray-900">$49<span className="text-sm text-gray-500">/home</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 text-sm sm:text-base font-light">See one home without membership</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Tour Session</CardTitle>
                    <div className="text-2xl sm:text-3xl font-light text-purple-600">$99<span className="text-sm text-gray-500">/session</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-gray-600 text-sm sm:text-base font-light">Up to 3 homes in one session</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center text-gray-600 font-light mt-4">One-off tours without a subscription — convenient but less value.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Support */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">✍️ Offer Support (Add-Ons)</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Need help drafting your offer? We've got you covered.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="border-0 shadow-sm hover:shadow-lg bg-white rounded-3xl transition-all duration-300 group hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-medium text-gray-900">Offer Writing</CardTitle>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">$399</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-light">
                  <p>• 1 professionally drafted offer</p>
                  <p>• Up to 2 counteroffer revisions</p>
                  <p>• Add-on documents: $99 each</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg bg-white rounded-3xl transition-all duration-300 group hover:-translate-y-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Shield className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-medium text-gray-900">Full Contract Management</CardTitle>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">$799</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-light">
                  <p>• End-to-end document handling</p>
                  <p>• Addenda, lender/title coordination, timelines</p>
                  <p>• Confidence from offer to closing</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-purple-600 font-medium">🟣 Included free once per month with Premium.</p>
          </div>
        </div>
      </div>

      {/* Commission Rebate Program */}
      <div className="py-16 sm:py-20 bg-gradient-to-br from-slate-50/80 to-blue-50/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">💰 Commission Rebate Program</h2>
            <h3 className="text-xl sm:text-2xl font-medium text-blue-700 mb-6">Don't Leave Thousands on the Table</h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto font-light leading-relaxed mb-4">
              Most listing agreements require buyer commissions to be paid to a licensed agent — not directly to you. Without an agent, that money is usually forfeited.
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              FirstLook acts as your licensed buyer-side agent, making the rebate legally possible, then gives 90% back to you at closing.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-3xl mb-8 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm">
                  <h4 className="font-medium text-blue-800 mb-4 text-center">Example:</h4>
                  <div className="space-y-2 text-blue-700 text-sm sm:text-base">
                    <p>$400,000 home × 2.5% buyer agent commission = <strong>$10,000</strong></p>
                    <p>FirstLook keeps 10% = <strong>$1,000</strong></p>
                    <p><strong>You get $9,000 back</strong></p>
                  </div>
                  <p className="text-blue-600 mt-4 font-medium text-center text-sm sm:text-base">
                    Traditional buyers don't even know they're missing this. You won't.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Buyers Love FirstLook */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">💬 Why Buyers Love FirstLook</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm bg-white rounded-3xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whyChooseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
        <div className="py-16 sm:py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 tracking-tight">🚀 Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 font-light">Whether you're exploring or making moves, FirstLook puts you in control.</p>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium shadow-none rounded-2xl transition-all duration-300 hover:scale-105"
                  onClick={handleRequestShowing}
                >
                  <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  See Your First Home Free
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl transition-all duration-300"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  <Sparkles className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Compare Plans
                </Button>
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
