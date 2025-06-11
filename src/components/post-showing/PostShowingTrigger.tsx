
import { useEffect } from "react";
import { usePostShowingWorkflow } from "@/hooks/usePostShowingWorkflow";

interface PostShowingTriggerProps {
  showingId: string;
  status: string;
  preferredDate?: string;
  preferredTime?: string;
}

const PostShowingTrigger = ({ showingId, status, preferredDate, preferredTime }: PostShowingTriggerProps) => {
  const { scheduleWorkflowTriggers } = usePostShowingWorkflow();

  useEffect(() => {
    // Schedule workflow triggers when showing is confirmed
    if (status === 'confirmed' && preferredDate && preferredTime) {
      const scheduledDateTime = new Date(`${preferredDate}T${preferredTime}`);
      // Add 1 hour for typical showing duration
      scheduledDateTime.setHours(scheduledDateTime.getHours() + 1);
      
      scheduleWorkflowTriggers(showingId, scheduledDateTime.toISOString())
        .catch(console.error);
    }
  }, [showingId, status, preferredDate, preferredTime, scheduleWorkflowTriggers]);

  // This component doesn't render anything visible
  return null;
};

export default PostShowingTrigger;
