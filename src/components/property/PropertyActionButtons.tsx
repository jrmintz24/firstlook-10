
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Heart } from "lucide-react";
import { PropertyData } from "@/utils/idxCommunication";

interface PropertyActionButtonsProps {
  property: PropertyData | any;
  onScheduleTour: (property: PropertyData | any) => void;
  onMakeOffer: (property: PropertyData | any) => void;
  onFavorite: (property: PropertyData | any) => void;
  isFavorited?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  layout?: "horizontal" | "vertical";
}

const PropertyActionButtons: React.FC<PropertyActionButtonsProps> = ({
  property,
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  isFavorited = false,
  className = "",
  size = "default",
  layout = "horizontal"
}) => {
  const buttonClass = layout === "vertical" ? "w-full" : "flex-1";
  const containerClass = layout === "vertical" ? "flex flex-col gap-2" : "flex gap-2";

  return (
    <div className={`${containerClass} ${className}`}>
      <Button 
        size={size}
        className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
        onClick={() => onScheduleTour(property)}
      >
        <Calendar className="h-4 w-4 mr-1" />
        Schedule Tour
      </Button>
      
      <Button 
        size={size}
        variant="outline"
        className={buttonClass}
        onClick={() => onMakeOffer(property)}
      >
        <DollarSign className="h-4 w-4 mr-1" />
        Make Offer
      </Button>
      
      <Button 
        size={size}
        variant="outline"
        className={`${buttonClass} ${isFavorited ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
        onClick={() => onFavorite(property)}
      >
        <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
        {isFavorited ? 'Favorited' : 'Favorite'}
      </Button>
    </div>
  );
};

export default PropertyActionButtons;
