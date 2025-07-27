
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import OfferManagementDashboard from "@/components/offer-management/OfferManagementDashboard";
import EnhancedOfferModal from "@/components/offer-workflow/EnhancedOfferModal";

const MyOffers = () => {
  const { user } = useAuth();
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleCreateOffer = () => {
    setShowOfferModal(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OfferManagementDashboard 
          buyerId={user.id}
          onCreateOffer={handleCreateOffer}
        />
        
        <EnhancedOfferModal
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          propertyAddress=""
          buyerId={user.id}
        />
      </div>
    </div>
  );
};

export default MyOffers;
