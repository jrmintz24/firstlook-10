
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Gift, MapPin, CheckCircle } from "lucide-react";

const ValuePropositionSection = () => {
  const features = [
    {
      icon: Shield,
      label: "Private by Default",
      description: "Your contact info is never shared with agents—only you decide when to connect.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      label: "Zero Commitment",
      description: "Tour any home with no contracts, no pushy sales, no pressure to sign.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Gift,
      label: "First Tour Free",
      description: "Book your first showing risk-free, no strings attached.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      label: "Local Experts On-Call",
      description: "Verified, DC-licensed pros are ready to answer questions—only if you need them.",
      color: "from-purple-500 to-indigo-500"
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
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
            The only platform built for <span className="font-semibold text-gray-900">buyers, not agents.</span>
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            See how we're different
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 max-w-6xl mx-auto shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group border border-gray-100">
                  <div className={`w-14 h-14 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">{feature.label}</h3>
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
            className="bg-gray-900 hover:bg-black text-white px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-105"
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
