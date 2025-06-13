
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Key, Star, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Pick Your Properties",
      description: "Enter addresses or MLS IDs for homes you want to see. You're in control of your tour list.",
      badge: "1"
    },
    {
      icon: Calendar,
      title: "Choose Your Time",
      description: "Book a time that actually works for you. Need to reschedule? No problem - it's your tour.",
      badge: "2"
    },
    {
      icon: Key,
      title: "Tour With Confidence",
      description: "Meet your licensed DC professional and explore homes at your own pace. Ask questions, take your time.",
      badge: "3"
    },
    {
      icon: Star,
      title: "Move Forward (Or Don't)",
      description: "Loved a home? Get help with offers. Not feeling it? No worries. Zero pressure, always.",
      badge: "4"
    }
  ];

  return (
    <div id="how-it-works" className="py-16 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            How <span className="font-medium">FirstLook</span> Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            House hunting should be <span className="font-medium text-gray-900">on your timeline</span>, not an agent's. Here's how we make it simple:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-white rounded-2xl group">
                  <CardHeader className="pb-4 p-8">
                    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                      <span className="text-white font-medium text-lg">{step.badge}</span>
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-gray-700" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-gray-600 leading-relaxed font-light text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-md border border-gray-200">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-white text-gray-600 px-8 py-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <span className="text-2xl">💰</span>
            <span className="font-medium text-lg">Save <span className="font-semibold text-gray-900">
              thousands vs. 6% commissions
            </span> + your first tour is free</span>
          </div>
          <p className="text-gray-500 mt-6 text-sm font-light max-w-2xl mx-auto">
            With new industry rules, you can finally choose how much to pay for buyer representation. FirstLook gives you transparent options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
