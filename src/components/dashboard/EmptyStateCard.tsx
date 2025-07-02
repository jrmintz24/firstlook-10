
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const EmptyStateCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}: EmptyStateCardProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {buttonText && onButtonClick && (
          <Button 
            onClick={onButtonClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
