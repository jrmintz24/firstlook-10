
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

interface BenefitsSectionProps {
  onSignUp: () => void;
}

const BenefitsSection = ({ onSignUp }: BenefitsSectionProps) => {
  const benefits = [
    "No upfront buyer agreements required",
    "Tour homes 7 days a week",
    "Licensed DC real estate professionals",
    "Complete neighborhood expertise",
    "Free first showing guaranteed",
    "No hidden fees or surprises"
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            What You Get With <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Everything you need to find your perfect DC home, without the traditional hassles.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-slate-200">
                <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                <span className="text-lg text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={onSignUp}
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Start Your DC Home Search Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
