
import { Shield, Users, Clock, Award, Star, CheckCircle } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    { 
      value: "1000+", 
      label: "Successful Home Tours", 
      icon: Users,
      detail: "Happy DC homebuyers served"
    },
    { 
      value: "12min", 
      label: "Average Response Time", 
      icon: Clock,
      detail: "Quick scheduling guaranteed"
    },
    { 
      value: "Licensed", 
      label: "DC Professionals", 
      icon: Shield,
      detail: "All partners verified & DC-licensed"
    },
    { 
      value: "100%", 
      label: "Free First Tour", 
      icon: Award,
      detail: "No hidden fees or surprises"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Trusted by <span className="font-medium">DC Homebuyers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands who've discovered a better way to tour Washington DC homes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {indicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div 
                key={index}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-light text-gray-900 mb-2">
                    {indicator.value}
                  </div>
                </div>
                <div className="text-gray-900 font-medium text-lg mb-2">{indicator.label}</div>
                <div className="text-gray-600 text-sm font-light">{indicator.detail}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-3xl p-12 max-w-4xl mx-auto border border-gray-200 shadow-sm">
          <div className="text-center">
            <h3 className="text-3xl font-light text-gray-900 mb-8 tracking-tight">
              What makes <span className="font-medium">FirstLook</span> different in Washington DC?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg font-light"><span className="font-medium text-green-700">Transparent pricing</span> from day one</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg font-light"><span className="font-medium text-blue-700">No binding agreements</span> required</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg font-light"><span className="font-medium text-purple-700">Local DC experts</span> only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
