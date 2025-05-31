
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg">
            🏛️ Now Serving Washington DC Metro Area
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Tour DC Homes
            <span className="block text-blue-600">Without the Hassle</span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop dealing with pushy agents and restrictive buyer agreements. FirstLook gives you instant access to home showings across Washington DC - from Capitol Hill to Georgetown - with zero commitment required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={onRequestShowing}
            >
              <MapPin className="mr-3 h-6 w-6" />
              Get Your FREE DC Home Tour
              <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-xl border-3 border-blue-200 text-blue-700 hover:bg-blue-50"
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
