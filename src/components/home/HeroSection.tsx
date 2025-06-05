
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Shield, ChevronRight, Sparkles, MapPin, DollarSign, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('[data-trigger="showing-popup"]');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !showPopup) {
          // Show popup after a short delay when the element becomes visible
          setTimeout(() => {
            setShowPopup(true);
          }, 1000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPopup]);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
              <span className="block mt-2" data-trigger="showing-popup">
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
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                onClick={onRequestShowing}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Sparkles className="mr-3 h-6 w-6 relative z-10" />
                <span className="relative z-10">Get Your FREE DC Home Tour</span>
                <ChevronRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300"
                onClick={scrollToHowItWorks}
              >
                How It Works
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/agents">
                <Button 
                  variant="ghost" 
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 underline font-medium hover:scale-105 transition-all duration-200"
                >
                  Join as DC Showing Partner →
                </Button>
              </Link>
              <Link to="/subscriptions#hero">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 underline font-medium hover:scale-105 transition-all duration-200"
                >
                  💎 See Subscription Options →
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              <strong>What happens next?</strong> We'll match you with a <span className="text-purple-600 font-medium">verified, licensed real estate professional</span> who will <span className="font-bold text-blue-600">confirm your requested time</span>. <span className="text-green-600 font-bold">No strings attached.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Showing Request Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              🏠 Ready to See Your First Home?
            </DialogTitle>
            <DialogDescription className="text-center">
              Start your home search journey with a completely FREE showing - no commitment required!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={() => {
                setShowPopup(false);
                onRequestShowing();
              }}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Request Your FREE Tour
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPopup(false)}
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
