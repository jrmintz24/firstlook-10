
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import EnhancedOfferManagementDashboard from "@/components/offer-management/EnhancedOfferManagementDashboard";
import { useNavigate } from "react-router-dom";

const MyOffers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateOffer = () => {
    navigate('/offer-questionnaire');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedOfferManagementDashboard 
          buyerId={user.id}
          onCreateOffer={handleCreateOffer}
        />
      </div>
    </div>
  );
};

export default MyOffers;
