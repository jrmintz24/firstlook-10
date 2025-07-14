
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Heart } from 'lucide-react';

interface PropertyFloatingActionsProps {
  onTourClick: () => void;
  onOfferClick: () => void;
  onFavoriteClick: () => void;
  className?: string;
}

const PropertyFloatingActions: React.FC<PropertyFloatingActionsProps> = ({
  onTourClick,
  onOfferClick,
  onFavoriteClick,
  className = ""
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        size="sm"
        onClick={onTourClick}
        className="bg-black hover:bg-gray-800 text-white"
      >
        <Calendar className="h-3 w-3 mr-1" />
        Tour
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onOfferClick}
        className="border-black text-black hover:bg-black hover:text-white"
      >
        <DollarSign className="h-3 w-3 mr-1" />
        Offer
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onFavoriteClick}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Heart className="h-3 w-3 mr-1" />
        Save
      </Button>
    </div>
  );
};

export default PropertyFloatingActions;
