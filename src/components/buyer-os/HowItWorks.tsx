
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
    <div id="how-it-works" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How FirstLook Works
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            House hunting without the awkward contracts or sales pressure.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${step.color} mb-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="absolute -top-4 -right-4 h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
