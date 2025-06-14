
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ConditionalCTAProps {
  index: number;
}

interface CTAConfig {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  gradient: string;
}

const getCTAConfig = (index: number): CTAConfig | null => {
  switch (index) {
    case 0:
      return {
        title: "Ready to get started?",
        description: "FirstLook makes it easy to tour homes without agent pressure and get professional support only when you need it.",
        buttonText: "Create Free Account",
        link: "/buyer-auth",
        gradient: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      };
    case 1:
      return {
        title: "Need help with financing?",
        description: "Connect with FirstLook's network of trusted lenders who understand independent buyers and DC programs.",
        buttonText: "Find Financing Options",
        link: "/subscriptions",
        gradient: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      };
    case 2:
      return {
        title: "Start your home search",
        description: "Use FirstLook's curated search tools to find homes that match your criteria in DC's competitive market.",
        buttonText: "Browse DC Homes",
        link: "/buyer-auth",
        gradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      };
    case 3:
      return {
        title: "Need help touring homes?",
        description: "FirstLook provides safe, professional home tours without the pressure of traditional agents.",
        buttonText: "Schedule Your First Tour",
        link: "/single-home-tour",
        gradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      };
    case 6:
      return {
        title: "Need help with offers?",
        description: "FirstLook offers flat-fee offer writing and negotiation support to help you win the home you want.",
        buttonText: "View Offer Support",
        link: "/subscriptions",
        gradient: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      };
    default:
      return null;
  }
};

export const ConditionalCTA = ({ index }: ConditionalCTAProps) => {
  const ctaConfig = getCTAConfig(index);
  
  if (!ctaConfig) return null;

  return (
    <div className={`p-4 md:p-8 bg-gradient-to-br ${ctaConfig.gradient.includes('purple') ? 'from-purple-50 to-indigo-50 border-purple-200/50' : ctaConfig.gradient.includes('green') ? 'from-green-50 to-emerald-50 border-green-200/50' : 'from-blue-50 to-cyan-50 border-blue-200/50'} rounded-xl md:rounded-2xl border`}>
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${ctaConfig.gradient.split(' hover:')[0]} rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0`}>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2 text-base md:text-lg">{ctaConfig.title}</h4>
          <p className="text-gray-600 mb-4 font-light text-sm md:text-base">
            {ctaConfig.description}
          </p>
          <Link to={ctaConfig.link}>
            <Button className={`bg-gradient-to-r ${ctaConfig.gradient} text-white rounded-lg md:rounded-xl font-medium text-sm md:text-base px-4 md:px-6 py-2 md:py-3`}>
              {ctaConfig.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
