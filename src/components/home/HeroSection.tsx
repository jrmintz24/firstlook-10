
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
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
          <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-6 tracking-tight leading-none">
            FirstLook
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-light text-gray-700 mb-6 leading-tight tracking-tight">
            Your Home Journey, <span className="font-semibold text-gray-900">On Your Terms</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Instant, commitment-free home tours – first one's on us.<br />
            <span className="text-gray-700 font-medium">No agent pressure. Full control. Save thousands.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-black text-white px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
              onClick={onRequestShowing}
            >
              <span>Start Your Free Tour</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12 py-6 text-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-medium rounded-2xl shadow-md hover:shadow-lg"
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
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-light transition-all duration-300 group rounded-xl"
              >
                <BookOpen className="mr-3 h-5 w-5 group-hover:text-gray-900 transition-colors duration-200" />
                Read Our Complete Homebuying Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
