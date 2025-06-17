
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
}

export const useRescheduleShowing = (onRescheduleComplete?: () => void) => {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedShowingForReschedule, setSelectedShowingForReschedule] = useState<ShowingRequest | null>(null);
  const { toast } = useToast();

  const handleRescheduleShowing = (showing: ShowingRequest) => {
    console.log('Opening reschedule modal for showing:', showing.id);
    
    // Check if showing can be rescheduled
    const rescheduleableStatuses = ['pending', 'submitted', 'under_review', 'agent_assigned', 'confirmed'];
    
    if (!rescheduleableStatuses.includes(showing.status)) {
      toast({
        title: "Cannot Reschedule",
        description: "This showing cannot be rescheduled in its current status.",
        variant: "destructive"
      });
      return;
    }

    setSelectedShowingForReschedule(showing);
    setShowRescheduleModal(true);
  };

  const handleRescheduleModalClose = () => {
    setShowRescheduleModal(false);
    setSelectedShowingForReschedule(null);
  };

  const handleRescheduleComplete = () => {
    console.log('Reschedule completed, refreshing data...');
    if (onRescheduleComplete) {
      onRescheduleComplete();
    }
  };

  return {
    showRescheduleModal,
    selectedShowingForReschedule,
    handleRescheduleShowing,
    handleRescheduleModalClose,
    handleRescheduleComplete
  };
};
