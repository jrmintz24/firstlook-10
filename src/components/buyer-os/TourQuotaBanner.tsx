
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TourQuotaBannerProps {
  used: number;
  limit: number;
  planTier: string;
}

const TourQuotaBanner = ({ used, limit, planTier }: TourQuotaBannerProps) => {
  if (used < limit) {
    return null; // Don't show banner if user hasn't exceeded quota
  }

  const getPlanName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Basic';
      case 'pro': return 'Pro';
      case 'premium': return 'Premium';
      default: return 'Basic';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Alert className="border-orange-200 bg-orange-50 shadow-lg">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                You've used your {limit} tours this month
              </p>
              <p className="text-sm">
                Upgrade your {getPlanName(planTier)} plan for more access
              </p>
            </div>
            <Link to="/subscriptions">
              <Button size="sm" className="ml-4 bg-orange-600 hover:bg-orange-700 text-white">
                Upgrade
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TourQuotaBanner;
