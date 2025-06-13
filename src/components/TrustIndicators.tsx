
import { Shield, Users, Clock, Award, Star, CheckCircle, Lock, Eye, Gift } from "lucide-react";

const TrustIndicators = () => {
  const features = [
    {
      icon: Lock,
      title: "Your Privacy, Protected",
      description: "We'll never share your info with agents—only you decide when to connect."
    },
    {
      icon: Clock,
      title: "Instant Tour Scheduling",
      description: "Book a home showing in minutes—no calls, no waiting, no agent commitment."
    },
    {
      icon: Eye,
      title: "No Pressure, No Pushy Sales",
      description: "See any home you want, with a local pro on standby for support only if you ask."
    },
    {
      icon: Gift,
      title: "First Tour is Free",
      description: "Try it with zero risk—your first showing is always on us, no strings attached."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Loved by <span className="font-medium">DC Homebuyers Who Want Control</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Home tours—your way, on your terms. Here's how FirstLook delivers:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3 leading-tight">{feature.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-500 font-light italic">
            "Experience the freedom of home shopping built for today's buyers."
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
