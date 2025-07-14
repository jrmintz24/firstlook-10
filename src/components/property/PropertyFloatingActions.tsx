
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Calendar, DollarSign } from "lucide-react";

interface PropertyFloatingActionsProps {
  onScheduleTour: () => void;
  onMakeOffer: () => void;
  onFavorite: () => void;
  isFavorited?: boolean;
  className?: string;
}

const PropertyFloatingActions: React.FC<PropertyFloatingActionsProps> = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  isFavorited = false,
  className = ""
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-sm"
        onClick={onFavorite}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
      </Button>
      
      <Button 
        size="sm"
        className="bg-black text-white hover:bg-gray-800 shadow-sm"
        onClick={onScheduleTour}
      >
        <Calendar className="h-4 w-4 mr-1" />
        Tour
      </Button>
      
      <Button 
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-black text-black hover:bg-black hover:text-white shadow-sm"
        onClick={onMakeOffer}
      >
        <DollarSign className="h-4 w-4 mr-1" />
        Offer
      </Button>
    </div>
  );
};

export default PropertyFloatingActions;
