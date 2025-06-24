
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
      tours: "1 home tour/month",
      features: [
        "1 home tour/month (single property)",
        "Book with a FirstLook Pro",
        "Tour tracking dashboard",
        "Upgrade anytime for rebates or offer help"
      ],
      cta: "Get Started Free",
      popular: false,
      ctaLink: "/start",
      color: "green"
    },
    {
      name: "Pro",
      price: "$39",
      period: "/month",
      tours: "2 tour sessions/month",
      features: [
        "2 tour sessions/month (up to 3 homes/session)",
        "Access to offer creator tool",
        "Priority scheduling",
        "Rebate access (90% of buyer agent commission)",
        "Email + chat support"
      ],
      cta: "Upgrade to Pro",
      popular: true,
      ctaLink: "/subscriptions",
      color: "blue"
    },
    {
      name: "Premium", 
      price: "$149",
      period: "/month",
      tours: "5 tour sessions/month",
      features: [
        "5 tour sessions/month (up to 3 homes/session)",
        "Everything in Pro",
        "Dedicated agent-coached offer assistance",
        "Max rebate percentage unlocked",
        "Phone support + local market reports"
      ],
      cta: "Go Premium",
      popular: false,
      ctaLink: "/subscriptions",
      color: "purple"
    }
  ];

  const addOns = [
    { name: "Extra Tour Session", price: "$25", note: "(members)" },
    { name: "One-off Tour", price: "$49", note: "(non-members)" },
    { name: "Offer Write", price: "$399", note: "" },
    { name: "Contract Management", price: "$799", note: "" }
  ];

  return (
    <div className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
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
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-4 ${
                  plan.color === 'green' ? 'bg-green-100 text-green-600' :
                  plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {plan.color === 'green' ? '🟢' : plan.color === 'blue' ? '🔵' : '🟣'}
                </div>
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
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-600">
                    {plan.tours}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-light text-sm">{feature}</span>
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

        {/* Add-Ons Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">Add-Ons & Extras</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900 mb-1 text-sm">{addon.name}</h4>
                <p className="text-lg font-semibold text-gray-900">{addon.price}</p>
                {addon.note && <p className="text-xs text-gray-500">{addon.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
