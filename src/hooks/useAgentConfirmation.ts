
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
    console.log('=== CONFIRMING SHOWING ===');
    console.log('Data:', data);
    console.log('Agent:', agent);
    
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
      console.log('Fetching showing request details for email...');
      const { data: showingRequest, error: fetchError } = await supabase
        .from('showing_requests')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            phone
          )
        `)
        .eq('id', data.requestId)
        .single();

      console.log('Fetch result:', { showingRequest, fetchError });
      console.log('Showing request data structure:', showingRequest);
      console.log('Profiles data:', showingRequest?.profiles);

      // Check if we have valid data before sending emails
      if (showingRequest && showingRequest.profiles) {
        console.log('Valid showing request data found, proceeding with emails...');
        const requestData = showingRequest;
        // Send confirmation email to agent (use test email for development)
        console.log('Attempting to send agent confirmation email...');
        try {
          const agentEmailPayload = {
            agentName: `${agent.first_name} ${agent.last_name}`,
            agentEmail: 'firstlookhometourstest@gmail.com', // Use test email for now
            buyerId: requestData.user_id, // Let Edge Function fetch email
            buyerName: `${requestData.profiles.first_name} ${requestData.profiles.last_name}`,
            buyerPhone: requestData.profiles.phone,
            propertyAddress: requestData.property_address,
            showingDate: data.confirmedDate,
            showingTime: data.confirmedTime,
            showingInstructions: data.agentMessage,
            requestId: data.requestId
          };

          console.log('Agent email payload:', agentEmailPayload);

          const { data: agentEmailResponse, error: agentEmailError } = await supabase.functions.invoke('send-showing-confirmation-agent', {
            body: agentEmailPayload
          });

          if (agentEmailError) {
            console.error('Failed to send agent confirmation email:', agentEmailError);
          } else {
            console.log('Agent confirmation email sent successfully:', agentEmailResponse);
          }
        } catch (emailError) {
          console.error('Exception sending agent confirmation email:', emailError);
        }

        // Send confirmation email to buyer (let Edge Function fetch buyer email)
        console.log('Attempting to send buyer confirmation email...');
        try {
          const buyerEmailPayload = {
            buyerId: requestData.user_id,
            buyerName: `${requestData.profiles.first_name} ${requestData.profiles.last_name}`,
            agentName: `${agent.first_name} ${agent.last_name}`,
            agentEmail: 'firstlookhometourstest@gmail.com', // Use test email for now
            agentPhone: agent.phone,
            propertyAddress: requestData.property_address,
            showingDate: data.confirmedDate,
            showingTime: data.confirmedTime,
            meetingLocation: "Meet at the property",
            showingInstructions: data.agentMessage,
            requestId: data.requestId
          };

          console.log('Buyer email payload:', buyerEmailPayload);

          const { data: buyerEmailResponse, error: buyerEmailError } = await supabase.functions.invoke('send-showing-confirmation-buyer', {
            body: buyerEmailPayload
          });

          if (buyerEmailError) {
            console.error('Failed to send buyer confirmation email:', buyerEmailError);
            // Don't fail the entire process if email fails, just log the error
          } else {
            console.log('Buyer confirmation email sent successfully:', buyerEmailResponse);
          }
        } catch (emailError) {
          console.error('Exception sending buyer confirmation email:', emailError);
          // Don't fail the entire process if email fails
        }
      } else {
        console.error('Failed to fetch showing request details or missing profile data');
        console.error('Fetch error:', fetchError);
        console.error('Showing request data:', showingRequest);
        
        // Even if we couldn't fetch details, still show success message since the tour was confirmed
        toast({
          title: "Tour Accepted!",
          description: "Tour confirmed, but there may have been an issue sending notification emails.",
        });
        return true;
      }
      
      toast({
        title: "Tour Accepted!",
        description: "You have successfully accepted this showing request. The buyer has been notified and must sign the agreement.",
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
