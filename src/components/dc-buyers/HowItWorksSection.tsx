
import { Search, Users, Home, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Find & Request",
      description: "Found a property you want to see? Just share the address or MLS ID with us. No account required for your first tour.",
      gradient: "from-purple-600 to-purple-700",
      icon: Search
    },
    {
      number: 2,
      title: "Get Matched",
      description: "We connect you with a licensed showing partner who specializes in your target DC neighborhood within 24 hours.",
      gradient: "from-blue-600 to-blue-700",
      icon: Users
    },
    {
      number: 3,
      title: "Tour Your Home",
      description: "Visit the property at your convenience. Get expert insights about the neighborhood, pricing, and market. No pressure, no commitments.",
      gradient: "from-slate-600 to-slate-700",
      icon: Home
    },
    {
      number: 4,
      title: "Decide Your Next Step",
      description: "Love it? Your partner can help with offers. Want to see more? Book additional tours. Not interested? Walk away with no obligations.",
      gradient: "from-purple-700 to-blue-700",
      icon: CheckCircle
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            How FirstLook Works in DC
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to transparent home touring. You're in control every step of the way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="text-center group">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-gray-700">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto border border-purple-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What makes FirstLook different?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span><strong>Transparent pricing</strong> from the start</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span><strong>No binding agreements</strong> required</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span><strong>You control the timeline</strong> and process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
