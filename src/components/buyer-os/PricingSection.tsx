
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
        "1 tour per month",
        "Book with FirstLook Pro",
        "Basic support",
        "Tour scheduling"
      ],
      cta: "Get Started",
      popular: false,
      ctaLink: "/start"
    },
    {
      name: "Pro",
      price: "$39",
      period: "/month",
      tours: "2",
      features: [
        "2 tours per month",
        "Tour tracking dashboard",
        "Commission rebate access",
        "Priority scheduling",
        "Email support"
      ],
      cta: "Upgrade Now",
      popular: true,
      ctaLink: "/subscriptions"
    },
    {
      name: "Premium",
      price: "$69",
      period: "/month",
      tours: "5",
      features: [
        "5 tours per month",
        "All Pro features",
        "VIP priority scheduling",
        "Phone support",
        "Offer writing assistance",
        "Maximum rebate potential"
      ],
      cta: "Upgrade Now",
      popular: false,
      ctaLink: "/subscriptions"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Transparent pricing with no hidden fees. Upgrade or downgrade anytime.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'border-2 border-blue-500 shadow-2xl scale-105' : 'border shadow-lg'} hover:shadow-xl transition-all duration-300`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1">
                  <Star className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-semibold text-blue-600">
                    {plan.tours} tours/month
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.ctaLink} className="w-full">
                  <Button 
                    className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
