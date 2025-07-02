
import { supabase } from "@/integrations/supabase/client";

export const debugWorkflow = async () => {
  try {
    console.log('=== WORKFLOW DEBUG INFO ===');

    // Check showing requests
    const { data: showingRequests, error: showingError } = await supabase
      .from('showing_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (showingError) {
      console.error('Error fetching showing requests:', showingError);
    } else {
      console.log('Recent showing requests:', showingRequests?.map(req => ({
        id: req.id,
        status: req.status,
        property_address: req.property_address,
        assigned_agent_id: req.assigned_agent_id,
        created_at: req.created_at
      })));
    }

    // Check workflow triggers
    const { data: triggers, error: triggersError } = await supabase
      .from('workflow_triggers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (triggersError) {
      console.error('Error fetching workflow triggers:', triggersError);
    } else {
      console.log('Recent workflow triggers:', triggers?.map(trigger => ({
        id: trigger.id,
        trigger_type: trigger.trigger_type,
        status: trigger.status,
        scheduled_for: trigger.scheduled_for,
        executed_at: trigger.executed_at,
        showing_request_id: trigger.showing_request_id
      })));
    }

    // Check profiles (agents)
    const { data: agents, error: agentsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'agent')
      .eq('profile_status', 'active');

    if (agentsError) {
      console.error('Error fetching active agents:', agentsError);
    } else {
      console.log('Active agents:', agents?.map(agent => ({
        id: agent.id,
        name: `${agent.first_name} ${agent.last_name}`,
        phone: agent.phone
      })));
    }

    console.log('=== END WORKFLOW DEBUG ===');
  } catch (error) {
    console.error('Error in debugWorkflow:', error);
  }
};

// Auto-run debug on import in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  setTimeout(debugWorkflow, 2000);
}
