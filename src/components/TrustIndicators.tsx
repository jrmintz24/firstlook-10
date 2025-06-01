
import { Shield, Users, Clock, Award, Star, CheckCircle } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    { 
      value: "1000+", 
      label: "Successful Home Tours", 
      gradient: "from-blue-600 to-blue-700",
      icon: Users,
      detail: "Happy homebuyers served nationwide"
    },
    { 
      value: "12min", 
      label: "Average Response Time", 
      gradient: "from-slate-600 to-slate-700",
      icon: Clock,
      detail: "Quick scheduling guaranteed"
    },
    { 
      value: "Licensed", 
      label: "Vetted Partners", 
      gradient: "from-purple-600 to-purple-700",
      icon: Shield,
      detail: "All partners verified & licensed"
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
    <div className="py-16 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Trusted by <span className="relative inline-block text-purple-700">
              Homebuyers Nationwide
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-50"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Join <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">thousands</span> who've discovered a better way to tour homes
          </p>
        </div>
        
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

        {/* Additional trust elements */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-purple-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What makes <span className="text-purple-700">FirstLook</span> different?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg"><strong className="text-green-700">Transparent pricing</strong> from day one</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg"><strong className="text-blue-700">No binding agreements</strong> required</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-lg"><strong className="text-purple-700">You control</strong> the entire process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
