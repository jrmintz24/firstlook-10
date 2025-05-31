
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 py-20 relative overflow-hidden">
      {/* Background Images */}
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
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
            🏛️ Now Serving Washington DC Metro Area
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
            Tour DC Homes
            <span className="block">Without the Hassle</span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop dealing with pushy agents and restrictive buyer agreements. FirstLook gives you instant access to home showings across Washington DC - from Capitol Hill to Georgetown - with <strong>zero commitment</strong> required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={onRequestShowing}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get Your FREE DC Home Tour
              <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
