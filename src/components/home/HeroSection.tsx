
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onRequestShowing: () => void;
}

const HeroSection = ({ onRequestShowing }: HeroSectionProps) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-20 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 block">
            FirstLook
          </span>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-600 mb-4 leading-relaxed tracking-tight">
            Tour homes on your schedule—no agent agreement required
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Discover a modern, transparent homebuying experience built for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-6 text-xl font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 rounded-2xl"
              onClick={onRequestShowing}
            >
              <span>Start Your Free Tour</span>
              <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12 py-6 text-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 transition-all duration-300 font-medium rounded-2xl shadow-sm hover:shadow-md"
              onClick={scrollToHowItWorks}
            >
              How It Works
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/subscriptions">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 underline font-medium hover:scale-105 transition-all duration-200 shadow-none"
              >
                💰 See Transparent Pricing →
              </Button>
            </Link>
            <Link to="/agents">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 underline font-medium hover:scale-105 transition-all duration-200 shadow-none"
              >
                Join as DC Showing Partner →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
