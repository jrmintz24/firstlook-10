
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, FileText, Clock, ArrowRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingSectionProps {
  onStartTour?: () => void;
}

const PricingSection = ({ onStartTour }: PricingSectionProps) => {
  const freeFeatures = [
    "5 home tours per month",
    "1 home per tour session",
    "Licensed showing partners",
    "Tour scheduling & coordination",
    "Property research assistance"
  ];

  const proFeatures = [
    "Unlimited home tours",
    "Up to 3 homes per tour session", 
    "Same-day showing availability",
    "Priority scheduling",
    "Multiple tours scheduled at once",
    "DIY Offer Maker tool access",
    "Advanced property analytics",
    "Dedicated support"
  ];

  const offerServices = [
    {
      title: "Professional Offer",
      price: "$699",
      description: "Professional agent guides your offer strategy, market analysis, and negotiation tactics",
      features: [
        "1-on-1 consultation with licensed agent",
        "Comprehensive market analysis",
        "Offer strategy development", 
        "Contract review and guidance",
        "Negotiation support"
      ]
    },
    {
      title: "Transaction Coordination",
      price: "$399",
      description: "Complete transaction management from offer to closing",
      features: [
        "Dedicated transaction coordinator",
        "Contract to closing management",
        "Vendor coordination (inspections, appraisals)",
        "Timeline management & reminders",
        "Closing preparation assistance"
      ]
    }
  ];

  const handleStartFree = () => {
    if (onStartTour) {
      onStartTour();
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200/70 px-6 py-3 text-lg shadow-smooth backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2" />
            New Simplified Pricing
          </Badge>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-600 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free with 5 tours per month, or go unlimited with Pro. Add professional offer services when you're ready to buy.
          </p>
        </div>

        {/* Tour Plans Section */}
        <div className="mb-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200/50 shadow-smooth hover:shadow-smooth-lg relative overflow-hidden bg-white/95 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <CardTitle className="text-2xl text-slate-800">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for casual home shopping</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-8">
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleStartFree}
                  className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white py-4 text-lg shadow-smooth hover:shadow-smooth-lg"
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-200/70 shadow-glow relative overflow-hidden bg-white/95 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-smooth">
                Most Popular
              </Badge>

              <CardHeader className="text-center pb-4 relative z-10">
                <CardTitle className="text-2xl text-slate-800">Pro Plan</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For serious home buyers</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-8">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/subscriptions">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg shadow-glow">
                    <Zap className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-center text-xs text-gray-600 mt-3">Cancel anytime. No long-term contracts.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offer Services Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Professional Offer Services</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When you're ready to make an offer, get expert guidance from licensed agents and transaction coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offerServices.map((service, index) => (
              <Card key={index} className={`border-2 shadow-smooth hover:shadow-smooth-lg relative overflow-hidden bg-white/95 backdrop-blur-sm ${
                index === 0 ? 'border-green-200/70 hover:shadow-glow-green' : 'border-orange-200/70 hover:shadow-glow-orange'
              }`}>
                <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                  index === 0 ? 'bg-gradient-to-br from-green-50/20 via-emerald-50/10 to-transparent' : 'bg-gradient-to-br from-orange-50/20 via-amber-50/10 to-transparent'
                }`}></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <CardTitle className="text-xl text-slate-800">{service.title}</CardTitle>
                  <div className={`text-3xl font-bold mb-2 ${
                    index === 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {service.price}
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="border-2 border-blue-200/70 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 shadow-glow backdrop-blur-sm">
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Professional Offer + Transaction Coordination: $999
              </h4>
              <p className="text-gray-700 mb-4">
                Get both agent-coached offer strategy AND complete transaction coordination for maximum support through your home purchase.
              </p>
              <p className="text-sm text-gray-600">
                Available when creating your offer in the dashboard
              </p>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Pro Plan members</strong> get access to the DIY Offer Maker tool at no extra cost.
            </p>
            <Link to="/offer-questionnaire">
              <Button variant="outline" className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 backdrop-blur-sm">
                Try DIY Offer Maker (Pro Members)
              </Button>
            </Link>
          </div>
        </div>

        {/* Value Proposition Footer */}
        <div className="mt-20 text-center">
          <div className="bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 max-w-4xl mx-auto shadow-smooth hover:shadow-smooth-lg transition-all duration-300">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Why Choose FirstLook?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-smooth">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Licensed Professionals</h4>
                <p className="text-sm text-gray-600">All our showing partners are licensed real estate professionals in DC/MD/VA</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-smooth">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">No Pressure</h4>
                <p className="text-sm text-gray-600">Tour homes without sales pressure. We're here to help, not to push</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-smooth">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
                <p className="text-sm text-gray-600">See multiple homes efficiently with our coordinated tour sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
