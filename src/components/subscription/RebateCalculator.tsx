
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";

export const RebateCalculator = () => {
  const [homePrice, setHomePrice] = useState([400000]);
  
  const calculateRebate = (price: number) => {
    const buyerAgentCommission = price * 0.025; // 2.5% typical buyer's agent commission
    const firstLookKeeps = buyerAgentCommission * 0.10; // FirstLook keeps 10%
    const youGetBack = buyerAgentCommission * 0.90; // You get 90% back
    
    return {
      commission: buyerAgentCommission,
      firstLookKeeps,
      youGetBack
    };
  };

  const rebate = calculateRebate(homePrice[0]);

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 rounded-3xl overflow-hidden">
      <CardContent className="p-10 sm:p-12">
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-3xl p-8 border border-blue-100/50 backdrop-blur-sm shadow-lg">
          <h4 className="font-semibold text-blue-800 mb-8 text-center text-xl">Interactive Calculator:</h4>
          
          {/* Home Price Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-blue-700 font-medium">Home Price</label>
              <span className="text-2xl font-bold text-blue-900">
                ${homePrice[0].toLocaleString()}
              </span>
            </div>
            <Slider
              value={homePrice}
              onValueChange={setHomePrice}
              max={3000000}
              min={200000}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-blue-600 mt-2">
              <span>$200K</span>
              <span>$3M</span>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="space-y-4 text-blue-700 text-lg font-light">
            <p className="flex justify-between items-center">
              <span>${homePrice[0].toLocaleString()} home × 2.5% buyer agent commission</span>
              <span className="font-semibold">${Math.round(rebate.commission).toLocaleString()}</span>
            </p>
            <p className="flex justify-between items-center">
              <span>FirstLook keeps 10%</span>
              <span className="font-semibold">${Math.round(rebate.firstLookKeeps).toLocaleString()}</span>
            </p>
            <div className="border-t border-blue-200 pt-4">
              <p className="flex justify-between items-center text-2xl font-bold text-blue-800">
                <span>You get back</span>
                <span>${Math.round(rebate.youGetBack).toLocaleString()}</span>
              </p>
            </div>
          </div>
          
          <p className="text-blue-600 mt-8 font-medium text-center text-lg bg-white/60 rounded-2xl py-4 px-6">
            Traditional buyers don't even know they're missing this. You won't.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
