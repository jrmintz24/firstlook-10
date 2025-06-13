
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

  return (
    <div className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            The only platform built for <span className="font-medium">buyers, not agents</span>
          </h2>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-gray-700" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.label}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionSection;
