
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Phone, Shield, Users, ArrowRight, Sparkles, Zap, Home, FileText, DollarSign } from "lucide-react";
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
    "1 tour session per month (up to 3 homes per session)",
    "Standard priority scheduling",
    "Email/chat support",
    "Perfect for casual browsing and first-time buyers"
  ];

  const premiumFeatures = [
    "2 tour sessions per month (3 homes per session)",
    "VIP priority scheduling",
    "15-minute monthly live support call with FirstLook experts",
    "Keep your contact details private until you choose to share",
    "Ideal for active buyers looking for regular tours"
  ];

  const whyChooseFeatures = [
    {
      title: "No Pressure",
      description: "See homes without being locked into an agent.",
      icon: Shield
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees or surprises.",
      icon: Star
    },
    {
      title: "Privacy",
      description: "Your contact info stays confidential until you decide to share.",
      icon: Users
    },
    {
      title: "Expert Support",
      description: "Dedicated professionals assist you every step of the way.",
      icon: Phone
    }
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
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="py-16 sm:py-20 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6 text-gray-900 tracking-tight">
              Unlock Your <span className="font-medium text-gray-800">Homebuying Advantage</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
              Simple Pricing. Flexible Choices. Complete Control.
            </p>

            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Whether you're just starting your home search or ready to make offers, FirstLook offers easy-to-understand plans that put you in control of your homebuying journey.
            </p>

            <SubscriptionBadge />
          </div>
        </div>
      </div>

      {/* Free Tour CTA */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-4">See Your First Home Absolutely Free</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Get started with zero commitment. Book your first home tour on us—no membership needed.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-medium shadow-none rounded-2xl transition-all duration-300 hover:scale-105"
            onClick={handleRequestShowing}
          >
            <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            Book Free Tour
            <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">Choose Your Membership</h2>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Basic Access */}
            <Card className="border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden group hover:-translate-y-1">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl text-gray-900 font-light mb-4">Basic Access</CardTitle>
                <div className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
                  $39<span className="text-lg text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl shadow-none transition-all duration-300"
                  disabled={loading}
                >
                  Choose Basic
                </Button>
              </CardContent>
            </Card>

            {/* Premium Membership */}
            <Card className="border-2 border-gray-900/10 shadow-lg hover:shadow-xl relative overflow-hidden rounded-3xl group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-600"></div>
              
              {/* Most Popular Badge */}
              <div className="absolute top-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </div>

              <CardHeader className="text-center pb-6 pt-12">
                <CardTitle className="text-2xl text-gray-900 font-light mb-4">Premium Membership</CardTitle>
                
                {/* Special Pricing Display */}
                <div className="mb-6">
                  <div className="text-4xl sm:text-5xl font-light text-green-700 mb-2">
                    $29<span className="text-lg text-gray-500">/first month</span>
                  </div>
                  <div className="text-2xl font-medium text-gray-900">Then $69/month</div>
                  <Badge variant="secondary" className="mt-3 bg-green-50 text-green-800 border-green-200 rounded-full px-4 py-1">
                    Save $40 Your First Month!
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <div className="space-y-4 mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-light text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl shadow-none transition-all duration-300"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start for $29 First Month
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Flexible Add-ons */}
      <div className="py-16 sm:py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">Flexible Add-ons & Extras</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Additional Tour Session</CardTitle>
                <div className="text-2xl sm:text-3xl font-light text-gray-900">$59<span className="text-sm text-gray-500">/session</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 text-sm sm:text-base font-light">Members only - up to 3 homes per session</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Single Home Tour</CardTitle>
                <div className="text-2xl sm:text-3xl font-light text-green-700">$29<span className="text-sm text-gray-500">/home</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 text-sm sm:text-base font-light">Members only - perfect for one-off tours</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Single Home Tour</CardTitle>
                <div className="text-2xl sm:text-3xl font-light text-gray-700">$49<span className="text-sm text-gray-500">/home</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 text-sm sm:text-base font-light">Non-members - see one home without membership</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl text-gray-900 font-medium">Tour Session</CardTitle>
                <div className="text-2xl sm:text-3xl font-light text-orange-600">$99<span className="text-sm text-gray-500">/session</span></div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 text-sm sm:text-base font-light">Non-members - up to 3 homes in one session</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Offer Writing & Contract Support */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">Offer Writing & Contract Support</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              When you're ready to make an offer, FirstLook provides professional assistance to maximize your negotiation leverage and simplify the process:
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
                    <CardTitle className="text-xl font-medium text-gray-900">Offer Write Support</CardTitle>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">$499</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-light">
                  <p>• Comprehensive professional offer preparation</p>
                  <p>• Includes negotiation of up to 2 counter-offers</p>
                  <p>• Additional documents after initial offer: $99 each</p>
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
                  <p>• Complete handling of contracts and addendums</p>
                  <p>• Coordination with all transaction parties</p>
                  <p>• Professional document oversight from offer acceptance to closing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Commission Rebate Program */}
      <div className="py-16 sm:py-20 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">Commission Rebate Program</h2>
            <h3 className="text-xl sm:text-2xl font-medium text-green-700 mb-6">Put Seller-Paid Commissions Back in Your Pocket</h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              If the seller offers a guaranteed buyer agent commission, you can reclaim this money as a rebate. FirstLook seamlessly handles this:
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white rounded-3xl mb-8 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-medium text-xl">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">We Submit Your Offer</h4>
                    <p className="text-gray-600 font-light text-sm sm:text-base">Through our licensed agent</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-medium text-xl">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">FirstLook Collects Commission</h4>
                    <p className="text-gray-600 font-light text-sm sm:text-base">At closing, retains only 10% as service fee</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-medium text-xl">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">You Receive 90% Back</h4>
                    <p className="text-gray-600 font-light text-sm sm:text-base">As a rebate at closing</p>
                  </div>
                </div>

                <div className="bg-green-50/80 rounded-2xl p-6 border border-green-100">
                  <h4 className="font-medium text-green-800 mb-4 text-center">Example Rebate Calculation:</h4>
                  <div className="space-y-2 text-green-700 text-sm sm:text-base">
                    <p>• Seller offers a 2.5% commission on a $400,000 home = <strong>$10,000 total</strong></p>
                    <p>• FirstLook retains 10% = <strong>$1,000</strong></p>
                    <p>• <strong>You get a $9,000 rebate at closing</strong></p>
                  </div>
                  <p className="text-green-600 mt-4 font-medium text-center text-sm sm:text-base">
                    This simple approach helps you potentially save thousands on your new home.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Choose FirstLook */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight">Why Buyers Choose FirstLook</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {whyChooseFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg bg-white rounded-3xl transition-all duration-300 group hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      <CardTitle className="text-xl font-medium text-gray-900">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 font-light">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      {!isSubscribed && (
        <div className="py-16 sm:py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 tracking-tight">Ready to Start?</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 font-light">Take the first step toward a better homebuying experience.</p>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium shadow-none rounded-2xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetPremiumAccess}
                  disabled={loading}
                >
                  <Sparkles className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Start for $29 First Month
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-2xl transition-all duration-300"
                  onClick={handleRequestShowing}
                >
                  <Home className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Book Free Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ErrorBoundary>
        <PropertyRequestForm
          isOpen={showPropertyForm}
          onClose={() => setShowPropertyForm(false)}
        />
      </ErrorBoundary>

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </div>
  );
};

export default Subscriptions;
