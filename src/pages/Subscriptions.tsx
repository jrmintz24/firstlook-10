
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 mb-12 mx-4 sm:mx-0 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md">
            <Star className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">You're subscribed! 🎉</h3>
            <p className="text-green-700 font-light text-lg">
              Enjoying {subscriptionTier || 'Premium'} membership with unlimited home tours
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight mb-8 text-gray-900 tracking-tight">
              🏠 You Shouldn't Have to <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Hire an Agent</span> Just to See a House
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed font-light">
              Tour homes on your schedule. Ask for help only when you want it.
            </p>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
              No contracts. No pressure. No gatekeeping.
            </p>

            <p className="text-xl sm:text-2xl text-gray-800 mb-12 max-w-4xl mx-auto leading-relaxed font-semibold">
              Your first home tour is free.
            </p>

            <SubscriptionBadge />
          </div>
        </div>
      </div>

      {/* Free Tour CTA */}
      <div className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 sm:px-16 py-6 sm:py-8 text-xl sm:text-2xl font-semibold shadow-2xl rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            onClick={handleRequestShowing}
          >
            <Home className="mr-4 h-6 w-6 sm:h-8 sm:w-8" />
            See Your First Home Free
            <ArrowRight className="ml-4 h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="py-20 sm:py-28 bg-gradient-to-br from-white to-gray-50/80">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">💸 Choose a Plan That Fits Your Buying Style</h2>
            <p className="text-xl sm:text-2xl text-gray-600 font-light">
              Flexible, transparent monthly plans. Cancel anytime.
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Basic Access */}
            <Card className="border-2 border-gray-200/80 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-br from-green-50/80 to-emerald-50/50">
                <CardTitle className="text-3xl text-gray-900 font-light mb-6 flex items-center justify-center gap-3">
                  🟢 Basic
                </CardTitle>
                <div className="text-5xl sm:text-6xl font-light text-gray-900 mb-4">
                  Free
                </div>
                <p className="text-gray-600 font-light text-base px-4">Perfect for casual or first-time buyers just getting started.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-5 mb-10">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                      }`}>
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-base ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-6 sm:py-8 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  disabled={loading}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Membership */}
            <Card className="border-2 border-blue-300 shadow-2xl hover:shadow-3xl relative overflow-hidden rounded-3xl group hover:-translate-y-2 transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30 scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
              
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                <Star className="w-4 h-4" />
                Most Popular
              </div>

              <CardHeader className="text-center pb-8 pt-14 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
                <CardTitle className="text-3xl text-gray-900 font-light mb-6 flex items-center justify-center gap-3">
                  🔵 Pro
                </CardTitle>
                <div className="text-5xl sm:text-6xl font-light text-gray-900 mb-4">
                  $39<span className="text-xl text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-base px-4">Ideal for buyers actively touring and comparing multiple homes.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-5 mb-10">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        feature.included ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                      }`}>
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className={`font-light text-base ${
                        feature.included ? 'text-gray-700' : 'text-gray-500'
                      }`}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 sm:py-8 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Premium Membership */}
            <Card className="border-2 border-purple-200/80 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50/30">
              <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-br from-purple-50/80 to-pink-50/50">
                <CardTitle className="text-3xl text-gray-900 font-light mb-6 flex items-center justify-center gap-3">
                  🟣 Premium
                </CardTitle>
                <div className="text-5xl sm:text-6xl font-light text-gray-900 mb-4">
                  $149<span className="text-xl text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 font-light text-base px-4">Best for serious buyers who want full-service support without full-service commissions.</p>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
                <div className="space-y-5 mb-10">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-base">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 sm:py-8 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
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
      <div className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">🔄 Extra Tours & On-Demand Options</h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">👥 For Members (Pro & Premium only)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-blue-50/50 group hover:-translate-y-1">
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 font-medium mb-4">Extra Tour Session</CardTitle>
                    <div className="text-3xl sm:text-4xl font-light text-gray-900">$59<span className="text-base text-gray-500">/session</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-8">
                    <p className="text-gray-600 text-base font-light">Up to 3 homes per session</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-green-50/50 group hover:-translate-y-1">
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 font-medium mb-4">Single Home Tour</CardTitle>
                    <div className="text-3xl sm:text-4xl font-light text-gray-900">$25<span className="text-base text-gray-500">/home</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-8">
                    <p className="text-gray-600 text-base font-light">Perfect for one-off tours</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">🚪 For Non-Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-orange-50/50 group hover:-translate-y-1">
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 font-medium mb-4">Single Home Tour</CardTitle>
                    <div className="text-3xl sm:text-4xl font-light text-gray-900">$49<span className="text-base text-gray-500">/home</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-8">
                    <p className="text-gray-600 text-base font-light">See one home without membership</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-purple-50/50 group hover:-translate-y-1">
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 font-medium mb-4">Tour Session</CardTitle>
                    <div className="text-3xl sm:text-4xl font-light text-purple-600">$99<span className="text-base text-gray-500">/session</span></div>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-8">
                    <p className="text-gray-600 text-base font-light">Up to 3 homes in one session</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center text-gray-600 font-light mt-8 text-lg">One-off tours without a subscription — convenient but less value.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Support */}
      <div className="py-20 sm:py-28 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-8 tracking-tight">✍️ Offer Support (Add-Ons)</h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Need help drafting your offer? We've got you covered.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-blue-50/50 rounded-3xl transition-all duration-300 group hover:-translate-y-2">
              <CardHeader className="pb-8 pt-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <FileText className="w-8 h-8 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-medium text-gray-900 mb-2">Offer Writing</CardTitle>
                    <div className="text-4xl font-bold text-gray-900">$399</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <div className="space-y-4 text-gray-700 font-light text-lg">
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    1 professionally drafted offer
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    Up to 2 counteroffer revisions
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    Add-on documents: $99 each
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-purple-50/50 rounded-3xl transition-all duration-300 group hover:-translate-y-2">
              <CardHeader className="pb-8 pt-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-8 h-8 text-purple-700" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-medium text-gray-900 mb-2">Full Contract Management</CardTitle>
                    <div className="text-4xl font-bold text-gray-900">$799</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <div className="space-y-4 text-gray-700 font-light text-lg">
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    End-to-end document handling
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    Addenda, lender/title coordination, timelines
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    Confidence from offer to closing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-8 py-4">
              <span className="text-2xl">🟣</span>
              <p className="text-purple-700 font-medium text-lg">Included free once per month with Premium</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Rebate Program */}
      <div className="py-20 sm:py-28 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">💰 Commission Rebate Program</h2>
            <h3 className="text-2xl sm:text-3xl font-semibold text-blue-700 mb-8">Don't Leave Thousands on the Table</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-5xl mx-auto font-light leading-relaxed mb-6">
              Most listing agreements require buyer commissions to be paid to a licensed agent — not directly to you. Without an agent, that money is usually forfeited.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 max-w-5xl mx-auto font-light leading-relaxed">
              FirstLook acts as your licensed buyer-side agent, making the rebate legally possible, then gives 90% back to you at closing.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 rounded-3xl mb-8 overflow-hidden">
              <CardContent className="p-10 sm:p-12">
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-3xl p-8 border border-blue-100/50 backdrop-blur-sm shadow-lg">
                  <h4 className="font-semibold text-blue-800 mb-6 text-center text-xl">Example:</h4>
                  <div className="space-y-4 text-blue-700 text-lg font-light">
                    <p className="flex justify-between items-center">
                      <span>$400,000 home × 2.5% buyer agent commission</span>
                      <span className="font-semibold">$10,000</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span>FirstLook keeps 10%</span>
                      <span className="font-semibold">$1,000</span>
                    </p>
                    <div className="border-t border-blue-200 pt-4">
                      <p className="flex justify-between items-center text-2xl font-bold text-blue-800">
                        <span>You get back</span>
                        <span>$9,000</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-blue-600 mt-8 font-medium text-center text-lg bg-white/60 rounded-2xl py-4 px-6">
                    Traditional buyers don't even know they're missing this. You won't.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Buyers Love FirstLook */}
      <div className="py-20 sm:py-28 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6 tracking-tight">💬 Why Buyers Love FirstLook</h2>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30 rounded-3xl">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {whyChooseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-lg">{feature}</span>
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
        <div className="py-20 sm:py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-10 tracking-tight">🚀 Ready to Get Started?</h2>
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 font-light">Whether you're exploring or making moves, FirstLook puts you in control.</p>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 px-10 sm:px-12 py-6 sm:py-8 text-xl sm:text-2xl font-semibold shadow-2xl rounded-3xl transition-all duration-300 hover:scale-105"
                  onClick={handleRequestShowing}
                >
                  <Home className="mr-4 h-6 w-6 sm:h-8 sm:w-8" />
                  See Your First Home Free
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 sm:px-12 py-6 sm:py-8 text-xl sm:text-2xl font-semibold rounded-3xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  <Sparkles className="mr-4 h-6 w-6 sm:h-8 sm:w-8" />
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
