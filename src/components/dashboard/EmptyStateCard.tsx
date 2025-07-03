
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
  eligibility?: {
    eligible: boolean;
    reason: string;
  };
}

const EmptyStateCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  showUpgradeButton = false,
  onUpgradeClick,
  eligibility
}: EmptyStateCardProps) => {
  
  // Determine which button to show based on eligibility
  const shouldShowUpgrade = showUpgradeButton && eligibility && !eligibility.eligible && 
    (eligibility.reason === 'monthly_limit_exceeded' || eligibility.reason === 'limit_exceeded');

  const handleButtonClick = () => {
    if (shouldShowUpgrade && onUpgradeClick) {
      onUpgradeClick();
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  const displayButtonText = shouldShowUpgrade ? "Upgrade to Pro" : buttonText;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {displayButtonText && (handleButtonClick || onButtonClick) && (
          <Button 
            onClick={handleButtonClick}
            className={shouldShowUpgrade 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }
          >
            {displayButtonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
