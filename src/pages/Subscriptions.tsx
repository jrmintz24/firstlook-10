import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Phone, Shield, Users, ArrowRight, Sparkles, Zap, Home } from "lucide-react";
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

  const membershipFeatures = [
    "Unlimited access to the FirstLook platform",
    "VIP scheduling for showings—get priority booking, every time",
    "Access to same day viewings when available",
    "One tour session included with subscription (up to 3 homes per session)",
    "15-minute monthly live support call with a FirstLook expert",
    "Keep your contact info private until you choose to share"
  ];

  const whyChooseFeatures = [
    {
      title: "No Pressure, No Surprises",
      description: "See as many homes as you need, when you want, without hidden commitments.",
      icon: Shield
    },
    {
      title: "Total Transparency",
      description: "Flat pricing, no hidden fees.",
      icon: Star
    },
    {
      title: "Privacy First",
      description: "You choose when—and if—agents get your contact info.",
      icon: Users
    },
    {
      title: "Expert Support",
      description: "Real people to help you at every step.",
      icon: Phone
    }
  ];

  const handleGetVIPAccess = () => {
    console.log('VIP Access button clicked', {
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
    // Refresh subscription status after successful subscription
    window.location.reload(); // Simple approach to refresh all state
  };

  // Show subscription success badge
  const SubscriptionBadge = () => {
    if (!isSubscribed) return null;
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <Star className="h-6 w-6 text-green-600" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-12 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 text-gray-900 tracking-tight">
              {isSubscribed ? (
                <>Welcome Back <span className="font-medium">Premium Member</span></>
              ) : (
                <>Unlock Home Shopping <span className="font-medium">Freedom</span></>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              {isSubscribed ? (
                <>Your <span className="font-medium text-gray-900">Premium Access</span> is active. Enjoy unlimited tours and VIP support!</>
              ) : (
                <>Get <span className="font-medium text-gray-900">VIP Access</span> to Tours, Real Support, and Total Control—All for One Simple Monthly Fee.</>
              )}
            </p>

            <SubscriptionBadge />
          </div>
        </div>
      </div>

      {/* CTA Button Below Hero */}
      <div className="py-8 bg-gray-100 border-y border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-6 text-xl font-medium shadow-none rounded-2xl transition-all duration-200"
            onClick={handleRequestShowing}
          >
            <Home className="mr-3 h-6 w-6" />
            {isSubscribed ? "Book Another Tour" : "See Your First Home FREE"}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-gray-600 mt-3 text-sm font-light">
            {isSubscribed ? "Unlimited tours with your Premium membership" : "Start with a completely free showing - no membership required"}
          </p>
        </div>
      </div>

      {/* Membership Pricing */}
      {!isSubscribed && (
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Membership at a Glance</h2>
            </div>
            
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Membership Card */}
              <Card className="border-2 border-gray-900 shadow-lg relative overflow-hidden lg:col-span-2 rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-900"></div>
                
                {/* Special Offer Banner */}
                <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium transform rotate-12 shadow-md">
                  <Zap className="w-4 h-4 inline mr-1" />
                  LIMITED TIME!
                </div>

                <CardHeader className="text-center pb-6 pt-8">
                  <Badge className="w-fit mx-auto mb-6 bg-gray-900 text-white rounded-full">Most Popular</Badge>
                  <CardTitle className="text-3xl text-gray-900 font-light">FirstLook Membership</CardTitle>
                  
                  {/* Special Pricing Display */}
                  <div className="mb-6">
                    <div className="text-6xl font-light text-green-600 mb-2">$29<span className="text-lg text-gray-600">/first month</span></div>
                    <div className="text-xl text-gray-500 line-through">$69.95</div>
                    <div className="text-2xl font-medium text-purple-600">Then $69.95/month</div>
                    <Badge variant="secondary" className="mt-3 bg-green-100 text-green-800 border-green-300 rounded-full">
                      Save $40.95 Your First Month!
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4 mb-8">
                    {membershipFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-xl font-medium rounded-2xl shadow-none"
                    onClick={handleGetVIPAccess}
                    disabled={loading}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start for $29 First Month
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-4 font-light">Cancel anytime. No long-term contracts.</p>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card className="border border-gray-200 shadow-lg rounded-3xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 font-light">Want More?</CardTitle>
                  <CardDescription className="text-lg font-light">Additional options for extra flexibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Additional tour sessions</span>
                      <span className="text-2xl font-light text-blue-600">$69</span>
                    </div>
                    <p className="text-gray-600 text-sm font-light">Each additional session beyond your monthly membership</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Single home showing</span>
                      <span className="text-2xl font-light text-green-600">$39</span>
                    </div>
                    <p className="text-gray-600 text-sm font-light">Perfect for one-time tours as a member</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Non-Member Options */}
            <div className="max-w-4xl mx-auto mt-8">
              <h3 className="text-3xl font-light text-gray-900 text-center mb-6 tracking-tight">Not Ready for Membership? No Problem!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 shadow-lg rounded-3xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-900 font-medium">Single Home Tour</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-light text-purple-600 mb-2">$59</div>
                    <p className="text-gray-600 mb-6 font-light">See one home without membership</p>
                    <Link to="/single-home-tour">
                      <Button 
                        className="w-full bg-purple-600 text-white hover:bg-purple-700 border-0 rounded-2xl font-medium shadow-none"
                      >
                        Book Single Home Tour
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-lg rounded-3xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-900 font-medium">Tour Session</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-light text-blue-600 mb-2">$149</div>
                    <p className="text-gray-600 mb-6 font-light">See up to 3 homes in one session</p>
                    <Link to="/tour-session">
                      <Button 
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-2xl font-medium shadow-none"
                      >
                        Book Tour Session
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">How It Works</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-medium text-xl">1</span>
                </div>
                <CardTitle className="text-xl font-medium">Join as a Member</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-light">Sign up in seconds. Start browsing and booking VIP home tours immediately.</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-medium text-xl">2</span>
                </div>
                <CardTitle className="text-xl font-medium">Book Your VIP Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-light">Schedule up to 3 homes per session with fast, priority access.</p>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-200 shadow-sm bg-white rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-medium text-xl">3</span>
                </div>
                <CardTitle className="text-xl font-medium">See Homes on Your Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-light">Get in, look around, and keep your info private—no agent commitments or pressure.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">What's Next After Your Tour?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border border-gray-200 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700 font-medium">Keep Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg font-light">Not ready to decide? Stay on your membership and keep touring homes until you find the one.</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 font-medium">Ready to Make an Offer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg mb-4 font-light">FirstLook can help—get Offer Write Support for <span className="font-medium text-blue-600">$499</span> per offer, or let us manage all paperwork and coordination for <span className="font-medium text-blue-600">$799</span> after your accepted offer.</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700 font-medium">Want to Work with an Agent?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg font-light">If you connect with one of our showing pros and want full-service support, you're in control: your contact info is only shared if you say so.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Offer Support Details */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Need Help Making an Offer?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">FirstLook offers professional offer support to help you navigate the buying process with confidence.</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-white rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xl">$499</span>
                  </div>
                  <CardTitle className="text-xl font-medium text-gray-900">Offer Write Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-light">
                  <p>• Professional offer construction based on comprehensive questionnaire</p>
                  <p>• Tailored to your specific needs and market conditions</p>
                  <p>• Includes negotiation of up to 2 counter offers</p>
                  <p>• Additional documents: $99 each after initial offer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-xl">$799</span>
                  </div>
                  <CardTitle className="text-xl font-medium text-gray-900">Full Contract Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-light">
                  <p>• Complete contract addendum facilitation</p>
                  <p>• Coordination with all parties involved</p>
                  <p>• Document management from offer to closing</p>
                  <p>• Peace of mind with professional oversight</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Go FirstLook */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Why Go FirstLook?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white rounded-3xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-900" />
                      </div>
                      <CardTitle className="text-xl font-medium text-gray-900">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
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
        <div className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-light text-white mb-8 tracking-tight">Ready to Start?</h2>
            <div className="max-w-2xl mx-auto space-y-8">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl font-medium shadow-none rounded-2xl"
                onClick={handleGetVIPAccess}
                disabled={loading}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Start for $29 First Month
              </Button>
              <p className="text-gray-300 text-lg font-light">Then $69.95/month. Cancel anytime. No long-term contracts.</p>
              
              <div className="border-t border-white/20 pt-8 mt-12">
                <p className="text-white mb-6 font-light">Prefer a pay-as-you-go approach?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/single-home-tour">
                    <Button 
                      className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-2xl font-medium shadow-none"
                    >
                      Single Home Tour - $59
                    </Button>
                  </Link>
                  <Link to="/tour-session">
                    <Button 
                      className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-2xl font-medium shadow-none"
                    >
                      Tour Session - $149
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-6 font-light">Questions? Chat with our support team or check out our FAQ below.</p>
              <Link to="/faq">
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light">
                  Check out our FAQ →
                </Button>
              </Link>
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
