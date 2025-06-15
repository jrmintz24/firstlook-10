
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BuyerFeedbackModal from "@/components/post-showing/BuyerFeedbackModal";
import AgentFeedbackModal from "@/components/post-showing/AgentFeedbackModal";

interface ShowingCheckoutButtonProps {
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    user_id?: string;
    status: string;
  };
  userType: 'buyer' | 'agent';
  onComplete?: () => void;
}

const ShowingCheckoutButton = ({ showing, userType, onComplete }: ShowingCheckoutButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  // Only show for active showings
  if (!['confirmed', 'scheduled'].includes(showing.status)) {
    return null;
  }

  const handleCheckout = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button
        onClick={handleCheckout}
        variant="outline"
        size="sm"
        className="border-green-200 text-green-700 hover:bg-green-50"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Complete Showing
      </Button>

      {userType === 'buyer' && (
        <BuyerFeedbackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onComplete={onComplete}
          showing={showing}
          buyerId={user?.id || ""}
        />
      )}

      {userType === 'agent' && (
        <AgentFeedbackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onComplete={onComplete}
          showing={showing}
          agentId={user?.id || ""}
        />
      )}
    </>
  );
};

export default ShowingCheckoutButton;
