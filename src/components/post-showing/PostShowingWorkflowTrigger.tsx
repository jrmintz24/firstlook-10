
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostShowingWorkflowTriggerProps {
  showingId: string;
  showingStatus: string;
  onWorkflowTriggered?: () => void;
}

const PostShowingWorkflowTrigger = ({
  showingId,
  showingStatus,
  onWorkflowTriggered
}: PostShowingWorkflowTriggerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const triggerPostShowingWorkflow = async () => {
      // Only trigger for completed showings
      if (showingStatus !== 'completed') return;

      try {
        console.log('Triggering post-showing workflow for:', showingId);

        // Call the edge function to trigger the workflow
        const { data, error } = await supabase.functions.invoke('post-showing-workflow', {
          body: {
            action: 'trigger_workflow',
            showing_request_id: showingId
          }
        });

        if (error) {
          console.error('Error triggering post-showing workflow:', error);
          return;
        }

        console.log('Post-showing workflow triggered successfully:', data);

        if (onWorkflowTriggered) {
          onWorkflowTriggered();
        }

        // Show success message to user
        toast({
          title: "Tour Complete!",
          description: "Thanks for touring! Let us know what you'd like to do next.",
        });

      } catch (error) {
        console.error('Error in post-showing workflow trigger:', error);
      }
    };

    triggerPostShowingWorkflow();
  }, [showingId, showingStatus, onWorkflowTriggered, toast]);

  // This component doesn't render anything - it's just for triggering the workflow
  return null;
};

export default PostShowingWorkflowTrigger;
