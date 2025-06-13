
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Key, HandHeart, ArrowRight, CheckCircle } from "lucide-react";

const ValuePropositionSection = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Request a Tour",
      description: "Pick a time and up to 3 homes you want to see.",
      subtext: "No need to hire an agent or reveal your info."
    },
    {
      icon: Key,
      title: "Tour Privately",
      description: "A vetted local agent will only act as your tour guide.",
      subtext: "They open the door and give you space – no sales pitch."
    },
    {
      icon: HandHeart,
      title: "Next Steps on Your Terms",
      description: "Love a home? Get flat-fee help to make an offer or connect with an agent by choice.",
      subtext: "Not ready? Keep touring with your subscription."
    }
  ];

  return (
    <div className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-600 border-gray-200 px-4 py-2 font-medium rounded-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            How FirstLook Works
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            What is <span className="font-medium">FirstLook</span> and why use it?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            House hunting without the hassle. Tour homes on your schedule with <span className="font-medium text-gray-900">zero pressure</span> and <span className="font-medium text-gray-900">complete transparency</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 relative overflow-hidden h-full">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-white font-medium text-lg">{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-gray-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">{step.title}</h3>
                  <p className="text-gray-600 mb-3 leading-relaxed text-center font-light">
                    {step.description}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed text-center font-light">
                    {step.subtext}
                  </p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-3 shadow-lg border border-gray-200">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-gray-50 text-gray-600 px-8 py-4 rounded-full border border-gray-200">
            <CheckCircle className="w-6 h-6 text-gray-600" />
            <span className="font-medium text-lg">
              <span className="font-semibold text-gray-900">No contracts, no commitment</span> until you're ready to make an offer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionSection;
