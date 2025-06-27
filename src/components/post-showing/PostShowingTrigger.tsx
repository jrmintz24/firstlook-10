
import { useEffect, useRef } from "react";
import { usePostShowingWorkflow } from "@/hooks/usePostShowingWorkflow";

interface PostShowingTriggerProps {
  showingId: string;
  status: string;
  preferredDate?: string;
  preferredTime?: string;
}

const PostShowingTrigger = ({ showingId, status, preferredDate, preferredTime }: PostShowingTriggerProps) => {
  const { scheduleWorkflowTriggers } = usePostShowingWorkflow();
  const hasScheduledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only schedule once per showing and only when status is confirmed
    if (status === 'confirmed' && preferredDate && preferredTime) {
      const scheduleKey = `${showingId}-${status}`;
      
      // Prevent duplicate scheduling
      if (hasScheduledRef.current.has(scheduleKey)) {
        return;
      }

      hasScheduledRef.current.add(scheduleKey);

      const scheduledDateTime = new Date(`${preferredDate}T${preferredTime}`);
      // Add 1 hour for typical showing duration
      scheduledDateTime.setHours(scheduledDateTime.getHours() + 1);
      
      console.log('Scheduling workflow triggers for showing:', showingId);
      
      scheduleWorkflowTriggers(showingId, scheduledDateTime.toISOString())
        .then(() => {
          console.log('Workflow triggers scheduled successfully for:', showingId);
        })
        .catch((error) => {
          console.error('Failed to schedule workflow triggers:', error);
          // Remove from scheduled set on error so it can be retried
          hasScheduledRef.current.delete(scheduleKey);
        });
    }
  }, [showingId, status, preferredDate, preferredTime, scheduleWorkflowTriggers]);

  // This component doesn't render anything visible
  return null;
};

export default PostShowingTrigger;
