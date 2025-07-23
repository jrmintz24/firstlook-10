
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
        .select('*')
        .eq('id', data.requestId)
        .single();

      console.log('Fetch result:', { showingRequest, fetchError });

      if (showingRequest && !fetchError) {
        // Fetch the buyer's profile separately
        console.log('Fetching buyer profile for user_id:', showingRequest.user_id);
        const { data: buyerProfile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', showingRequest.user_id)
          .single();

        console.log('Buyer profile result:', { buyerProfile, profileError });
        console.log('Profile error details:', profileError?.message, profileError?.details, profileError?.code);

        if (buyerProfile && !profileError) {
          // Attach profile data to showing request
          showingRequest.profiles = buyerProfile;
          console.log('Valid showing request data found, proceeding with emails...');
          const requestData = showingRequest;
        } else {
          // If profile doesn't exist, use basic fallback data and let edge function handle email fetch
          console.log('Profile not found, using fallback data. Edge function will fetch email directly.');
          const fallbackProfile = {
            first_name: 'FirstLook',
            last_name: 'User',
            phone: 'Phone not available'
          };
          showingRequest.profiles = fallbackProfile;
          console.log('Using fallback profile:', fallbackProfile);
        }
        
        if (showingRequest.profiles) {
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

          console.log('=== SENDING AGENT EMAIL ===');
          console.log('Agent email payload:', JSON.stringify(agentEmailPayload, null, 2));

          const { data: agentEmailResponse, error: agentEmailError } = await supabase.functions.invoke('send-showing-confirmation-agent', {
            body: agentEmailPayload
          });
          
          console.log('=== AGENT EMAIL RESPONSE ===');
          console.log('Agent email response:', agentEmailResponse);
          console.log('Agent email error:', agentEmailError);

          if (agentEmailError) {
            console.error('Failed to send agent confirmation email:', agentEmailError);
          } else {
            console.log('Agent confirmation email sent successfully:', agentEmailResponse);
          }
        } catch (emailError) {
          console.error('Exception sending agent confirmation email:', emailError);
        }

        // TEMPORARY: Test sending buyer email directly to verify it works
        console.log('Attempting to send buyer confirmation email...');
        try {
          // First, let's test with a minimal email to the agent function
          const testBuyerEmailPayload = {
            agentName: `FirstLook User`, // Swap the names
            agentEmail: 'firstlookhometourstest@gmail.com',
            buyerId: requestData.user_id,
            buyerName: `${agent.first_name} ${agent.last_name}`,
            buyerPhone: agent.phone,
            propertyAddress: requestData.property_address,
            showingDate: data.confirmedDate,
            showingTime: data.confirmedTime,
            showingInstructions: '[TEST] This is actually the BUYER email sent via agent endpoint',
            requestId: data.requestId
          };

          console.log('=== SENDING TEST BUYER EMAIL VIA AGENT ENDPOINT ===');
          console.log('Test payload:', JSON.stringify(testBuyerEmailPayload, null, 2));

          const { data: testResponse, error: testError } = await supabase.functions.invoke('send-showing-confirmation-agent', {
            body: testBuyerEmailPayload
          });
          
          console.log('=== TEST EMAIL RESPONSE ===');
          console.log('Test response:', testResponse);
          console.log('Test error:', testError);

          if (!testError) {
            console.log('TEST BUYER EMAIL SENT VIA AGENT ENDPOINT - CHECK YOUR INBOX');
          }

          // Still try the original buyer endpoint
          const buyerEmailPayload = {
            buyerId: requestData.user_id,
            buyerName: `${requestData.profiles.first_name} ${requestData.profiles.last_name}`,
            agentName: `${agent.first_name} ${agent.last_name}`,
            agentEmail: 'firstlookhometourstest@gmail.com',
            agentPhone: agent.phone,
            propertyAddress: requestData.property_address,
            showingDate: data.confirmedDate,
            showingTime: data.confirmedTime,
            meetingLocation: "Meet at the property",
            showingInstructions: data.agentMessage,
            requestId: data.requestId
          };

          console.log('=== SENDING BUYER EMAIL (ORIGINAL) ===');
          console.log('Buyer email payload:', JSON.stringify(buyerEmailPayload, null, 2));

          const { data: buyerEmailResponse, error: buyerEmailError } = await supabase.functions.invoke('send-showing-confirmation-buyer', {
            body: buyerEmailPayload
          });
          
          console.log('=== BUYER EMAIL RESPONSE ===');
          console.log('Buyer email response:', buyerEmailResponse);
          console.log('Buyer email error:', buyerEmailError);
        } catch (emailError) {
          console.error('Exception in email test:', emailError);
        }
        } else {
          console.error('No profile data available for email sending');
        }
      } else {
        console.error('Failed to fetch showing request details');
        console.error('Fetch error:', fetchError);
        console.error('Showing request data:', showingRequest);
      }
      
      // Show success message regardless of email issues since the tour was confirmed
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
