
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Clock, Shield, Star, TrendingUp, CheckCircle, Phone, ArrowRight, Sparkles, Home, HandHeart, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import { Link } from "react-router-dom";

const AgentLanding = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleJoinNow = () => {
    window.location.href = '/agent-auth';
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast({
      title: "Welcome!",
      description: "Successfully signed in as an agent.",
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-8 bg-gray-100 text-gray-800 border-gray-200 px-6 py-3 text-base font-medium">
              <Target className="w-4 h-4 mr-2" />
              FirstLook for Agents
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
              Turn Every Tour Into a{" "}
              <span className="block font-medium">Serious Opportunity</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              A new way to work with buyers. Connect with serious, pre-qualified buyers who have skin in the game and are in control of how and when they want to work with an agent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/agent-auth">
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium"
                >
                  Apply to Be a Showing Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More About How It Works
              </Button>
            </div>

            <p className="text-sm text-gray-500 max-w-lg mx-auto font-light">
              <strong className="font-medium">No upfront contracts.</strong> Choose tours that fit your schedule and earn commission splits when buyers decide to make offers.
            </p>
          </div>
        </div>
      </div>

      {/* A New Way to Work With Buyers */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
                A New Way to Work With Buyers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                Tired of spending hours with "maybe" buyers who ghost after a weekend of tours? FirstLook connects you with serious, pre-qualified buyers who have skin in the game.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 sm:p-10 shadow-lg border border-gray-200">
              <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed space-y-6">
                <p className="text-lg">
                  These buyers are <strong className="font-medium text-gray-900">paying for access to home tours</strong>, and they're in control of how and when they want to work with an agent.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Paid to See Homes</h3>
                    <p className="text-gray-600 text-sm font-light">Buyers have invested money to tour properties</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Exploring on Their Terms</h3>
                    <p className="text-gray-600 text-sm font-light">They control the pace and level of agent involvement</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <HandHeart className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Want Help When Ready</h3>
                    <p className="text-gray-600 text-sm font-light">Agent assistance only when it makes sense</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
              Here's How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Get Matched With Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  Buyers book home tours via FirstLook. If you're available in the area, you'll be invited to show the home as a licensed FirstLook Pro.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Host the Tour, Impress the Buyer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  Show the home professionally and respectfully. No pressure sales tactics. Focus on being helpful, knowledgeable, and building trust.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <HandHeart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Unlock the Relationship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  If the buyer requests offer help, FirstLook may invite you to assist. You'll become their official agent-of-record and can earn part of the commission on the transaction.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Compensation Model */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
                Compensation Model
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                We believe in rewarding great agents. Here's how you earn:
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-medium text-gray-900">🏠 Referral-Based Earnings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 font-light leading-relaxed">
                    Agents are not paid per tour. Instead, you participate in a commission or referral split when buyers decide to make an offer — either through FirstLook or directly with you.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">1–2 tours:</span>
                      <span className="text-gray-700">35% referral fee to FirstLook</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">3–5 tours:</span>
                      <span className="text-gray-700">25% referral fee</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">6+ tours:</span>
                      <span className="text-gray-700">15% referral fee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-medium text-gray-900">💰 Offer Support = Bigger Earnings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 font-light leading-relaxed">
                    If a buyer elects to write an offer with FirstLook and you're the tour agent, you may be invited to be the writing agent.
                  </p>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">Commission splits on these deals vary but typically average a 50/50 split between FirstLook and the agent.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Real Buyers. Real Upside. */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
              Real Buyers. Real Upside.
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              These aren't cold leads from a drip campaign.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-gray-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Paid to see a home</h3>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Are exploring how to buy on their terms</h3>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Want agent help when (and only when) it makes sense</h3>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 text-white">
              <p className="text-xl font-light mb-4">Your job?</p>
              <p className="text-xl font-medium">Deliver a great experience, offer creative a la carte value, and earn their business.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join FirstLook */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
                Why Join FirstLook?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl">🚀</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Work with Serious Buyers</h3>
                  <p className="text-gray-600 font-light leading-relaxed">No more ghosting after a day of showings.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl">⏳</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Low Time Commitment</h3>
                  <p className="text-gray-600 font-light leading-relaxed">Choose tours that fit your schedule. No upfront contracts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl">✍️</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Grow Organically</h3>
                  <p className="text-gray-600 font-light leading-relaxed">Earn the buyer's trust on the tour, convert them into a client.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl">🏡</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">More Closings</h3>
                  <p className="text-gray-600 font-light leading-relaxed">Assist with offers, earn commission splits, and keep growing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Join */}
      <div className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-light text-white mb-8 tracking-tight">
            Ready to Join?
          </h2>
          <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Becoming a FirstLook Pro is easy. You just need:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Shield className="h-5 w-5" />
              <span className="font-light">Active real estate license in your state</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <Star className="h-5 w-5" />
              <span className="font-light">Professionalism and reliability</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <CheckCircle className="h-5 w-5" />
              <span className="font-light">Respect for buyer-first experiences</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/agent-auth">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 font-medium text-lg"
              >
                Apply to Be a Showing Partner
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 font-medium text-lg transition-all duration-300"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More About How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLanding;
