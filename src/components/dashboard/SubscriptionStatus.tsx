
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
          <div className="p-2 rounded-xl bg-purple-50">
            <Crown className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">FirstLook Premium</h3>
            <p className="text-sm text-gray-600">Unlimited tours • VIP priority</p>
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
              <h3 className="font-medium text-gray-900 mb-1">Showing Limit Reached</h3>
              <p className="text-sm text-gray-600 mb-3">
                {eligibility.reason === 'active_showing_exists' 
                  ? "Complete your current showing to book another, or upgrade for unlimited access."
                  : "You've used your free showing. Upgrade for unlimited tours."}
              </p>
              <Button 
                onClick={onUpgradeClick}
                size="sm"
                className="bg-gray-900 hover:bg-black text-white font-medium rounded-lg"
              >
                <Crown className="mr-1 h-3 w-3" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionStatus;
