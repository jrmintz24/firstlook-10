
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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

      // For buyers, show the feedback modal which will handle the complete flow
      if (userType === 'buyer') {
        setShowFeedbackModal(true);
      } else {
        // For agents, just mark as completed directly
        setIsCheckedOut(true);
        
        if (onCheckout) {
          onCheckout();
        }

        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 1000);
        }

        toast({
          title: "Tour Completed",
          description: "Tour marked as completed.",
        });
      }
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
    setIsCheckedOut(true);
    
    // Trigger dashboard refresh after post-showing actions are completed
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  // Don't render if this showing shouldn't have a checkout button
  if (!shouldShowCheckoutButton) {
    return null;
  }

  if (isCheckedOut) {
    return (
      <Button
        disabled
        className="w-full bg-green-600 hover:bg-green-600 text-white"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Tour Completed
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleCheckout}
        className="w-full bg-black hover:bg-gray-800 text-white border border-gray-300"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Complete Tour
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
            propertyAddress={showing.property_address}
            agentId={showing.assigned_agent_id}
            agentName={showing.assigned_agent_name}
            buyerId={currentUserId || buyerId || ''}
            showingRequestId={showing.id}
            onActionTaken={handleNextStepsComplete}
          />
        </>
      )}
    </>
  );
};

export default ShowingCheckoutButton;
