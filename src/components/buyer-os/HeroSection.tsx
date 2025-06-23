
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
    <div className="py-20 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 mb-8 tracking-tight leading-none">
            FirstLook
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-light text-gray-700 mb-8 leading-tight tracking-tight">
            You Shouldn't Have to <span className="font-semibold text-gray-900">Hire an Agent</span><br />
            Just to See a House
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Tour homes on your terms. Make offers only when you're ready.<br />
            <span className="text-gray-700 font-medium">Your first home tour is completely free.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-black text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl min-w-[280px] h-[60px]"
              onClick={onStartTour}
            >
              <span>See Your First Home Free</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-4 text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-semibold rounded-2xl shadow-md hover:shadow-lg min-w-[280px] h-[60px]"
              onClick={scrollToHowItWorks}
            >
              <Play className="mr-2 h-5 w-5" />
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-100 to-blue-50 opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
