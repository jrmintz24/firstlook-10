
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Key, Star, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Find Your Property",
      description: "Enter the MLS ID or address of a home you want to see",
      badge: "1",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Pick Your Time",
      description: "Choose from available time slots that work for your schedule",
      badge: "2",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Key,
      title: "Meet & View",
      description: "Meet your licensed showing partner and explore the home",
      badge: "3",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Star,
      title: "Decide Next Steps",
      description: "No pressure - choose your next steps when you're ready",
      badge: "4",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  return (
    <div className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            How <span className="relative inline-block">
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span> Works
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-50"></span>
            </span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Getting your first <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">private showing</span> is simple, fast, and completely free. Here's how it works:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r bg-gray-100"></div>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-white font-bold text-lg">{step.badge}</span>
                    </div>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <ArrowRight className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-8 py-4 rounded-full border-2 border-green-200 shadow-lg">
            <span className="text-3xl">🎉</span>
            <span className="font-semibold text-lg">Your first showing is <span className="font-black text-green-700 relative">
              completely FREE
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-green-200 rounded-full opacity-60 -z-10"></span>
            </span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
