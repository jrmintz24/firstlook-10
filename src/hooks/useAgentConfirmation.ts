
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AgentConfirmationData {
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const confirmShowing = async (confirmationData: AgentConfirmationData, agentProfile: AgentProfile) => {
    setLoading(true);
    try {
      console.log('Starting agent confirmation process...', confirmationData);

      // First, get the showing request details including buyer info
      const { data: showingRequest, error: fetchError } = await supabase
        .from('showing_requests')
        .select(`
          *,
          profiles!showing_requests_user_id_fkey(email, first_name, last_name)
        `)
        .eq('id', confirmationData.requestId)
        .single();

      if (fetchError || !showingRequest) {
        console.error('Error fetching showing request:', fetchError);
        throw new Error('Failed to fetch showing request details');
      }

      console.log('Showing request details:', showingRequest);

      // Update the showing request with agent details and new status
      const agentName = `${agentProfile.first_name} ${agentProfile.last_name}`.trim();
      
      const { error: updateError } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: agentProfile.id,
          assigned_agent_name: agentName,
          assigned_agent_phone: agentProfile.phone,
          status: 'awaiting_agreement',
          preferred_date: confirmationData.confirmedDate,
          preferred_time: confirmationData.confirmedTime,
          status_updated_at: new Date().toISOString()
        })
        .eq('id', confirmationData.requestId);

      if (updateError) {
        console.error('Error updating showing request:', updateError);
        throw new Error('Failed to update showing request');
      }

      console.log('Showing request updated successfully');

      // Send agreement email to buyer
      const buyerEmail = showingRequest.profiles?.email;
      const buyerName = showingRequest.profiles?.first_name || 'Buyer';

      if (buyerEmail) {
        console.log('Sending agreement email to:', buyerEmail);
        
        const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-agreement-email', {
          body: {
            showing_request_id: confirmationData.requestId,
            buyer_email: buyerEmail,
            buyer_name: buyerName,
            property_address: showingRequest.property_address,
            agent_name: agentName,
            preferred_date: confirmationData.confirmedDate,
            preferred_time: confirmationData.confirmedTime
          }
        });

        if (emailError) {
          console.error('Error sending agreement email:', emailError);
          // Don't fail the entire process if email fails
          toast({
            title: "Tour Confirmed",
            description: "Tour confirmed but there was an issue sending the agreement email. Please contact the buyer directly.",
            variant: "destructive"
          });
        } else {
          console.log('Agreement email sent successfully:', emailResult);
          toast({
            title: "Tour Confirmed & Agreement Sent",
            description: `Tour confirmed for ${showingRequest.property_address}. Agreement email sent to buyer.`
          });
        }
      } else {
        console.warn('No buyer email found, skipping agreement email');
        toast({
          title: "Tour Confirmed",
          description: "Tour confirmed but no buyer email found for agreement.",
          variant: "destructive"
        });
      }

      return true;

    } catch (error: any) {
      console.error('Error in confirmShowing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to confirm showing. Please try again.",
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
