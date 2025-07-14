
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import FavoritePropertyModal from "../post-showing/FavoritePropertyModal";
import MakeOfferModal from "../dashboard/MakeOfferModal";
import OfferTypeDialog from "../post-showing/OfferTypeDialog";

interface PropertyData {
  id?: string;
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

interface PropertyActionManagerProps {
  property: PropertyData;
  agentName?: string;
  onClose?: () => void;
}

const PropertyActionManager: React.FC<PropertyActionManagerProps> = ({
  property,
  agentName,
  onClose
}) => {
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOfferTypeDialog, setShowOfferTypeDialog] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const { toast } = useToast();

  const handleSaveFavorite = async (notes?: string) => {
    setIsSavingFavorite(true);
    try {
      // Simulate saving favorite - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Property Saved",
        description: "Property has been added to your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property to favorites.",
        variant: "destructive"
      });
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleScheduleTour = () => {
    toast({
      title: "Tour Scheduling",
      description: "Tour scheduling feature coming soon!",
    });
  };

  const handleMakeOffer = () => {
    if (agentName) {
      setShowOfferTypeDialog(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleAgentAssisted = () => {
    toast({
      title: "Agent Consultation",
      description: "Connecting you with your agent for offer assistance.",
    });
    setShowOfferTypeDialog(false);
  };

  const handleFirstLookGenerator = () => {
    setShowOfferTypeDialog(false);
    setShowOfferModal(true);
  };

  return (
    <>
      {/* Favorite Property Modal */}
      <FavoritePropertyModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={handleSaveFavorite}
        propertyAddress={property.address}
        isSubmitting={isSavingFavorite}
      />

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyAddress={property.address}
      />

      {/* Offer Type Dialog */}
      <OfferTypeDialog
        isOpen={showOfferTypeDialog}
        onClose={() => setShowOfferTypeDialog(false)}
        onSelectAgentAssisted={handleAgentAssisted}
        onSelectFirstLookGenerator={handleFirstLookGenerator}
        agentName={agentName}
        propertyAddress={property.address}
      />
    </>
  );
};

export default PropertyActionManager;
