
import { Button } from "@/components/ui/button";
import { Sparkles, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface FinalCTASectionProps {
  onRequestShowing: () => void;
}

const FinalCTASection = ({ onRequestShowing }: FinalCTASectionProps) => {
  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
            Ready to Start <span className="font-medium">DC House Hunting?</span>
          </h2>
          <p className="text-gray-300 mb-10 max-w-3xl mx-auto text-lg leading-relaxed font-light">
            Join thousands of Washington DC buyers discovering their dream homes with FirstLook. Your first private showing is on us - <span className="font-medium text-white">zero commitment</span> required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 font-medium text-lg shadow-sm hover:shadow-md rounded-xl transition-all duration-300 hover:scale-105"
              onClick={onRequestShowing}
            >
              <Sparkles className="mr-3 h-5 w-5" />
              Get Your Free DC Showing
            </Button>
            <Link to="/subscriptions">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 font-medium text-lg rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
              >
                <DollarSign className="mr-3 h-5 w-5" />
                See Your Options
              </Button>
            </Link>
          </div>
          
          <div className="text-center border-t border-white/20 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/faq">
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light hover:scale-105 transition-all duration-200">
                  Have questions about FirstLook? Check our FAQ →
                </Button>
              </Link>
              <Link to="/subscriptions">
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light hover:scale-105 transition-all duration-200">
                  💎 See All Pricing & Plans →
                </Button>
              </Link>
              <Link to="/agents">
                <Button variant="ghost" className="text-gray-300 hover:bg-white/10 font-light hover:scale-105 transition-all duration-200">
                  <Users className="mr-2 h-4 w-4" />
                  Join as Showing Partner →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
