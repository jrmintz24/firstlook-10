
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ArrowRight, Shield } from "lucide-react";

const CommissionExplainer = () => {
  return (
    <div className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
            Why You Get a Rebate <span className="font-medium">(And Others Don't)</span>
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-2xl mb-8">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">How Seller Commissions Work</h3>
                  <p className="text-gray-700 leading-relaxed font-light text-lg mb-4">
                    When a seller lists a home, they often offer a buyer agent commission (e.g., 2.5%) — usually <strong>$10K–$20K+</strong>.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-light text-lg">
                    Here's the catch: <strong>legally, that commission can only be paid to a licensed agent</strong>. Buyers can't collect it directly.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                  <h4 className="text-xl font-semibold text-gray-900">That's where FirstLook comes in.</h4>
                </div>
                <p className="text-gray-700 leading-relaxed font-light text-lg mb-4">
                  We serve as your placeholder agent of record, enabling the rebate. FirstLook keeps 10% as a service fee and <strong>passes 90% to you</strong> — often thousands of dollars back in your pocket.
                </p>
                
                <div className="flex items-center justify-center gap-4 text-sm font-medium mt-6 flex-wrap bg-gray-50 rounded-xl p-4">
                  <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full">Seller Pays Commission</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full">FirstLook Collects (10%)</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full">You Get 90% Back</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommissionExplainer;
