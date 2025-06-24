
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface FinalCTASectionProps {
  onRequestShowing: () => void;
}

const FinalCTASection = ({ onRequestShowing }: FinalCTASectionProps) => {
  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🎯</span>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
              Ready to Tour <span className="font-medium">Without the Hassle?</span>
            </h2>
          </div>
          <p className="text-gray-300 mb-10 max-w-3xl mx-auto text-lg leading-relaxed font-light">
            Your first home tour is free with the Basic plan.<br />
            Upgrade anytime — no contracts, just control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 font-medium text-lg shadow-sm hover:shadow-md rounded-xl transition-all duration-300 hover:scale-105"
              onClick={onRequestShowing}
            >
              Book a Tour
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Link to="/subscriptions">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 font-medium text-lg rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
              >
                Compare Plans
              </Button>
            </Link>
          </div>
          
          <div className="text-center border-t border-white/20 pt-6">
            <Link to="/agents">
              <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light hover:scale-105 transition-all duration-200">
                <Users className="mr-2 h-4 w-4" />
                Join as a Showing Partner →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
