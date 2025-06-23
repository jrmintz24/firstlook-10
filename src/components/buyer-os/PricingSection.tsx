
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      tours: "1",
      features: [
        "Book with Pro",
        "No contract",
        "Tour tracker"
      ],
      cta: "Get Started Free",
      popular: false,
      ctaLink: "/start"
    },
    {
      name: "Pro",
      price: "$29",
      period: "/first month",
      originalPrice: "$69",
      tours: "2",
      features: [
        "Rebate access",
        "Priority scheduling", 
        "Email support"
      ],
      cta: "Start Pro Trial",
      popular: true,
      ctaLink: "/subscriptions"
    },
    {
      name: "Premium", 
      price: "$69",
      period: "/month",
      tours: "5",
      features: [
        "Offer help",
        "Max rebates",
        "Phone support"
      ],
      cta: "Go Premium",
      popular: false,
      ctaLink: "/subscriptions"
    }
  ];

  return (
    <div className="py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-8">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Choose the plan that works for you. No hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl ${plan.popular ? 'scale-105 shadow-2xl border-2 border-blue-500/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-medium shadow-lg">
                    <Star className="mr-2 h-4 w-4" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-2xl font-medium text-gray-900 mb-8">
                  {plan.name}
                </CardTitle>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-light text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 font-light">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="mt-2">
                      <span className="text-lg text-gray-400 line-through font-light">
                        {plan.originalPrice}/month
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-lg font-medium text-blue-600">
                    {plan.tours} tours/month
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-10 pb-10">
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.ctaLink} className="w-full">
                  <Button 
                    className={`w-full h-14 text-lg font-medium transition-all duration-300 rounded-2xl ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 font-light text-lg">
            All plans include commission rebates when you buy through FirstLook
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
