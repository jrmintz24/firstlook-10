
import React, { useState } from 'react';
import MakeOfferModal from '@/components/dashboard/MakeOfferModal';
import FavoritePropertyModal from '@/components/post-showing/FavoritePropertyModal';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';
import { useEnhancedPostShowingActions } from '@/hooks/useEnhancedPostShowingActions';
import { PropertyData } from '@/utils/propertyDataUtils';
import { useBuyerAuth } from '@/hooks/useBuyerAuth';
import { useToast } from '@/hooks/use-toast';

interface PropertyActionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'tour' | 'offer' | 'favorite' | 'info' | null;
  property: PropertyData | null;
}

const PropertyActionManager: React.FC<PropertyActionManagerProps> = ({
  isOpen,
  onClose,
  actionType,
  property,
}) => {
  const { isSubmitting, favoriteProperty } = useEnhancedPostShowingActions();
  const { currentUser, loading: authLoading } = useBuyerAuth();
  const { toast } = useToast();


  const handleMakeOffer = () => {
    // The MakeOfferModal will handle its own submission
    // onClose will be called by the modal itself
  };

  const handleFavorite = async (notes?: string) => {
    if (!property) return;
    
    // Check if user is authenticated
    if (!currentUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to favorite properties.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    console.log('[PropertyActionManager] Favoriting property for user:', currentUser.id);
    
    try {
      await favoriteProperty({
        showingId: null, // No showing required for direct property favoriting
        buyerId: currentUser.id,
        propertyAddress: property.address,
      }, notes);
      
      onClose();
    } catch (error) {
      console.error('[PropertyActionManager] Error in handleFavorite:', error);
      // Error handling is already done in the favoriteProperty hook
    }
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
