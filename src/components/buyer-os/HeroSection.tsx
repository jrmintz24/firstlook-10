
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

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
    <div className="py-24 sm:py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-extralight text-gray-900 mb-12 tracking-tight leading-none">
            FirstLook
          </h1>
          
          <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-12 leading-tight tracking-tight max-w-5xl mx-auto">
            You Shouldn't Have to <span className="font-medium text-gray-900">Hire an Agent</span><br />
            Just to See a House
          </h2>
          
          <div className="space-y-6 mb-20">
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Tour homes on your schedule. Make offers only when you're ready.
            </p>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              No pressure. No contracts. No gatekeeping.
            </p>
            <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-semibold mt-8">
              Your first tour is totally free.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-black text-white px-12 py-6 text-lg font-medium shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl min-w-[300px] h-[64px]"
              onClick={onStartTour}
            >
              <span>See Your First Home Free</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12 py-6 text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-medium rounded-2xl shadow-sm hover:shadow-md min-w-[300px] h-[64px]"
              onClick={scrollToHowItWorks}
            >
              <Play className="mr-3 h-5 w-5" />
              How It Works
            </Button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-50 to-gray-50 opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
