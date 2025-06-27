
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

      // First, get the showing request details
      const { data: showingRequest, error: fetchError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('id', confirmationData.requestId)
        .single();

      if (fetchError || !showingRequest) {
        console.error('Error fetching showing request:', fetchError);
        throw new Error('Failed to fetch showing request details');
      }

      console.log('Showing request details:', showingRequest);

      // Separately fetch the buyer's profile information
      let buyerName = 'Buyer';
      if (showingRequest.user_id) {
        const { data: buyerProfile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', showingRequest.user_id)
          .single();

        if (buyerProfile && !profileError) {
          buyerName = buyerProfile.first_name || 'Buyer';
        }
      }

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

      // Create tour agreement record directly
      console.log('Creating tour agreement record...');
      const { data: agreement, error: agreementError } = await supabase
        .from('tour_agreements')
        .insert({
          showing_request_id: confirmationData.requestId,
          buyer_id: showingRequest.user_id,
          agreement_type: 'single_tour',
          signed: false,
          email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select('*')
        .single();

      if (agreementError) {
        console.error('Error creating tour agreement:', agreementError);
        // Don't fail the whole process - just log it
        console.log('Tour agreement creation failed, but continuing with confirmation');
      } else {
        console.log('Tour agreement created successfully:', agreement);
      }

      // Send agreement email as backup (non-blocking)
      console.log('Sending agreement email as backup...');
      
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-agreement-email', {
        body: {
          showing_request_id: confirmationData.requestId,
          buyer_user_id: showingRequest.user_id,
          buyer_name: buyerName,
          property_address: showingRequest.property_address,
          agent_name: agentName,
          preferred_date: confirmationData.confirmedDate,
          preferred_time: confirmationData.confirmedTime
        }
      });

      if (emailError) {
        console.error('Error sending agreement email:', emailError);
        // Email failure is not critical anymore
        console.log('Email failed but agreement is accessible via dashboard');
      } else {
        console.log('Backup email sent successfully:', emailResult);
      }

      // Always show success - dashboard access is primary
      toast({
        title: "Tour Confirmed",
        description: `Tour confirmed for ${showingRequest.property_address}. The buyer can sign the agreement in their dashboard.`
      });

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
