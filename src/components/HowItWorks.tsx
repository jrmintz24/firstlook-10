
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Key, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Find Your Property",
      description: "Enter the MLS ID or address of a home you want to see",
      badge: "1"
    },
    {
      icon: Calendar,
      title: "Pick Your Time",
      description: "Choose from available time slots that work for your schedule",
      badge: "2"
    },
    {
      icon: Key,
      title: "Meet & View",
      description: "Meet your licensed showing partner and explore the home",
      badge: "3"
    },
    {
      icon: Star,
      title: "Decide Next Steps",
      description: "No pressure - choose your next steps when you're ready",
      badge: "4"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How ViewFree Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting your first private showing is simple, fast, and completely free. Here's how it works:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="text-center border-blue-100 hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <Badge 
                    variant="secondary" 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white mx-auto mb-4 text-lg font-bold"
                  >
                    {step.badge}
                  </Badge>
                  <IconComponent className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-0.5 bg-blue-200"></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-6 py-3 rounded-full">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold">Your first showing is completely FREE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
