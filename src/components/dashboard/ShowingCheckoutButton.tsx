
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { usePostShowingWorkflow } from "@/hooks/usePostShowingWorkflow";
import { useToast } from "@/hooks/use-toast";
import BuyerFeedbackModal from "@/components/post-showing/BuyerFeedbackModal";
import PostShowingNextStepsModal from "@/components/post-showing/PostShowingNextStepsModal";
import { supabase } from "@/integrations/supabase/client";

interface ShowingCheckoutButtonProps {
  showingId?: string;
  buyerId?: string;
  onCheckout?: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    assigned_agent_email?: string;
    assigned_agent_phone?: string;
    status?: string;
    preferred_date?: string | null;
    preferred_time?: string | null;
  };
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
}

const ShowingCheckoutButton = ({ 
  showingId, 
  buyerId, 
  onCheckout, 
  showing,
  userType = 'buyer',
  onComplete
}: ShowingCheckoutButtonProps) => {
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNextStepsModal, setShowNextStepsModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { checkAttendance } = usePostShowingWorkflow();
  const { toast } = useToast();

  // Only show checkout button for completed/scheduled showings
  const shouldShowCheckoutButton = showing.status && 
    ['confirmed', 'scheduled', 'in_progress'].includes(showing.status);

  const getCurrentUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || "";
    } catch (error) {
      console.error('Error getting current user:', error);
      return "";
    }
  };

  const handleCheckout = async () => {
    try {
      const actualShowingId = showingId || showing.id;
      
      // Get current user ID if buyerId is not provided
      let effectiveBuyerId = buyerId;
      if (!effectiveBuyerId) {
        effectiveBuyerId = await getCurrentUserId();
      }
      
      if (!effectiveBuyerId) {
        toast({
          title: "Error",
          description: "Unable to identify user. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      setCurrentUserId(effectiveBuyerId);

      await checkAttendance(actualShowingId, {
        user_type: userType,
        attended: true,
        checked_out: true
      });

      setIsCheckedOut(true);
      
      // Only show feedback modal for buyers
      if (userType === 'buyer') {
        setShowFeedbackModal(true);
      }
      
      if (onCheckout) {
        onCheckout();
      }

      if (onComplete) {
        onComplete();
      }

      toast({
        title: "Tour Completed",
        description: userType === 'buyer' 
          ? "Thanks for touring with us! Please share your feedback."
          : "Tour marked as completed.",
      });
    } catch (error) {
      console.error('Error checking out:', error);
      toast({
        title: "Error",
        description: "Failed to complete checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFeedbackComplete = () => {
    setShowFeedbackModal(false);
    setShowNextStepsModal(true);
  };

  const handleNextStepsComplete = () => {
    setShowNextStepsModal(false);
  };

  // Don't render if this showing shouldn't have a checkout button
  if (!shouldShowCheckoutButton) {
    return null;
  }

  if (isCheckedOut) {
    return (
      <>
        <Button
          disabled
          className="w-full bg-green-600 hover:bg-green-600 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Tour Completed
        </Button>

        {userType === 'buyer' && (
          <>
            <BuyerFeedbackModal
              isOpen={showFeedbackModal}
              onClose={() => setShowFeedbackModal(false)}
              onComplete={handleFeedbackComplete}
              showing={showing}
              buyerId={currentUserId || buyerId || ''}
            />

            <PostShowingNextStepsModal
              isOpen={showNextStepsModal}
              onClose={handleNextStepsComplete}
              showing={showing}
              buyerId={currentUserId || buyerId || ''}
            />
          </>
        )}
      </>
    );
  }

  return (
    <Button
      onClick={handleCheckout}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Complete Tour
    </Button>
  );
};

export default ShowingCheckoutButton;
