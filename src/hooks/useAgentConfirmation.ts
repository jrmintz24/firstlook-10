
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationData {
  requestId: string;
  confirmedDate: string;
  confirmedTime: string;
  agentMessage: string;
  alternativeDate1?: string;
  alternativeTime1?: string;
  alternativeDate2?: string;
  alternativeTime2?: string;
  timeChangeReason?: string;
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
      
      // Create agent notes combining message and time change reason
      let agentNotes = data.agentMessage || '';
      if (data.timeChangeReason) {
        agentNotes = agentNotes ? `${agentNotes}\n\nTime Change Reason: ${data.timeChangeReason}` : `Time Change Reason: ${data.timeChangeReason}`;
      }
      
      // Add alternative times if provided
      if (data.alternativeDate1 && data.alternativeTime1) {
        agentNotes += `\n\nAlternative Time 1: ${data.alternativeDate1} at ${data.alternativeTime1}`;
      }
      if (data.alternativeDate2 && data.alternativeTime2) {
        agentNotes += `\n\nAlternative Time 2: ${data.alternativeDate2} at ${data.alternativeTime2}`;
      }

      // Update the showing request with agent assignment and confirmed details
      const updateData = {
        assigned_agent_id: agent.id,
        assigned_agent_name: `${agent.first_name} ${agent.last_name}`,
        assigned_agent_phone: agent.phone,
        preferred_date: data.confirmedDate,
        preferred_time: data.confirmedTime,
        status: 'agent_confirmed',
        status_updated_at: new Date().toISOString(),
        internal_notes: agentNotes || null
      };

      console.log('Update data:', updateData);

      const { error: updateError } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', data.requestId);

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
