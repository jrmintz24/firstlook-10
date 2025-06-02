
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Phone, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Subscriptions = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const membershipFeatures = [
    "Unlimited access to the FirstLook platform",
    "VIP scheduling for showings—get priority booking, every time",
    "Up to 3 home tours per session (see multiple homes back-to-back)",
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
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
              <Star className="w-4 h-4 mr-2" />
              VIP Membership Available
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Unlock Home Shopping
              </span>
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Freedom
              </span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">VIP Access</span> to Tours, Real Support, and Total Control—All for One Simple Monthly Fee.
            </p>
          </div>
        </div>
      </div>

      {/* Membership Pricing */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Membership at a Glance</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Membership Card */}
            <Card className="border-2 border-purple-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">Most Popular</Badge>
                <CardTitle className="text-3xl text-slate-800">FirstLook Membership</CardTitle>
                <div className="text-5xl font-bold text-purple-600">$69.95<span className="text-lg text-gray-600">/month</span></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-8">
                  {membershipFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-xl"
                  onClick={handleGetVIPAccess}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get VIP Access – $69.95/month
                </Button>
                <p className="text-center text-sm text-gray-600 mt-4">Cancel anytime. No long-term contracts.</p>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-800">Want More?</CardTitle>
                <CardDescription className="text-lg">Additional options for extra flexibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Additional tour sessions</span>
                    <span className="text-2xl font-bold text-blue-600">$74.95</span>
                  </div>
                  <p className="text-gray-600 text-sm">Each additional session beyond your monthly membership</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Single home showing</span>
                    <span className="text-2xl font-bold text-green-600">$49</span>
                  </div>
                  <p className="text-gray-600 text-sm">Perfect for one-time tours without membership</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 py-4"
                  onClick={handleGetVIPAccess}
                >
                  Book Single Home Tour - $49
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">How It Works</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <CardTitle className="text-xl">Join as a Member</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Sign up in seconds. Start browsing and booking VIP home tours immediately.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <CardTitle className="text-xl">Book Your VIP Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Schedule up to 3 homes per session with fast, priority access.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <CardTitle className="text-xl">See Homes on Your Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Get in, look around, and keep your info private—no agent commitments or pressure.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">What's Next After Your Tour?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Keep Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">Not ready to decide? Stay on your membership and keep touring homes until you find the one.</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">Ready to Make an Offer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg mb-4">FirstLook can help—get Offer Write Support for <span className="font-bold text-blue-600">$499 per offer</span>, or let us manage all paperwork and coordination for an additional <span className="font-bold text-blue-600">$249</span> after your accepted offer.</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Want to Work with an Agent?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">If you connect with one of our showing pros and want full-service support, you're in control: your contact info is only shared if you say so.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Go FirstLook */}
      <div className="py-16 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Go FirstLook?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to Start?</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold shadow-xl"
              onClick={handleGetVIPAccess}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get VIP Access – $69.95/month
            </Button>
            <p className="text-purple-100 text-lg">Cancel anytime. No long-term contracts.</p>
            
            <div className="border-t border-white/20 pt-6 mt-8">
              <p className="text-white mb-4">Prefer a pay-as-you-go approach?</p>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3"
                onClick={handleGetVIPAccess}
              >
                Book Single Home Tour - $49
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-purple-100 mb-4">Questions? Chat with our support team or check out our FAQ below.</p>
            <Link to="/faq">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                Check out our FAQ →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
