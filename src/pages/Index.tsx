import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, Shield, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import HowItWorks from "@/components/HowItWorks";
import UserDashboard from "@/components/UserDashboard";
import TrustIndicators from "@/components/TrustIndicators";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import FAQSection from "@/components/FAQSection";
import { Link } from "react-router-dom";

const Index = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleRequestShowing = () => {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-20 relative overflow-hidden">
        {/* Enhanced Background Images */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=1200&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-50/70 to-blue-50/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          {/* Background Images - DC landmarks */}
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
              <MapPin className="w-4 h-4 mr-2" />
              🏛️ Now Serving Washington DC Metro Area & Beyond
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                See the home you want,
              </span>{" "}
              <span className="block text-slate-700">
                <span className="relative inline-block">
                  when you want,
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full opacity-60"></span>
                </span>
              </span>
              <span className="block mt-2">
                <span className="text-slate-700">without the </span>
                <span className="relative inline-block bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-black transform hover:scale-110 transition-transform duration-300">
                  commitment
                  <span className="absolute -top-1 -right-2 text-2xl">✋</span>
                </span>
              </span>
            </h1>
            
            <p className="text-2xl text-gray-800 mb-6 max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span> empowers Washington DC homebuyers to request <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">private showings on-demand</span>, without requiring upfront buyer agreements. Stop dealing with pushy agents and restrictive buyer agreements. Your first showing is <span className="relative inline-block font-black text-green-700">
                completely FREE
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-green-200 rounded-full -z-10"></span>
              </span>. 🏠✨
            </p>

            {/* Enhanced value proposition */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-purple-100 shadow-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-800">
                <div className="flex items-center gap-2 group">
                  <Shield className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="group-hover:text-green-600 transition-colors duration-200">Verified DC Professionals</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <Clock className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="group-hover:text-blue-600 transition-colors duration-200">Available 7 Days a Week</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <Sparkles className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="group-hover:text-purple-600 transition-colors duration-200">100% Free First Tour</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                onClick={handleRequestShowing}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Sparkles className="mr-3 h-6 w-6 relative z-10" />
                <span className="relative z-10">Get Your FREE DC Home Tour</span>
                <ChevronRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Link to="/agents">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-10 py-6 text-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-300"
                >
                  Join as DC Showing Partner
                </Button>
              </Link>
            </div>

            {/* DC-specific link */}
            <div className="mb-12">
              <Link to="/dc-home-buyers">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 underline font-medium hover:scale-105 transition-all duration-200"
                >
                  🏛️ Looking for homes specifically in Washington DC? →
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              <strong>What happens next?</strong> We'll match you with a <span className="text-purple-600 font-medium">verified, licensed real estate professional</span> who will <span className="font-bold text-blue-600">confirm your requested time</span>. <span className="text-green-600 font-bold">No strings attached.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose FirstLook */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Why Choose <span className="relative inline-block">
                <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span>?
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to find your <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">perfect DC home</span>, without the traditional hassles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Peace of Mind</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-lg">
                  Explore homes with <span className="font-semibold text-gray-900">verified, licensed real estate agents from your Washington DC community</span>. Your first showing is <span className="font-semibold text-green-700">completely free</span>.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">On-Demand Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-lg">
                  Request DC home showings when it's <span className="font-semibold text-blue-700">convenient for you</span>. See homes 7 days a week at times that work for your schedule.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Local DC Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-lg">
                  All our showing partners are <span className="font-semibold text-purple-700">licensed, verified professionals specializing in Washington DC</span> neighborhoods and market expertise.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Problem-Solution Section */}
      <ProblemSolutionSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start <span className="relative inline-block">
              DC House Hunting?
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-white/40 rounded-full"></span>
            </span>
          </h2>
          <p className="text-purple-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
            Join thousands of Washington DC buyers discovering their <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">dream homes</span> with FirstLook. Your first private showing is on us - <strong className="text-yellow-300">zero commitment</strong> required. ✨
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleRequestShowing}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get Your Free DC Showing
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 font-bold text-xl transition-all duration-300"
              onClick={handleRequestShowing}
            >
              Sign Up & Start Browsing DC
            </Button>
          </div>
          
          <div className="text-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                Have questions about FirstLook? Check our FAQ →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Request Form Modal */}
      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />

      {/* Footer with updated copyright */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FirstLook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
