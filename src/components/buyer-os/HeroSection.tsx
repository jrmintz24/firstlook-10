
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import IDXSearchWidget from "../IDXSearchWidget";

interface HeroSectionProps {
  onStartTour: () => void;
}

const HeroSection = ({ onStartTour }: HeroSectionProps) => {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 sm:py-20 pb-16 sm:pb-24 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/6ba068d7-ca3c-43e0-941a-2123fc869f3d.png)'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/80" />
      
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-6 tracking-tight leading-none">
            FirstLook
          </h1>
          
          <h2 className="text-4xl md:text-6xl font-extralight text-gray-900 mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            The Smarter Way to Buy a Home
          </h2>
          
          <h3 className="text-2xl md:text-4xl font-light text-gray-800 mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            A modern approach without pressure or contracts.
          </h3>
          
          <div className="space-y-4 mb-12">
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Expert help. On your terms.
            </p>
          </div>

          {/* IDX Search Widget */}
          <IDXSearchWidget className="mb-12" />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-black text-white px-10 py-5 text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl min-w-[280px] h-[56px]"
              onClick={onStartTour}
            >
              <span>Book Your Free Tour</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-5 text-base border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-medium rounded-xl shadow-sm hover:shadow-md min-w-[280px] h-[56px]"
              onClick={scrollToHowItWorks}
            >
              <Play className="mr-3 h-5 w-5" />
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
