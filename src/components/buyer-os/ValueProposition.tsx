
import { Shield, Zap, DollarSign, Users, ArrowRight } from "lucide-react";

const ValueProposition = () => {
  const features = [
    {
      icon: Shield,
      label: "Private by Default",
      description: "Your info stays yours. No sales calls, no surprise agent emails.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Zap,
      label: "Zero Commitment",
      description: "No contracts. Tour any home without signing your life away.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: DollarSign,
      label: "Save Thousands in Commissions",
      description: "Get 90% of buyer agent commissions back when you purchase through FirstLook.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      label: "Local Pros, Only When You Want Them",
      description: "Licensed, DC-based agents meet you at the door — and only help when you ask.",
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
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2 mb-6 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Built for Modern Homebuyers</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
            Why FirstLook?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-4">
            The only platform built for <span className="font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">buyers — not agents.</span>
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Every feature designed to give you control, transparency, and flexibility in your home search.
          </p>
        </div>

        {/* Features Grid with Alternating Layout */}
        <div className="max-w-6xl mx-auto space-y-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Icon and Visual Side */}
                <div className="flex-1 flex justify-center">
                  <div className={`relative ${feature.bgColor} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 group`}>
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-md`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-md opacity-80"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gray-200 rounded-full opacity-60"></div>
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 leading-tight">
                    {feature.label}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed font-light mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-gray-500 font-medium group cursor-pointer">
                    <span className="group-hover:text-gray-700 transition-colors">Learn more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
            <p className="text-base text-gray-700 font-medium mb-2">
              Traditional real estate puts agents first.
            </p>
            <p className="text-lg font-semibold text-gray-900">
              We put <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">you</span> first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
