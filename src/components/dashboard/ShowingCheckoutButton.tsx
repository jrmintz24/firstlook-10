
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PostShowingNextStepsModal from "@/components/post-showing/PostShowingNextStepsModal";

interface ShowingCheckoutButtonProps {
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    assigned_agent_email?: string;
    assigned_agent_phone?: string;
    user_id?: string;
    status: string;
  };
  userType: 'buyer' | 'agent';
  onComplete?: () => void;
}

const ShowingCheckoutButton = ({ showing, userType, onComplete }: ShowingCheckoutButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Only show for buyers with active showings
  if (userType !== 'buyer' || !['confirmed', 'scheduled'].includes(showing.status)) {
    return null;
  }

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleComplete = async () => {
    try {
      // Update the showing status to completed
      const { error } = await supabase
        .from('showing_requests')
        .update({ 
          status: 'completed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showing.id);

      if (error) {
        console.error('Error updating showing status:', error);
        toast({
          title: "Error",
          description: "Failed to complete showing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Tour Completed",
        description: "The showing has been marked as completed. Choose your next steps!",
      });

      // Call the onComplete callback to refresh data
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Complete the showing when modal closes
    handleComplete();
  };

  return (
    <>
      <Button
        onClick={handleCheckout}
        variant="outline"
        size="sm"
        className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg font-medium"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Complete Showing
      </Button>

      <PostShowingNextStepsModal
        isOpen={showModal}
        onClose={handleModalClose}
        showing={showing}
        buyerId={user?.id || ""}
      />
    </>
  );
};

export default ShowingCheckoutButton;
