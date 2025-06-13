import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Clock, Shield, Star, TrendingUp, CheckCircle, Phone, ArrowRight, Sparkles } from "lucide-react";
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
              <TrendingUp className="w-4 h-4 mr-2" />
              Now Recruiting Licensed Agents Nationwide
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
              Turn Your Downtime Into{" "}
              <span className="block">Quality Leads &</span>
              <span className="block font-medium">Extra Income</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join FirstLook as a Showing Partner and get access to a steady stream of qualified buyer leads. Provide one free showing per month and unlock unlimited paid opportunities.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 mb-12 border border-gray-200 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span>Earn $50-100+ Per Showing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Pre-Qualified Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span>Flexible Schedule</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/agent-auth">
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium"
                >
                  Join as Showing Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
              </Button>
            </div>

            <p className="text-sm text-gray-500 max-w-lg mx-auto font-light">
              <strong className="font-medium">What's the commitment?</strong> Provide one free showing per month to maintain access to our paid lead pipeline. That's it.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Join a Growing Network of Successful Agents
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">$75</div>
              <div className="text-gray-900 font-medium mb-1">Average Per Showing</div>
              <div className="text-gray-500 text-sm font-light">Plus conversion opportunities</div>
            </div>

            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">200+</div>
              <div className="text-gray-900 font-medium mb-1">Active Partners</div>
              <div className="text-gray-500 text-sm font-light">Licensed professionals</div>
            </div>

            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">4.8</div>
              <div className="text-gray-900 font-medium mb-1">Agent Rating</div>
              <div className="text-gray-500 text-sm font-light">From buyer feedback</div>
            </div>

            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">35%</div>
              <div className="text-gray-900 font-medium mb-1">Lead Conversion</div>
              <div className="text-gray-500 text-sm font-light">To full representation</div>
            </div>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
              How FirstLook Works for Agents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Simple, transparent, and designed to maximize your earning potential while building lasting client relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Get Qualified Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  Receive notifications for showing requests from pre-screened buyers in your area. All leads are serious prospects ready to view homes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Choose Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  Accept or decline requests based on your availability. Set your own hours and work as much or as little as you want.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl font-medium text-gray-900">Earn & Convert</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-light">
                  Get paid for each showing plus opportunities to convert leads into full buyer representation with transparent commission sharing.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
                Why Top Agents Choose FirstLook
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Unlike traditional lead generation, FirstLook provides qualified prospects who are actively ready to view homes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Pre-Qualified Buyer Leads</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Every lead has been screened and is actively looking to tour homes. No cold calls or uninterested prospects.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Flexible Earning Opportunities</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Earn $50-100+ per showing, plus commission opportunities when leads convert to full representation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Low Commitment, High Reward</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Provide just one free showing per month to maintain access to unlimited paid opportunities.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Technology-Driven Platform</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Easy-to-use mobile platform for managing requests, scheduling, and tracking earnings. No complex systems to learn.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Build Your Client Base</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Convert showing leads into long-term clients. Many partners report 30%+ conversion rates to full representation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-8 bg-white rounded-xl border border-gray-200">
                  <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Support & Training</h3>
                    <p className="text-gray-600 font-light leading-relaxed">Access to best practices, training materials, and ongoing support to maximize your success on the platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
              Your Earning Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              See how FirstLook partners are earning additional income while building their client base.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-gray-100 text-gray-800">Getting Started</Badge>
                <CardTitle className="text-2xl font-light text-gray-900">5 Showings/Month</CardTitle>
                <CardDescription className="text-base text-gray-600 font-light">Part-time engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-gray-900 mb-4">$375+</div>
                <div className="text-gray-600 mb-6 font-light">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-500 font-light">
                  <div>• 4 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Plus conversion opportunities</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-900 bg-white transform scale-105">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-gray-900 text-white">Most Popular</Badge>
                <CardTitle className="text-2xl font-light text-gray-900">15 Showings/Month</CardTitle>
                <CardDescription className="text-base text-gray-600 font-light">Active partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-gray-900 mb-4">$1,050+</div>
                <div className="text-gray-600 mb-6 font-light">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-500 font-light">
                  <div>• 14 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Higher conversion rate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border border-gray-200 bg-white">
              <CardHeader>
                <Badge className="mx-auto mb-4 bg-gray-100 text-gray-800">Top Performer</Badge>
                <CardTitle className="text-2xl font-light text-gray-900">30 Showings/Month</CardTitle>
                <CardDescription className="text-base text-gray-600 font-light">Power user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-gray-900 mb-4">$2,175+</div>
                <div className="text-gray-600 mb-6 font-light">Average monthly earnings</div>
                <div className="space-y-2 text-sm text-gray-500 font-light">
                  <div>• 29 paid showings @ $75 each</div>
                  <div>• 1 free showing (platform requirement)</div>
                  <div>• Premium conversion opportunities</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6 font-light">
              <strong className="font-medium">Plus commission earnings:</strong> Convert 30% of leads to full representation for additional $8,000-15,000 per closing.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-light text-white mb-8 tracking-tight">
            Ready to Start Earning?
          </h2>
          <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Join hundreds of successful agents who are building their business with FirstLook. Get started today and receive your first lead within 48 hours of approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/agent-auth">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 font-medium text-lg"
              >
                Join as Showing Partner
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 font-medium text-lg transition-all duration-300"
              onClick={() => window.open('mailto:partners@firstlook.com', '_blank')}
            >
              Questions? Contact Us
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-white">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-light">Licensed Professionals Only</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-light">No Upfront Costs</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-light">24-48hr Approval</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLanding;
