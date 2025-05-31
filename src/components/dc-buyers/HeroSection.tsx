
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
            🏛️ Now Serving Washington DC Metro Area
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-8 leading-tight">
            Tour DC Homes
            <span className="block">Without the Hassle</span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop dealing with pushy agents and restrictive buyer agreements. FirstLook gives you instant access to home showings across Washington DC - from Capitol Hill to Georgetown - with zero commitment required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={onRequestShowing}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get Your FREE DC Home Tour
              <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                See How FirstLook Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
