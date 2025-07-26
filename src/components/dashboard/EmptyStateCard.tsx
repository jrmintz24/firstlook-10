
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import FloatingCard from "@/components/ui/FloatingCard";
import DynamicShadowCard from "@/components/ui/DynamicShadowCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

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
    <DynamicShadowCard shadowIntensity={0.15} shadowColor="rgba(147, 51, 234, 0.1)">
      <FloatingCard intensity="subtle" duration={6000}>
        <Card className={cn(
          "text-center py-12 border-gray-200/50 bg-white/80 backdrop-blur-sm",
          "hover:shadow-xl transition-all duration-500"
        )}>
          <CardContent>
            <div className="relative mb-6">
              {/* Background decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
              </div>
              
              {/* Icon with gradient background */}
              <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Icon className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-fade-in">
              {title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              {description}
            </p>
            
            {displayButtonText && (handleButtonClick || onButtonClick) && (
              <MagneticButton
                onClick={handleButtonClick}
                className={cn(
                  "bg-gradient-to-r shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300",
                  shouldShowUpgrade 
                    ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                    : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                )}
                magneticStrength={0.2}
              >
                {displayButtonText}
              </MagneticButton>
            )}
          </CardContent>
        </Card>
      </FloatingCard>
    </DynamicShadowCard>
  );
};

export default EmptyStateCard;
