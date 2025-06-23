
import { Shield, Zap, Gift, Users } from "lucide-react";

const ValueProposition = () => {
  const features = [
    {
      icon: Shield,
      label: "Private by Default",
      description: "Your info stays yours. No sales calls, no surprise agent emails.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      label: "Zero Commitment",
      description: "No contracts. Tour any home without signing your life away.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Gift,
      label: "First Tour Free",
      description: "Try it risk-free. Just book and go — no hidden fees.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      label: "Local Pros, Only When You Want Them",
      description: "Licensed, DC-based agents meet you at the door — and only help when you ask.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
            Why FirstLook?
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            The only platform built for <span className="font-semibold text-gray-900">buyers — not agents.</span>
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
      </div>
    </div>
  );
};

export default ValueProposition;
