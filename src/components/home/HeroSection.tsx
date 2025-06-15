
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";
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
    <div className="py-16 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-4 tracking-tight">
            FirstLook
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-600 mb-3 leading-relaxed tracking-tight">
            Your Home Journey, <span className="font-bold">On Your Terms</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Instant, commitment-free home tours – first one's on us.<br />
            No agent pressure. Full control. Save thousands.
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

          {/* Featured Guide Link */}
          <div className="flex justify-center">
            <Link to="/homebuying-guide">
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-8 py-4 text-lg font-light transition-all duration-300 group"
              >
                <BookOpen className="mr-3 h-5 w-5 group-hover:text-gray-900" />
                Read Our Complete Homebuying Guide
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
