
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Users, Clock, Shield, ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";

const Subscriptions = () => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const freeFeatures = [
    "5 home tours per month",
    "1 home per tour session",
    "Licensed showing partners", 
    "Basic tour scheduling",
    "Property research assistance",
    "Mobile app access"
  ];

  const proFeatures = [
    "Unlimited home tours",
    "Up to 3 homes per tour session",
    "Same-day showing availability",
    "Priority scheduling",
    "Multiple tours scheduled at once", 
    "DIY Offer Maker tool access",
    "Advanced property analytics",
    "Dedicated customer support",
    "Tour history & favorites",
    "Exclusive market insights"
  ];

  const handleSubscriptionComplete = () => {
    setShowSubscribeModal(false);
    // Could add success redirect or toast here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg">
              <Star className="w-4 h-4 mr-2" />
              Choose Your Plan
            </Badge>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-600 bg-clip-text text-transparent mb-6">
              Tour More Homes, Find Your Perfect Match
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with 5 free tours per month, or upgrade to Pro for unlimited access and same-day bookings.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-slate-800">Free Plan</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0<span className="text-lg text-gray-600">/month</span>
              </div>
              <CardDescription className="text-gray-600">
                Perfect for casual home shopping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup">
                <Button className="w-full bg-gray-900 hover:bg-black text-white py-4 text-lg font-medium">
                  <Users className="mr-2 h-5 w-5" />
                  Start Free
                </Button>
              </Link>
              <p className="text-center text-sm text-gray-600 mt-4">
                No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1">
              Most Popular
            </Badge>

            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-slate-800">Pro Plan</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                $29<span className="text-lg text-gray-600">/month</span>
              </div>
              <CardDescription className="text-gray-600">
                For serious home buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setShowSubscribeModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-medium"
              >
                <Zap className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </Button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Cancel anytime • No long-term contracts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Offer Services Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Professional Offer Services</h2>
            <p className="text-lg text-gray-600">
              Ready to make an offer? Get expert guidance from licensed agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-200 bg-green-50/30 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-slate-800">Agent-Coached Offer</CardTitle>
                <div className="text-3xl font-bold text-green-600 mb-2">$699</div>
                <CardDescription>
                  Professional agent guides your offer strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {[
                    "1-on-1 consultation with licensed agent",
                    "Comprehensive market analysis", 
                    "Offer strategy development",
                    "Contract review and guidance",
                    "Negotiation support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                  <Shield className="mr-2 h-4 w-4" />
                  Get Offer Help
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50/30 shadow-lg">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-orange-100 text-orange-800 border-orange-300">
                  Add-on Service
                </Badge>
                <CardTitle className="text-xl text-slate-800">Transaction Coordination</CardTitle>
                <div className="text-3xl font-bold text-orange-600 mb-2">+$399</div>
                <CardDescription>
                  Complete transaction management from offer to closing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {[
                    "Dedicated transaction coordinator",
                    "Contract to closing management",
                    "Vendor coordination (inspections, appraisals)", 
                    "Timeline management & reminders",
                    "Closing preparation assistance"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Transaction Help
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Card className="border-2 border-blue-200 bg-blue-50/50 p-6">
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Complete Package: $1,098
              </h4>
              <p className="text-gray-700 mb-4">
                Get both agent-coached offer strategy AND complete transaction coordination.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Clock className="mr-2 h-4 w-4" />
                Book Complete Service
              </Button>
            </Card>
          </div>
        </div>

        {/* DIY Offer Tool CTA */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Card className="border-2 border-purple-200 bg-purple-50/30 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              DIY Offer Maker Tool
            </h3>
            <p className="text-gray-700 mb-4">
              Pro Plan members get free access to our DIY offer creation tool.
            </p>
            <Link to="/offer-questionnaire">
              <Button variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                Try DIY Offer Maker (Pro Members Only)
              </Button>
            </Link>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-2">
                What's included in the 5 free tours per month?
              </h3>
              <p className="text-gray-600">
                Each tour includes coordination with a licensed showing partner, scheduling assistance, and the ability to see 1 home per tour session. You get 5 of these tours every month at no cost.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-2">
                How does the Pro Plan differ from Free?
              </h3>
              <p className="text-gray-600">
                Pro gives you unlimited tours with up to 3 homes per session, same-day booking availability, priority scheduling, and access to our DIY offer creation tool. Perfect for active home buyers.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-2">
                When should I consider the offer services?
              </h3>
              <p className="text-gray-600">
                Our professional offer services are perfect when you've found a home you want to buy. The $699 agent-coached service helps with strategy and negotiation, while the +$399 transaction coordination manages everything from offer to closing.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </div>
  );
};

export default Subscriptions;
