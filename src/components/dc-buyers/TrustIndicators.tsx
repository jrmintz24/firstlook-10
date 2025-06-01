
import { Shield, Users, Clock, Award } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    { 
      value: "Top Rated", 
      label: "DC Real Estate Professionals", 
      gradient: "from-purple-600 to-purple-700",
      icon: Shield,
      detail: "Highly rated & verified partners"
    },
    { 
      value: "500+", 
      label: "Successful Home Tours", 
      gradient: "from-blue-600 to-blue-700",
      icon: Users,
      detail: "Happy homebuyers served"
    },
    { 
      value: "24hrs", 
      label: "Average Response Time", 
      gradient: "from-slate-600 to-slate-700",
      icon: Clock,
      detail: "Quick scheduling guaranteed"
    },
    { 
      value: "100%", 
      label: "Free First Tour", 
      gradient: "from-purple-700 to-blue-700",
      icon: Award,
      detail: "No hidden fees or surprises"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {indicators.map((indicator, index) => {
        const IconComponent = indicator.icon;
        return (
          <div 
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
          >
            <div className="mb-4">
              <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${indicator.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${indicator.gradient} bg-clip-text text-transparent`}>
                {indicator.value}
              </div>
            </div>
            <div className="text-gray-900 font-semibold text-lg mb-1">{indicator.label}</div>
            <div className="text-gray-600 text-sm">{indicator.detail}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustIndicators;
