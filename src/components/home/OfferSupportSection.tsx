
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const OfferSupportSection = () => {
  const services = [
    {
      icon: FileText,
      title: "Offer Write Support",
      price: "$499",
      features: [
        "Professional offer construction",
        "Tailored to market conditions",
        "Includes up to 2 counter offers",
        "Additional documents: $99 each"
      ],
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Shield,
      title: "Full Contract Management",
      price: "$799",
      features: [
        "Complete contract facilitation",
        "Coordination with all parties",
        "Document management to closing",
        "Professional oversight & peace of mind"
      ],
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Need Help Making an Offer?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FirstLook offers professional offer support to help you navigate the buying process with confidence.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${service.bgGradient}`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                        {service.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-700 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <p key={featureIndex}>• {feature}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/subscriptions">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-4 text-lg"
            >
              Learn More About All Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-gray-600 mt-4 text-sm">
            Available to FirstLook members and non-members alike
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferSupportSection;
