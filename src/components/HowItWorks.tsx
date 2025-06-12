
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Key, Star, ArrowRight, Shield } from "lucide-react";

interface HowItWorksProps {
  onStartTour?: () => void;
}

const HowItWorks = ({ onStartTour }: HowItWorksProps) => {
  const steps = [
    {
      icon: Search,
      title: "Find Your Home",
      headline: "Browse any listing. No agent commitment, no pressure.",
      description: "Your info stays private until you decide to connect.",
      badge: "1",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Book a Tour Instantly",
      headline: "Pick your time. We match you with a licensed showing agent.",
      description: "Schedule on your terms—evenings, weekends, whenever works for you.",
      badge: "2",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Key,
      title: "Tour in Person",
      headline: "See the home privately. Ask questions or just look around.",
      description: "No sales pitch, no pressure—just you and the property.",
      badge: "3",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Star,
      title: "Decide Your Next Step",
      headline: "Loved it? Request more tours, write an offer, or connect with an agent.",
      description: "Only when you're ready. Complete control over your home buying journey.",
      badge: "4",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  return (
    <div id="how-it-works" className="py-20 bg-gradient-to-b from-white to-slate-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-800 mb-6">
            How <span className="relative inline-block">
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span> Works
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Getting your first <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">private showing</span> is simple, fast, and completely pressure-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white relative overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.gradient}`}></div>
                  <CardHeader className="pb-4 pt-8">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center shadow-lg relative`}>
                      <IconComponent className="h-8 w-8 text-white" />
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-sm">{step.badge}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-3">{step.title}</CardTitle>
                    <div className="text-lg font-semibold text-gray-800 mb-2 leading-snug">
                      {step.headline}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 leading-relaxed text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-3 shadow-lg border-2 border-gray-100">
                      <ArrowRight className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Trust Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-8 py-6 rounded-2xl border-2 border-green-200 shadow-lg max-w-2xl">
            <Shield className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <div className="font-bold text-lg mb-1">Your info stays private until you decide to connect.</div>
              <div className="text-green-700 text-sm italic">"So easy and pressure-free!" — Sarah M.</div>
            </div>
          </div>
        </div>

        {/* Free Showing Highlight */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 px-8 py-4 rounded-full border-2 border-blue-200 shadow-lg">
            <span className="text-3xl">🎉</span>
            <span className="font-semibold text-lg">Your first showing is <span className="font-black text-blue-700 relative">
              completely FREE
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-blue-200 rounded-full opacity-60 -z-10"></span>
            </span></span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={onStartTour}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start My First Tour
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-gray-600 mt-4 text-sm">
            No commitment required • Free first showing • Licensed agents only
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
