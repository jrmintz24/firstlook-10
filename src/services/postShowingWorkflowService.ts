
import { supabase } from '@/integrations/supabase/client';

interface WorkflowTriggerData {
  showing_request_id: string;
  trigger_type: 'post_checkout' | 'action_taken' | 'follow_up';
  scheduled_for?: string;
  payload?: any;
}

export class PostShowingWorkflowService {
  static async triggerWorkflow(data: WorkflowTriggerData) {
    try {
      const { error } = await supabase
        .from('workflow_triggers')
        .insert({
          showing_request_id: data.showing_request_id,
          trigger_type: data.trigger_type,
          scheduled_for: data.scheduled_for || new Date().toISOString(),
          payload: data.payload || {}
        });

      if (error) throw error;
      
      console.log('Workflow trigger created:', data);
      return true;
    } catch (error) {
      console.error('Error creating workflow trigger:', error);
      return false;
    }
  }

  static async notifyAgentOfBuyerAction(params: {
    showingId: string;
    buyerId: string;
    agentId: string;
    actionType: string;
    actionDetails?: any;
  }) {
    try {
      // Get buyer and agent info
      const [buyerResult, agentResult] = await Promise.all([
        supabase.from('profiles').select('first_name, last_name').eq('id', params.buyerId).single(),
        supabase.from('profiles').select('first_name, last_name').eq('id', params.agentId).single()
      ]);

      const buyerName = buyerResult.data 
        ? `${buyerResult.data.first_name} ${buyerResult.data.last_name}`.trim()
        : 'A buyer';

      // Create agent notification
      const { error } = await supabase
        .from('agent_notifications')
        .insert({
          agent_id: params.agentId,
          buyer_id: params.buyerId,
          showing_request_id: params.showingId,
          notification_type: 'buyer_action',
          message: `${buyerName} took action: ${params.actionType.replace(/_/g, ' ')}`,
          metadata: {
            action_type: params.actionType,
            action_details: params.actionDetails,
            buyer_name: buyerName
          }
        });

      if (error) throw error;
      
      console.log('Agent notification created for action:', params.actionType);
      return true;
    } catch (error) {
      console.error('Error creating agent notification:', error);
      return false;
    }
  }

  static async scheduleFollowUp(showingId: string, delayHours: number = 24) {
    const scheduledFor = new Date();
    scheduledFor.setHours(scheduledFor.getHours() + delayHours);

    return this.triggerWorkflow({
      showing_request_id: showingId,
      trigger_type: 'follow_up',
      scheduled_for: scheduledFor.toISOString(),
      payload: { follow_up_type: 'post_showing_check_in' }
    });
  }

  static async handleShowingStatusChange(showingId: string, newStatus: string) {
    if (newStatus === 'completed') {
      // Schedule immediate post-showing workflow
      await this.triggerWorkflow({
        showing_request_id: showingId,
        trigger_type: 'post_checkout',
        payload: { trigger_reason: 'showing_completed' }
      });

      // Schedule follow-up workflow
      await this.scheduleFollowUp(showingId, 2); // 2 hours after completion
    }
  }
}
