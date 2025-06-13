
import { Button } from "@/components/ui/button";
import { Sparkles, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface FinalCTASectionProps {
  onRequestShowing: () => void;
}

const FinalCTASection = ({ onRequestShowing }: FinalCTASectionProps) => {
  return (
    <div className="bg-gray-900 py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-tight">
          Ready to Start <span className="font-medium">DC House Hunting?</span>
        </h2>
        <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-xl leading-relaxed font-light">
          Join thousands of Washington DC buyers discovering their dream homes with FirstLook. Your first private showing is on us - <span className="font-medium text-white">zero commitment</span> required.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 font-medium text-xl shadow-none rounded-2xl transition-all duration-200"
            onClick={onRequestShowing}
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Get Your Free DC Showing
          </Button>
          <Link to="/subscriptions">
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-6 font-medium text-xl rounded-2xl transition-all duration-200 shadow-none"
            >
              <DollarSign className="mr-3 h-6 w-6" />
              See Your Options
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light text-lg">
                Have questions about FirstLook? Check our FAQ →
              </Button>
            </Link>
            <Link to="/subscriptions">
              <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light text-lg">
                💎 See All Pricing & Plans →
              </Button>
            </Link>
            <Link to="/agents">
              <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light text-lg">
                <Users className="mr-2 h-4 w-4" />
                Join as Showing Partner →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
