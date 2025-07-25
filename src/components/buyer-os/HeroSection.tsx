
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import PlaceholderSearchWidget from "../PlaceholderSearchWidget";
import MagneticButton from "@/components/ui/MagneticButton";

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

  const scrollToRebateCalculator = () => {
    const element = document.getElementById('rebate-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Add highlight animation
      setTimeout(() => {
        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 2000);
      }, 500);
    }
  };

  return (
    <div className="py-12 sm:py-20 pb-16 sm:pb-24 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/57d76f8d-b9d6-45e0-b1db-18317cbcf150.png)'
        }}
        role="img"
        aria-label="Modern home exterior showcasing FirstLook's home buying service"
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

          {/* Placeholder Search Widget */}
          <PlaceholderSearchWidget className="mb-12" />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton 
              variant="default"
              onClick={scrollToRebateCalculator}
              magneticStrength={0.2}
            >
              <span>Get Your Cash Back Estimate</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </MagneticButton>
            <MagneticButton 
              variant="outline"
              onClick={scrollToHowItWorks}
              magneticStrength={0.15}
            >
              <Play className="mr-3 h-5 w-5" />
              See How It Works
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
