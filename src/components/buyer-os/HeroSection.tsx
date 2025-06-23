
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
    <div className="relative overflow-hidden bg-white">
      {/* Main Hero Content */}
      <div className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              You Shouldn't Have to{" "}
              <span className="text-blue-600">Hire an Agent</span>{" "}
              Just to See a House
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Tour homes on your terms. Make offers only when you're ready.
              <br />
              <span className="font-semibold text-gray-900">
                Your first home tour is completely free.
              </span>
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                onClick={onStartTour}
                className="h-14 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                See Your First Home Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToHowItWorks}
                className="h-14 px-8 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                Learn How It Works
              </Button>
            </div>
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
