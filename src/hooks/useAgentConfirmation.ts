
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

      // Get showing request details for email notifications
      const { data: showingRequest, error: fetchError } = await supabase
        .from('showing_requests')
        .select(`
          *,
          profiles!showing_requests_user_id_fkey (
            first_name,
            last_name,
            phone
          )
        `)
        .eq('id', data.requestId)
        .single();

      if (!fetchError && showingRequest) {
        // Send confirmation email to agent (let Edge Function fetch buyer email)
        try {
          const { error: agentEmailError } = await supabase.functions.invoke('send-showing-confirmation-agent', {
            body: {
              agentName: `${agent.first_name} ${agent.last_name}`,
              agentEmail: showingRequest.assigned_agent_email || `${agent.first_name.toLowerCase()}.${agent.last_name.toLowerCase()}@firstlookhometours.com`,
              buyerId: showingRequest.user_id, // Let Edge Function fetch email
              buyerName: `${showingRequest.profiles.first_name} ${showingRequest.profiles.last_name}`,
              buyerPhone: showingRequest.profiles.phone,
              propertyAddress: showingRequest.property_address,
              showingDate: data.confirmedDate,
              showingTime: data.confirmedTime,
              showingInstructions: data.agentMessage,
              requestId: data.requestId
            }
          });

          if (agentEmailError) {
            console.error('Failed to send agent confirmation email:', agentEmailError);
          } else {
            console.log('Agent confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending agent confirmation email:', emailError);
        }

        // Send confirmation email to buyer (let Edge Function fetch buyer email)
        try {
          const { error: buyerEmailError } = await supabase.functions.invoke('send-showing-confirmation-buyer', {
            body: {
              buyerId: showingRequest.user_id, // Let Edge Function fetch email
              buyerName: `${showingRequest.profiles.first_name} ${showingRequest.profiles.last_name}`,
              agentName: `${agent.first_name} ${agent.last_name}`,
              agentEmail: showingRequest.assigned_agent_email || `${agent.first_name.toLowerCase()}.${agent.last_name.toLowerCase()}@firstlookhometours.com`,
              agentPhone: agent.phone,
              propertyAddress: showingRequest.property_address,
              showingDate: data.confirmedDate,
              showingTime: data.confirmedTime,
              meetingLocation: "Meet at the property",
              showingInstructions: data.agentMessage,
              requestId: data.requestId
            }
          });

          if (buyerEmailError) {
            console.error('Failed to send buyer confirmation email:', buyerEmailError);
          } else {
            console.log('Buyer confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending buyer confirmation email:', emailError);
        }
      }
      
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
