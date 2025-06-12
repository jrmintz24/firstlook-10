
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Shield, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background */}
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
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-2 h-40 bg-gradient-to-t from-slate-400 to-slate-600 opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-10 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-full opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-8 h-24 bg-gradient-to-t from-purple-400 to-purple-600 opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-6 h-32 bg-gradient-to-t from-blue-400 to-blue-600 opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
            <MapPin className="w-4 h-4 mr-2" />
            🏛️ Now Serving Washington DC Metro Area
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
              Tour DC homes
            </span>{" "}
            <span className="block mt-2">
              <span className="relative inline-block text-slate-700">
                on your terms
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></span>
              </span>
            </span>
          </h1>
          
          <p className="text-2xl text-gray-800 mb-6 max-w-3xl mx-auto leading-relaxed">
            Finally, a <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">transparent way</span> to see homes in DC. No pushy agents, no upfront commitments, no hidden fees. Just <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">professional showings when you want them</span>. 
            <br />
            <span className="text-xl text-green-700 font-bold mt-2 inline-block">
              Save thousands vs. traditional 6% commissions ✨
            </span>
          </p>

          {/* Value proposition */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-purple-100 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-800">
              <div className="flex items-center gap-2 group">
                <Shield className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-green-600 transition-colors duration-200">Licensed DC Pros</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Clock className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-blue-600 transition-colors duration-200">Book in Minutes</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Sparkles className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-purple-600 transition-colors duration-200">First Tour Free</span>
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
              <span className="relative z-10">Start Your Free DC Tour</span>
              <ChevronRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Link to="/faq">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300"
              >
                How It Works
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/subscriptions">
              <Button 
                variant="ghost" 
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 underline font-medium hover:scale-105 transition-all duration-200"
              >
                💎 See All Plans & Pricing →
              </Button>
            </Link>
            <Link to="/agents">
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 underline font-medium hover:scale-105 transition-all duration-200"
              >
                Join as DC Showing Partner →
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <p className="text-green-800 max-w-2xl mx-auto text-lg">
              <strong>🎯 What happens next?</strong> Pick your properties, choose a time that works for you, and we'll connect you with a <span className="text-purple-600 font-medium">licensed DC professional</span>. <span className="font-bold text-green-700">Zero pressure, total transparency.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
