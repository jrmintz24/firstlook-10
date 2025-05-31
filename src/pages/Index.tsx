
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, Shield, ChevronRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import HowItWorks from "@/components/HowItWorks";
import UserDashboard from "@/components/UserDashboard";
import { Link } from "react-router-dom";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'buyer' | 'agent'>('buyer');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleGetStarted = (userType: 'buyer' | 'agent') => {
    setAuthType(userType);
    setShowAuthModal(true);
  };

  const handleRequestShowing = () => {
    if (!user) {
      setAuthType('buyer');
      setShowAuthModal(true);
      toast({
        title: "Sign in required",
        description: "Please sign in to request a showing",
      });
      return;
    }
    setShowPropertyForm(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        {/* Background Images - DC landmarks */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
          {/* Washington Monument silhouette */}
          <div className="absolute bottom-0 right-1/4 w-2 h-40 bg-gradient-to-t from-slate-400 to-slate-600 opacity-20"></div>
          {/* Capitol dome silhouette */}
          <div className="absolute top-1/3 right-1/3 w-20 h-10 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-full opacity-20"></div>
          {/* Abstract building shapes */}
          <div className="absolute bottom-0 left-1/3 w-8 h-24 bg-gradient-to-t from-purple-400 to-purple-600 opacity-20"></div>
          <div className="absolute bottom-0 left-1/2 w-6 h-32 bg-gradient-to-t from-blue-400 to-blue-600 opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
              🏛️ Now Serving Washington DC Metro Area
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
              See the home you want,
              <span className="block">when you want</span>,
              <span className="block">without the <strong>commitment</strong></span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              FirstLook empowers homebuyers to request private showings on-demand, without requiring upfront buyer agreements. Stop dealing with pushy agents and restrictive buyer agreements. Your first showing is completely <strong>free</strong>. 🏠✨
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleRequestShowing}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Get Your FREE Home Tour
                <ChevronRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleGetStarted('agent')}
              >
                Join as Showing Partner
              </Button>
            </div>

            {/* DC-specific link */}
            <div className="mb-12">
              <Link to="/dc-home-buyers">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 underline font-medium"
                >
                  🏛️ Looking for homes specifically in Washington DC? →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">100%</div>
                <div className="text-gray-600 font-medium">Free First Showing</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">24hrs</div>
                <div className="text-gray-600 font-medium">Average Response Time</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Licensed</div>
                <div className="text-gray-600 font-medium">Vetted Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <HowItWorks />

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
              Why Choose FirstLook?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to find your perfect home, without the traditional hassles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">No Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Explore homes without sales pressure or commitment requirements. Your first showing is completely free.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">On-Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Request showings when it's convenient for you. See homes 7 days a week at times that work for you.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Vetted Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  All our showing partners are licensed, verified professionals committed to great service.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start House Hunting?
          </h2>
          <p className="text-purple-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
            Join thousands of buyers discovering their dream homes with FirstLook. Your first private showing is on us - <strong>zero commitment</strong> required. ✨
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleRequestShowing}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get Your Free Showing
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 font-bold text-xl transition-all duration-300"
              onClick={() => handleGetStarted('buyer')}
            >
              Sign Up & Start Browsing
            </Button>
          </div>
          
          <div className="text-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                Questions about the NAR settlement? Read our FAQ →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        userType={authType}
      />
      
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default Index;
