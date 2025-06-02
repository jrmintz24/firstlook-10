
import { Button } from "@/components/ui/button";
import { Sparkles, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface FinalCTASectionProps {
  onRequestShowing: () => void;
}

const FinalCTASection = ({ onRequestShowing }: FinalCTASectionProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl font-bold text-white mb-6">
          Ready to Start <span className="relative inline-block">
            DC House Hunting?
            <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-white/40 rounded-full"></span>
          </span>
        </h2>
        <p className="text-purple-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
          Join thousands of Washington DC buyers discovering their <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">dream homes</span> with FirstLook. Your first private showing is on us - <strong className="text-yellow-300">zero commitment</strong> required. ✨
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={onRequestShowing}
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Get Your Free DC Showing
          </Button>
          <Link to="/subscriptions">
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 font-bold text-xl transition-all duration-300"
            >
              <DollarSign className="mr-3 h-6 w-6" />
              See Your Options
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/faq">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                Have questions about FirstLook? Check our FAQ →
              </Button>
            </Link>
            <Link to="/subscriptions">
              <Button variant="ghost" className="text-white hover:bg-white/10 underline">
                💎 See All Pricing & Plans →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
