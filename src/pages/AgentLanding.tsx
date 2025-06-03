
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Clock, Shield, Star, TrendingUp, CheckCircle, Phone, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";

const AgentLanding = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleJoinNow = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Could redirect to agent dashboard when implemented
    toast({
      title: "Welcome!",
      description: "Successfully signed in as an agent.",
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-50/70 to-blue-50/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-6 py-3 text-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              💼 Now Recruiting Licensed Agents Nationwide
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
              Turn Your Downtime Into{" "}
              <span className="block">Quality Leads &</span>
              <span className="block">Extra <strong>Income</strong></span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              Join FirstLook as a Showing Partner and get access to a steady stream of qualified buyer leads. Provide one free showing per month and unlock unlimited paid opportunities. 💰✨
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-purple-100 shadow-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Earn $50-100+ Per Showing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Pre-Qualified Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>Flexible Schedule</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleJoinNow}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Join as Showing Partner
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
              </Button>
            </div>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              <strong>What's the commitment?</strong> Provide one free showing per month to maintain access to our paid lead pipeline. That's it.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-4">
              Join a Growing Network of Successful Agents
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">$75</div>
              <div className="text-gray-900 font-semibold text-lg mb-1">Average Per Showing</div>
              <div className="text-gray-600 text-sm">Plus conversion opportunities</div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">200+</div>
              <div className="text-gray-900 font-semibold text-lg mb-1">Active Partners</div>
              <div className="text-gray-600 text-sm">Licensed professionals</div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">4.8</div>
              <div className="text-gray-900 font-semibold text-lg mb-1">Agent Rating</div>
              <div className="text-gray-600 text-sm">From buyer feedback</div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">35%</div>
              <div className="text-gray-900 font-semibold text-lg mb-1">Lead Conversion</div>
              <div className="text-gray-600 text-sm">To full representation</div>
            </div>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              How FirstLook Works for Agents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent, and designed to maximize your earning potential while building lasting client relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">Get Qualified Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Receive notifications for showing requests from pre-screened buyers in your area. All leads are serious prospects ready to view homes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">Choose Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Accept or decline requests based on your availability. Set your own hours and work as much or as little as you want.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">Earn & Convert</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Get paid for each showing plus opportunities to convert leads into full buyer representation with transparent commission sharing.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
                Why Top Agents Choose FirstLook
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlike traditional lead generation, FirstLook provides qualified prospects who are actively ready to view homes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pre-Qualified Buyer Leads</h3>
                    <p className="text-gray-700">Every lead has been screened and is actively looking to tour homes. No cold calls or uninterested prospects.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Earning Opportunities</h3>
                    <p className="text-gray-700">Earn $50-100+ per showing, plus commission opportunities when leads convert to full representation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Low Commitment, High Reward</h3>
                    <p className="text-gray-700">Provide just one free showing per month to maintain access to unlimited paid opportunities.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Technology-Driven Platform</h3>
                    <p className="text-gray-700">Easy-to-use mobile platform for managing requests, scheduling, and tracking earnings. No complex systems to learn.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Build Your Client Base</h3>
                    <p className="text-gray-700">Convert showing leads into long-term clients. Many partners report 30%+ conversion rates to full representation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Support & Training</h3>
                    <p className="text-gray-700">Access to best practices, training materials, and ongoing support to maximize your success on the platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              Your Earning Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how FirstLook partners are earning additional income while building their client base.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-blue-100 text-blue-800">Getting Started</Badge>
                <CardTitle className="text-3xl font-bold text-gray-900">5 Showings/Month</CardTitle>
                <CardDescription className="text-lg text-gray-600">Part-time engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-4">$375+</div>
                <div className="text-gray-600 mb-6">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• 4 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Plus conversion opportunities</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-all duration-300 transform scale-105">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-purple-600 text-white">Most Popular</Badge>
                <CardTitle className="text-3xl font-bold text-gray-900">15 Showings/Month</CardTitle>
                <CardDescription className="text-lg text-gray-600">Active partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-4">$1,050+</div>
                <div className="text-gray-600 mb-6">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• 14 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Higher conversion rate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-green-100 text-green-800">Top Performer</Badge>
                <CardTitle className="text-3xl font-bold text-gray-900">30 Showings/Month</CardTitle>
                <CardDescription className="text-lg text-gray-600">Power user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-4">$2,175+</div>
                <div className="text-gray-600 mb-6">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• 29 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Premium conversion opportunities</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              <strong>Plus commission earnings:</strong> Convert 30% of leads to full representation for additional $8,000-15,000 per closing.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-purple-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
            Join hundreds of successful agents who are building their business with FirstLook. Get started today and receive your first lead within 48 hours of approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleJoinNow}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Join as Showing Partner
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 font-bold text-xl transition-all duration-300"
              onClick={() => window.open('mailto:partners@firstlook.com', '_blank')}
            >
              Questions? Contact Us
              <Phone className="ml-3 h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-white">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Licensed Professionals Only</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No Upfront Costs</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>24-48hr Approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* QuickSignInModal instead of AuthModal */}
      <QuickSignInModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default AgentLanding;
