
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Phone, CheckCircle, Shield } from "lucide-react";

interface FinalCTASectionProps {
  onRequestShowing: () => void;
  onSignUp: () => void;
}

const FinalCTASection = ({ onRequestShowing, onSignUp }: FinalCTASectionProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 via-purple-700 to-blue-700 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl font-bold text-white mb-6">
          Your Perfect DC Home Awaits
        </h2>
        <p className="text-purple-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
          Stop waiting for the perfect open house or dealing with pushy agents. Get instant access to any property in Washington DC with FirstLook. Your first private showing is completely free - no strings attached.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 font-bold text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={onRequestShowing}
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Request Your FREE DC Home Tour
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-3 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 font-bold text-xl transition-all duration-300"
            onClick={onSignUp}
          >
            Sign Up & Start Browsing
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-white">
          <div className="flex items-center justify-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>See homes 7 days a week</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>100% Free First Tour</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Licensed DC Professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
