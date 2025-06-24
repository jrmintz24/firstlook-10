
import { Shield, Zap, DollarSign, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ValueProposition = () => {
  const features = [
    {
      icon: Shield,
      label: "Private by Default",
      description: "We never share your info with agents. You decide when to connect.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: DollarSign,
      label: "Commission Rebates",
      description: "Get up to 90% of buyer-side commission back at closing.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      label: "Zero Commitment",
      description: "No contracts, no pushy sales. Tour any home, any time.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Users,
      label: "Local Pros When You Need Them",
      description: "Licensed agents meet you at the door. Help is always optional.",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20"></div>
      
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
            Why FirstLook?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-4">
            <span className="font-semibold text-gray-900">The only platform built for modern buyers — not agents.</span>
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Every feature is designed to give you control, privacy, and leverage.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <div 
                key={index}
                className={`relative ${feature.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 group`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-md mb-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight text-center">
                  {feature.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light text-center">
                  {feature.description}
                </p>
                
                {/* Decorative elements */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gray-200 rounded-full opacity-60"></div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/subscriptions">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
            >
              See Plans & Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
