
import { Crown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionStatusProps {
  isSubscribed: boolean;
  eligibility: any;
  onUpgradeClick: () => void;
}

const SubscriptionStatus = ({ isSubscribed, eligibility, onUpgradeClick }: SubscriptionStatusProps) => {
  if (isSubscribed) {
    return (
      <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50">
            <Crown className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">FirstLook Pro</h3>
            <p className="text-sm text-gray-600">Unlimited tours • Same-day booking • DIY Offer Tool</p>
          </div>
        </div>
      </div>
    );
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-50 mt-1">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Tour Limit Reached</h3>
              <p className="text-sm text-gray-600 mb-3">
                {eligibility.reason === 'monthly_limit_exceeded' 
                  ? `You've used all 5 tours this month. Upgrade for unlimited access.`
                  : "Upgrade for unlimited tours and same-day booking."}
              </p>
              <Button 
                onClick={onUpgradeClick}
                size="sm"
                className="bg-gray-900 hover:bg-black text-white font-medium rounded-lg"
              >
                <Crown className="mr-1 h-3 w-3" />
                Upgrade to Pro - $29/month
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show available tours for free users
  if (eligibility && eligibility.eligible && eligibility.tours_remaining !== undefined) {
    return (
      <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Free Plan</h3>
            <p className="text-sm text-gray-600">
              {eligibility.tours_remaining} of 5 tours remaining this month
            </p>
          </div>
          <Button 
            onClick={onUpgradeClick}
            size="sm"
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Crown className="mr-1 h-3 w-3" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionStatus;
