
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Key, HandHeart, ArrowRight, CheckCircle } from "lucide-react";

const ValuePropositionSection = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Request a Tour",
      description: "Pick a time and up to 3 homes you want to see.",
      subtext: "No need to hire an agent or reveal your info.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Key,
      title: "Tour Privately",
      description: "A vetted local agent will only act as your tour guide.",
      subtext: "They open the door and give you space – no sales pitch.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: HandHeart,
      title: "Next Steps on Your Terms",
      description: "Love a home? Get flat-fee help to make an offer or connect with an agent by choice.",
      subtext: "Not ready? Keep touring with your subscription.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            How FirstLook Works
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            What is <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span> and why use it?
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            House hunting without the hassle. Tour homes on your schedule with <span className="font-semibold text-purple-700">zero pressure</span> and <span className="font-semibold text-blue-700">complete transparency</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 relative overflow-hidden h-full">
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
                  <p className="text-gray-700 mb-3 leading-relaxed text-center font-medium">
                    {step.description}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed text-center italic">
                    {step.subtext}
                  </p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-3 shadow-lg border border-gray-200">
                      <ArrowRight className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-8 py-4 rounded-full border-2 border-green-200 shadow-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-lg">
              <span className="font-black text-green-700">No contracts, no commitment</span> until you're ready to make an offer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionSection;
