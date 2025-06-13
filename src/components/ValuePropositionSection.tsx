
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Gift, MapPin, CheckCircle } from "lucide-react";

const ValuePropositionSection = () => {
  const features = [
    {
      icon: Shield,
      label: "Private by Default",
      description: "Your contact info is never shared with agents—only you decide when to connect."
    },
    {
      icon: Zap,
      label: "Zero Commitment",
      description: "Tour any home with no contracts, no pushy sales, no pressure to sign."
    },
    {
      icon: Gift,
      label: "First Tour Free",
      description: "Book your first showing risk-free, no strings attached."
    },
    {
      icon: MapPin,
      label: "Local Experts On-Call",
      description: "Verified, DC-licensed pros are ready to answer questions—only if you need them."
    }
  ];

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            The only platform built for <span className="font-medium">buyers, not agents</span>
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            See how we're different — for Washington DC buyers.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">{feature.label}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
            onClick={scrollToHowItWorks}
          >
            Start Your Free Tour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionSection;
