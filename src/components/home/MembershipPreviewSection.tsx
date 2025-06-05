
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MembershipPreviewSectionProps {
  onRequestShowing: () => void;
}

const MembershipPreviewSection = ({ onRequestShowing }: MembershipPreviewSectionProps) => {
  const membershipFeatures = [
    "Unlimited access to the FirstLook platform",
    "VIP scheduling for showings—get priority booking",
    "Access to same day viewings when available",
    "One tour session included with subscription"
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200 px-6 py-3 text-lg">
            <Star className="w-4 h-4 mr-2" />
            VIP Membership Available
          </Badge>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Unlock VIP Home Shopping
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get priority access, unlimited tours, and expert support—all for one simple monthly fee.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Membership Card */}
          <Card className="border-2 border-purple-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            
            {/* Special Offer Banner */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
              <Zap className="w-3 h-3 inline mr-1" />
              LIMITED TIME!
            </div>

            <CardHeader className="text-center pb-4">
              <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">Most Popular</Badge>
              <CardTitle className="text-2xl text-slate-800">FirstLook Membership</CardTitle>
              
              {/* Special Pricing Display */}
              <div className="mb-4">
                <div className="text-5xl font-bold text-green-600">$29<span className="text-base text-gray-600">/first month</span></div>
                <div className="text-lg text-gray-500 line-through">$69.95</div>
                <div className="text-xl font-semibold text-purple-600">Then $69.95/month</div>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 border-green-300">
                  Save $40.95 Your First Month!
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {membershipFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
                <div className="text-sm text-gray-500 italic">+ 2 more benefits...</div>
              </div>
              <div className="space-y-3">
                <Link to="/subscriptions">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    See Full Membership Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-4 text-lg"
                  onClick={onRequestShowing}
                >
                  Start with FREE Tour Instead
                </Button>
              </div>
              <p className="text-center text-xs text-gray-600 mt-3">No long-term contracts. Cancel anytime.</p>
            </CardContent>
          </Card>

          {/* Pay-Per-Tour Options */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-slate-800">Pay-Per-Tour Options</CardTitle>
                <p className="text-gray-600">Perfect for one-time tours</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Single Home Tour</span>
                    <span className="text-2xl font-bold text-purple-600">$59</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">See one home without membership</p>
                  <Link to="/single-home-tour">
                    <Button 
                      className="w-full bg-purple-600 text-white hover:bg-purple-700"
                      size="sm"
                    >
                      Book Single Tour
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">Tour Session</span>
                    <span className="text-2xl font-bold text-blue-600">$149</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">See up to 3 homes in one session</p>
                  <Link to="/tour-session">
                    <Button 
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      Book Tour Session
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Questions about pricing?</p>
              <Link to="/faq">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 underline">
                  Check our FAQ →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPreviewSection;
