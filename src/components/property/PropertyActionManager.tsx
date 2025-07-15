
import React, { useState } from 'react';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import { useEnhancedPostShowingActions } from '@/hooks/useEnhancedPostShowingActions';
import { PropertyData } from '@/utils/propertyDataUtils';

interface PropertyActionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'tour' | 'offer' | 'favorite' | 'info' | null;
  property: PropertyData | null;
  buyerId?: string;
}

const PropertyActionManager: React.FC<PropertyActionManagerProps> = ({
  isOpen,
  onClose,
  actionType,
  property,
  buyerId = 'temp-buyer-id' // TODO: Replace with actual buyer ID from auth
}) => {
  const { isSubmitting, favoriteProperty } = useEnhancedPostShowingActions();


  const handleMakeOffer = () => {
    // The MakeOfferModal will handle its own submission
    // onClose will be called by the modal itself
  };

  const handleFavorite = async (notes?: string) => {
    if (!property) return;
    
    await favoriteProperty({
      showingId: 'temp-showing-id', // TODO: Replace with actual showing ID
      buyerId,
      propertyAddress: property.address,
    }, notes);
    
    onClose();
  };

  const handleRequestInfo = () => {
    console.log('Request info for:', property);
    // For now, use the make offer modal as a general contact form
    // TODO: Create a dedicated info request modal
  };

  if (!isOpen || !property) return null;

  switch (actionType) {
    case 'tour':
      return (
        <ModernTourSchedulingModal
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={async () => onClose()}
          initialAddress={property.address}
        />
      );
      
    case 'offer':
      return (
        <MakeOfferModal
          isOpen={isOpen}
          onClose={onClose}
          propertyAddress={property.address}
        />
      );
      
    case 'favorite':
      return (
        <FavoritePropertyModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleFavorite}
          propertyAddress={property.address}
          isSubmitting={isSubmitting}
        />
      );

    case 'info':
      // For now, use the make offer modal as a general contact form
      return (
        <MakeOfferModal
          isOpen={isOpen}
          onClose={onClose}
          propertyAddress={property.address}
        />
      );
      
    default:
      return null;
  }
};

export default PropertyActionManager;
