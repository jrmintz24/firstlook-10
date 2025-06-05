
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const OfferSupportSection = () => {
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Offer Write Support</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">$499</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>• Professional offer construction</p>
                <p>• Tailored to market conditions</p>
                <p>• Includes up to 2 counter offers</p>
                <p>• Additional documents: $99 each</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Full Contract Management</CardTitle>
                  <div className="text-3xl font-bold text-purple-600">$799</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>• Complete contract facilitation</p>
                <p>• Coordination with all parties</p>
                <p>• Document management to closing</p>
                <p>• Professional oversight & peace of mind</p>
              </div>
            </CardContent>
          </Card>
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
