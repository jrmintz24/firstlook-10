
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Zap, ArrowRight, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface MembershipPreviewSectionProps {
  onRequestShowing: () => void;
}

const MembershipPreviewSection = ({ onRequestShowing }: MembershipPreviewSectionProps) => {
  const proFeatures = [
    "Unlimited access to home tours",
    "Up to 3 homes per tour session",
    "Same-day booking availability", 
    "Priority scheduling",
    "DIY Offer Maker tool included"
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-6 py-3 text-lg">
            <Star className="w-4 h-4 mr-2" />
            Pro Membership Available
          </Badge>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6">
            Unlock Unlimited Home Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with 5 free tours per month, or upgrade to Pro for unlimited access and same-day booking.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pro Membership Card */}
          <Card className="border-2 border-blue-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              Most Popular
            </Badge>

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-slate-800">FirstLook Pro</CardTitle>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-blue-600">$29<span className="text-base text-gray-600">/month</span></div>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 border-green-300">
                  Unlimited Tours
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Link to="/subscriptions">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-4 text-lg"
                  onClick={onRequestShowing}
                >
                  Start with 5 Free Tours
                </Button>
              </div>
              <p className="text-center text-xs text-gray-600 mt-3">No long-term contracts. Cancel anytime.</p>
            </CardContent>
          </Card>

          {/* Offer Services */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-slate-800">Professional Offer Services</CardTitle>
                <p className="text-gray-600">When you're ready to buy</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Agent-Coached Offer</span>
                    <span className="text-2xl font-bold text-green-600">$699</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Professional guidance through offer strategy & negotiation</p>
                  <Button 
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    size="sm"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Get Offer Help
                  </Button>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">+ Transaction Coordination</span>
                    <span className="text-2xl font-bold text-orange-600">+$399</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Complete management from offer to closing</p>
                  <Button 
                    className="w-full bg-orange-600 text-white hover:bg-orange-700"
                    size="sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Add Transaction Help
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Questions about our services?</p>
              <Link to="/faq">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 underline">
                  Check our FAQ →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* DIY Offer Tool CTA */}
        <div className="mt-12 text-center">
          <Card className="border-2 border-purple-200 bg-purple-50/30 p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              DIY Offer Maker Tool
            </h3>
            <p className="text-gray-700 mb-4">
              Pro members get free access to our DIY offer creation tool - create offers yourself with expert guidance.
            </p>
            <Link to="/offer-questionnaire">
              <Button variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                <FileText className="mr-2 h-4 w-4" />
                Try DIY Offer Maker (Pro Members)
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MembershipPreviewSection;
