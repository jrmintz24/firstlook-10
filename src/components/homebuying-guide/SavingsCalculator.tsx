
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";

export const SavingsCalculator = () => {
  const [homePrice, setHomePrice] = useState([500000]);
  
  const calculateSavings = (price: number) => {
    const buyerAgentCommission = price * 0.03; // 3% typical buyer's agent commission
    const traditionalClosingCosts = price * 0.025; // 2.5% closing costs
    const firstLookSavings = buyerAgentCommission * 0.8; // Save ~80% of agent commission
    
    return {
      agentCommission: buyerAgentCommission,
      potentialSavings: firstLookSavings,
      totalSavings: firstLookSavings
    };
  };

  const savings = calculateSavings(homePrice[0]);

  return (
    <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Calculate Your Savings</h3>
            <p className="text-gray-600">See how much you could save with FirstLook</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Home Price</label>
              <span className="text-lg font-bold text-gray-900">
                ${homePrice[0].toLocaleString()}
              </span>
            </div>
            <Slider
              value={homePrice}
              onValueChange={setHomePrice}
              max={1000000}
              min={200000}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$200k</span>
              <span>$1M</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Traditional Agent Cost</div>
              <div className="text-2xl font-bold text-red-600">
                ${Math.round(savings.agentCommission).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Your FirstLook Savings</div>
              <div className="text-2xl font-bold text-green-600">
                ${Math.round(savings.potentialSavings).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Estimated Savings</div>
            <div className="text-3xl font-bold text-green-600">
              ${Math.round(savings.totalSavings).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              *Based on typical 3% buyer's agent commission
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
