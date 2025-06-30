
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AgentReferralData {
  buyerId: string;
  agentId: string;
  showingRequestId: string;
  referralType: 'hire_agent' | 'offer_assistance';
  commissionRate?: number;
}

interface AgentNotificationData {
  agentId: string;
  buyerId: string;
  showingRequestId: string;
  notificationType: string;
  message: string;
  metadata?: any;
}

export const useAgentReferralSystem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createAgentReferral = async (data: AgentReferralData) => {
    try {
      setIsSubmitting(true);

      // Create the referral record
      const { error: referralError } = await supabase
        .from('agent_referrals')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId,
          showing_request_id: data.showingRequestId,
          referral_type: data.referralType,
          commission_rate: data.commissionRate || 0.03, // Default 3%
          status: 'active'
        });

      if (referralError) throw referralError;

      // Update buyer profile to reflect agent connection
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          agent_connected_id: data.agentId,
          agent_connected_at: new Date().toISOString(),
          profile_status: 'agent_connected'
        })
        .eq('id', data.buyerId);

      if (profileError) throw profileError;

      return { success: true };
    } catch (error) {
      console.error('Error creating agent referral:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect with agent. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendAgentNotification = async (data: AgentNotificationData) => {
    try {
      const { error } = await supabase
        .from('agent_notifications')
        .insert({
          agent_id: data.agentId,
          buyer_id: data.buyerId,
          showing_request_id: data.showingRequestId,
          notification_type: data.notificationType,
          message: data.message,
          metadata: data.metadata
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error sending agent notification:', error);
      return { success: false, error };
    }
  };

  const updateBuyerQualification = async (buyerId: string, qualificationData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          pre_approval_amount: qualificationData.preApprovalAmount,
          pre_approval_status: qualificationData.preApprovalStatus,
          budget_min: qualificationData.budgetMin,
          budget_max: qualificationData.budgetMax,
          buying_timeline: qualificationData.buyingTimeline,
          qualification_updated_at: new Date().toISOString()
        })
        .eq('id', buyerId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating buyer qualification:', error);
      return { success: false, error };
    }
  };

  return {
    isSubmitting,
    createAgentReferral,
    sendAgentNotification,
    updateBuyerQualification
  };
};
