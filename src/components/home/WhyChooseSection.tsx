
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Users } from "lucide-react";

const WhyChooseSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Peace of Mind",
      description: "Explore homes with verified, licensed real estate agents from your Washington DC community. Your first showing is completely free.",
      gradient: "from-slate-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "On-Demand Access",
      description: "Request DC home showings when it's convenient for you. See homes 7 days a week at times that work for your schedule.",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      icon: Users,
      title: "Local DC Experts",
      description: "All our showing partners are licensed, verified professionals specializing in Washington DC neighborhoods and market expertise.",
      gradient: "from-blue-600 to-cyan-600"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-800 mb-6">
            Why Choose <span className="relative inline-block">
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">FirstLook</span>?
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to find your <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">perfect DC home</span>, without the traditional hassles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
