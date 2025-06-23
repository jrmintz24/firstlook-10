
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
        "One free home tour",
        "Book with FirstLook Pro",
        "No contracts or commitments",
        "Tour tracking dashboard"
      ],
      cta: "Get Started Free",
      popular: false,
      ctaLink: "/start"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/first month",
      originalPrice: "$49",
      tours: "Unlimited",
      features: [
        "Unlimited home tours",
        "Commission rebate access",
        "Priority scheduling support", 
        "Email and chat support",
        "Tour history & insights"
      ],
      cta: "Start Pro Trial",
      popular: true,
      ctaLink: "/subscriptions"
    },
    {
      name: "Premium", 
      price: "$99",
      period: "/month",
      tours: "Unlimited",
      features: [
        "Everything in Pro",
        "Dedicated offer assistance",
        "Maximum rebate percentages",
        "Priority phone support",
        "Market analysis reports"
      ],
      cta: "Go Premium",
      popular: false,
      ctaLink: "/subscriptions"
    }
  ];

  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Choose the plan that works for you. No hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl ${plan.popular ? 'scale-105 shadow-xl border-2 border-blue-500/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm font-medium shadow-lg rounded-full">
                    <Star className="mr-1.5 h-3.5 w-3.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-10">
                <CardTitle className="text-2xl font-semibold text-gray-900 mb-6">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 font-medium">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="mt-1">
                      <span className="text-base text-gray-400 line-through font-medium">
                        {plan.originalPrice}/month after
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-base font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {plan.tours} tours
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.ctaLink} className="w-full">
                  <Button 
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 rounded-xl ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 font-medium">
            All plans include commission rebates when you buy through FirstLook
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
