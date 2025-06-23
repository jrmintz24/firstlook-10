
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, Gift } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Pick a Home",
      description: "Enter any address you want to tour.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Book a Time",
      description: "Choose when works for you. A FirstLook Pro meets you there.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Need Help? Just Ask",
      description: "Want help with the offer? Negotiation advice? It's optional.",
      color: "bg-purple-500"
    },
    {
      icon: Gift,
      title: "Get Rewarded",
      description: "Upgrade for commission rebates and extra tours.",
      color: "bg-orange-500"
    }
  ];

  return (
    <div id="how-it-works" className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 mb-8">
            How FirstLook Works
          </h2>
          <p className="text-lg sm:text-xl leading-8 text-gray-600 font-light">
            House hunting without the awkward contracts or sales pressure.
          </p>
        </div>
        
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
                <CardContent className="p-8 sm:p-10 text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-xl ${step.color} mb-8 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {step.description}
                  </p>
                  <div className="absolute -top-3 -right-3 h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                    {index + 1}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
