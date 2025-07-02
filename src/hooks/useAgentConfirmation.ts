
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationData {
  showingId: string;
  estimatedDate: string;
  agentNotes?: string;
}

interface AgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export const useAgentConfirmation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const confirmShowing = async (data: ConfirmationData, agent: AgentProfile) => {
    setIsLoading(true);
    
    try {
      console.log('Confirming showing:', data);
      
      // Update the showing request with agent assignment and move to confirmed status
      const { error: updateError } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agent.id,
          assigned_agent_name: `${agent.first_name} ${agent.last_name}`,
          assigned_agent_phone: agent.phone,
          status: 'agent_confirmed',
          status_updated_at: new Date().toISOString(),
          estimated_confirmation_date: data.estimatedDate,
          internal_notes: data.agentNotes || null
        })
        .eq('id', data.showingId);

      if (updateError) {
        console.error('Error updating showing request:', updateError);
        toast({
          title: "Error",
          description: "Failed to accept the showing request. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Showing request updated successfully');
      
      toast({
        title: "Tour Accepted!",
        description: "You have successfully accepted this showing request. The buyer will be notified.",
      });
      
      return true;
    } catch (error) {
      console.error('Exception in confirmShowing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    confirmShowing,
    isLoading
  };
};
