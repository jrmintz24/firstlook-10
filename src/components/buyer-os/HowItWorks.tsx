
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, FileText, Users, Gift } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Pick a Home",
      description: "Enter any address — no need to wait for MLS access.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Book a Time",
      description: "Choose when works for you. A FirstLook Pro will meet you there.",
      color: "bg-green-500"
    },
    {
      icon: FileText,
      title: "Sign a Tour Agreement",
      description: "We'll send you a non-exclusive, non-paid agreement — just to make things official.",
      color: "bg-orange-500"
    },
    {
      icon: Users,
      title: "Need Help? Just Ask",
      description: "Want offer support or negotiation guidance? It's always on-demand.",
      color: "bg-purple-500"
    },
    {
      icon: Gift,
      title: "Get Rewarded",
      description: "Upgrade to unlock rebates worth thousands when you buy.",
      color: "bg-red-500"
    }
  ];

  return (
    <div id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg leading-8 text-gray-600 font-light">
            House hunting without the gatekeeping.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 px-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${step.color} mb-6 shadow-md`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm">
                    {step.description}
                  </p>
                  <div className="absolute top-3 right-3 h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
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
