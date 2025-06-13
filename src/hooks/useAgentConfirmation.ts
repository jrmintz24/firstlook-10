
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgentConfirmationData {
  requestId: string;
  confirmedDate: string;
  confirmedTime: string;
  agentMessage: string;
  alternativeDate1?: string;
  alternativeTime1?: string;
  alternativeDate2?: string;
  alternativeTime2?: string;
}

export const useAgentConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const confirmShowing = async (confirmationData: AgentConfirmationData, agentProfile: any) => {
    setLoading(true);
    try {
      // Prepare the confirmation details
      const confirmationDetails = {
        confirmed_date: confirmationData.confirmedDate,
        confirmed_time: confirmationData.confirmedTime,
        agent_message: confirmationData.agentMessage,
        alternatives: []
      };

      // Add alternatives if provided
      if (confirmationData.alternativeDate1 && confirmationData.alternativeTime1) {
        confirmationDetails.alternatives.push({
          date: confirmationData.alternativeDate1,
          time: confirmationData.alternativeTime1
        });
      }

      if (confirmationData.alternativeDate2 && confirmationData.alternativeTime2) {
        confirmationDetails.alternatives.push({
          date: confirmationData.alternativeDate2,
          time: confirmationData.alternativeTime2
        });
      }

      // Update the showing request with confirmation details
      const { error: updateError } = await supabase
        .from('showing_requests')
        .update({
          status: 'agent_confirmed',
          preferred_date: confirmationData.confirmedDate,
          preferred_time: confirmationData.confirmedTime,
          assigned_agent_id: agentProfile.id,
          assigned_agent_name: `${agentProfile.first_name} ${agentProfile.last_name}`,
          assigned_agent_phone: agentProfile.phone,
          assigned_agent_email: agentProfile.email || agentProfile.id,
          internal_notes: JSON.stringify({
            agent_confirmation: confirmationDetails,
            original_notes: ''
          }),
          status_updated_at: new Date().toISOString()
        })
        .eq('id', confirmationData.requestId);

      if (updateError) {
        throw updateError;
      }

      // Create a message record for the agent-buyer communication
      if (confirmationData.agentMessage) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            showing_request_id: confirmationData.requestId,
            sender_id: agentProfile.id,
            content: confirmationData.agentMessage,
          });

        if (messageError) {
          console.error('Error creating message:', messageError);
          // Don't fail the whole operation for message creation error
        }
      }

      toast({
        title: "Showing Confirmed! 🎉",
        description: "Your confirmation has been sent to the buyer. They'll receive your message and schedule details.",
      });

      return true;
    } catch (error) {
      console.error('Error confirming showing:', error);
      toast({
        title: "Error",
        description: "Failed to confirm showing. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmShowing,
    loading
  };
};
