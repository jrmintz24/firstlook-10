
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DollarSign, ArrowRight, Shield, Info, Lock, Unlock } from "lucide-react";
import { SavingsCalculator } from "@/components/homebuying-guide/SavingsCalculator";

const CommissionExplainer = () => {
  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-tight">
            💸 <span className="font-semibold">Unlock the Commission You Deserve</span>
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Sellers already set aside thousands for your agent. FirstLook makes sure you get it.
          </p>
        </div>
        
        {/* Main Explanation Card */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg rounded-2xl">
            <CardContent className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Unlock className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed font-light text-lg mb-4">
                  Most sellers already offer <strong>2–3%</strong> to the buyer's agent — but unless you're working with one, that money just disappears.
                </p>
                <p className="text-gray-700 leading-relaxed font-light text-lg">
                  That's where we come in. <strong>FirstLook acts as your agent of record</strong>, unlocking the rebate and putting up to <strong>$20K+ back in your pocket.</strong>
                </p>
              </div>
              
              {/* Progressive Card Stack */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative">
                  <Card className="bg-white border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Seller Pays Commission</h4>
                      <p className="text-gray-600 text-sm mb-2">e.g., $15,000</p>
                      <p className="text-xs text-gray-500">Typical 2.5% on $600K home</p>
                    </CardContent>
                  </Card>
                  {/* Arrow for desktop */}
                  <div className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Card className="bg-white border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">FirstLook Facilitates</h4>
                      <p className="text-gray-600 text-sm mb-2">We collect & process</p>
                      <p className="text-xs text-gray-500">Acting as your agent of record</p>
                    </CardContent>
                  </Card>
                  {/* Arrow for desktop */}
                  <div className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-800 mb-2">You Get Back</h4>
                      <p className="text-green-700 text-lg font-bold mb-2">$13,500</p>
                      <p className="text-xs text-green-600">90% rebate to you</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Legal Clarity Tooltip */}
              <div className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Info className="w-4 h-4 mr-2" />
                        Why can't buyers collect this directly?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4">
                      <p className="text-sm">
                        Due to real estate laws, commissions can only be paid to licensed agents. 
                        We act as your agent of record, then rebate the money back to you.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rebate Calculator Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold">
              🔁 Estimate Your Rebate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-gray-600 mt-3 text-sm">
              Instantly see how much you could save on your next home
            </p>
          </div>
          
          <SavingsCalculator />
        </div>
      </div>
    </div>
  );
};

export default CommissionExplainer;
