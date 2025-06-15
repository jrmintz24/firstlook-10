
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Gift, Brain, CheckCircle } from "lucide-react";

const ValuePropositionSection = () => {
  const features = [
    {
      icon: Lock,
      label: "Private by Default",
      description: "We don't share your contacts unless you say so."
    },
    {
      icon: Zap,
      label: "Book Instantly",
      description: "No working around a single agent schedule."
    },
    {
      icon: Gift,
      label: "First Tour Free",
      description: "Zero cost, zero commitment."
    },
    {
      icon: Brain,
      label: "Support When You Want It",
      description: "DC-licensed pros are available on-call, never pushy."
    }
  ];

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="bg-gray-50 rounded-3xl p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
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
        <div className="mt-8 text-center">
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
