import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowTrigger {
  showing_request_id: string;
  trigger_type: 'post_showing_workflow' | 'follow_up_nudge' | 'agent_notification' | 'attendance_confirmation' | 'auto_complete';
  scheduled_for: string;
  payload?: any;
}

async function markShowingCompletedIfReady(supabase: any, showing_request_id: string) {
  console.log('Checking if showing should be marked completed:', showing_request_id);
  
  const { data: attendance } = await supabase
    .from('showing_attendance')
    .select('buyer_checked_out, agent_checked_out')
    .eq('showing_request_id', showing_request_id)
    .maybeSingle();

  console.log('Attendance data:', attendance);

  const bothCheckedOut = attendance?.buyer_checked_out && attendance?.agent_checked_out;

  const { data: buyerFb } = await supabase
    .from('buyer_feedback')
    .select('id')
    .eq('showing_request_id', showing_request_id)
    .maybeSingle();

  const { data: agentFb } = await supabase
    .from('agent_feedback')
    .select('id')
    .eq('showing_request_id', showing_request_id)
    .maybeSingle();

  const bothFeedback = buyerFb && agentFb;

  console.log('Completion check:', { bothCheckedOut, bothFeedback, buyerFb: !!buyerFb, agentFb: !!agentFb });

  // Mark as completed if both parties checked out OR if both provided feedback
  if (bothCheckedOut || bothFeedback) {
    console.log('Marking showing as completed');
    const { error } = await supabase
      .from('showing_requests')
      .update({ 
        status: 'completed',
        status_updated_at: new Date().toISOString()
      })
      .eq('id', showing_request_id);

    if (error) {
      console.error('Error marking showing completed:', error);
    } else {
      console.log('Successfully marked showing as completed');
    }

    return true;
  }

  return false;
}

async function autoCompleteShowing(supabase: any, showing_request_id: string) {
  console.log('Auto-completing showing after 3 days:', showing_request_id);
  
  // Check if showing is still in confirmed/scheduled status
  const { data: showing } = await supabase
    .from('showing_requests')
    .select('status, preferred_date, preferred_time')
    .eq('id', showing_request_id)
    .single();

  if (!showing || !['confirmed', 'scheduled'].includes(showing.status)) {
    console.log('Showing not in eligible status for auto-completion');
    return;
  }

  // Mark as completed automatically
  const { error } = await supabase
    .from('showing_requests')
    .update({ 
      status: 'completed',
      status_updated_at: new Date().toISOString()
    })
    .eq('id', showing_request_id);

  if (error) {
    console.error('Error auto-completing showing:', error);
    throw error;
  }

  console.log('Successfully auto-completed showing');
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

  try {
    const { action, showing_request_id, ...data } = await req.json();
    console.log('Post-showing workflow action:', action, { showing_request_id, data });

    switch (action) {
      case 'trigger_workflow':
        return await triggerPostShowingWorkflow(supabase, showing_request_id);
      
      case 'check_attendance':
        return await checkAttendance(supabase, showing_request_id, data);
      
      case 'submit_buyer_feedback':
        return await submitBuyerFeedback(supabase, showing_request_id, data);
      
      case 'submit_agent_feedback':
        return await submitAgentFeedback(supabase, showing_request_id, data);
      
      case 'record_action':
        return await recordPostShowingAction(supabase, showing_request_id, data);
      
      case 'send_follow_up_nudge':
        return await sendFollowUpNudge(supabase, showing_request_id);
      
      case 'schedule_workflow_triggers':
        return await scheduleWorkflowTriggers(supabase, showing_request_id, data);
      
      case 'auto_complete_showing':
        return await autoCompleteShowing(supabase, showing_request_id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in post-showing workflow:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

async function triggerPostShowingWorkflow(supabase: any, showing_request_id: string) {
  console.log('Triggering post-showing workflow for:', showing_request_id);
  
  // Get showing details
  const { data: showing, error: showingError } = await supabase
    .from('showing_requests')
    .select('*, profiles:user_id(*)')
    .eq('id', showing_request_id)
    .single();

  if (showingError || !showing) {
    throw new Error('Showing request not found');
  }

  // Check if attendance record exists
  const { data: existingAttendance } = await supabase
    .from('showing_attendance')
    .select('*')
    .eq('showing_request_id', showing_request_id)
    .maybeSingle();

  if (!existingAttendance) {
    // Create attendance record
    await supabase
      .from('showing_attendance')
      .insert({
        showing_request_id,
        buyer_checked_out: false,
        agent_checked_out: false
      });
  }

  // Schedule follow-up nudge for 24 hours if no action taken
  const nudgeTime = new Date();
  nudgeTime.setHours(nudgeTime.getHours() + 24);

  await supabase
    .from('workflow_triggers')
    .insert({
      showing_request_id,
      trigger_type: 'follow_up_nudge',
      scheduled_for: nudgeTime.toISOString(),
      payload: { type: 'buyer_nudge' }
    });

  return new Response(
    JSON.stringify({ success: true, message: 'Post-showing workflow triggered' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkAttendance(supabase: any, showing_request_id: string, data: any) {
  const { user_type, attended, checked_out } = data;
  
  console.log('Checking attendance for:', { showing_request_id, user_type, attended, checked_out });

  // First, check if attendance record exists
  const { data: existingRecord } = await supabase
    .from('showing_attendance')
    .select('*')
    .eq('showing_request_id', showing_request_id)
    .maybeSingle();

  let updateData: any = {};
  
  if (user_type === 'buyer') {
    if (attended !== undefined) updateData.buyer_attended = attended;
    if (checked_out) {
      updateData.buyer_checked_out = true;
      updateData.buyer_checkout_time = new Date().toISOString();
    }
  } else if (user_type === 'agent') {
    if (attended !== undefined) updateData.agent_attended = attended;
    if (checked_out) {
      updateData.agent_checked_out = true;
      updateData.agent_checkout_time = new Date().toISOString();
    }
  }

  let result;
  if (existingRecord) {
    // Update existing record
    result = await supabase
      .from('showing_attendance')
      .update(updateData)
      .eq('showing_request_id', showing_request_id);
  } else {
    // Insert new record with defaults
    const insertData = {
      showing_request_id,
      buyer_checked_out: false,
      agent_checked_out: false,
      ...updateData
    };
    result = await supabase
      .from('showing_attendance')
      .insert(insertData);
  }

  if (result.error) {
    console.error('Error updating attendance:', result.error);
    throw result.error;
  }

  // Check if showing should be marked as completed
  const completed = await markShowingCompletedIfReady(supabase, showing_request_id);

  // Get updated attendance data
  const { data: attendance } = await supabase
    .from('showing_attendance')
    .select('*')
    .eq('showing_request_id', showing_request_id)
    .single();

  return new Response(
    JSON.stringify({ 
      success: true, 
      attendance,
      completed 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function submitBuyerFeedback(supabase: any, showing_request_id: string, feedback: any) {
  const { buyer_id, agent_id, property_rating, agent_rating, property_comments, agent_comments } = feedback;

  console.log('Submitting buyer feedback:', { showing_request_id, buyer_id });

  // Check if feedback already exists
  const { data: existingFeedback } = await supabase
    .from('buyer_feedback')
    .select('id')
    .eq('showing_request_id', showing_request_id)
    .eq('buyer_id', buyer_id)
    .maybeSingle();

  let result;
  if (existingFeedback) {
    // Update existing feedback
    result = await supabase
      .from('buyer_feedback')
      .update({
        agent_id,
        property_rating,
        agent_rating,
        property_comments,
        agent_comments
      })
      .eq('id', existingFeedback.id);
  } else {
    // Insert new feedback
    result = await supabase
      .from('buyer_feedback')
      .insert({
        showing_request_id,
        buyer_id,
        agent_id,
        property_rating,
        agent_rating,
        property_comments,
        agent_comments
      });
  }

  if (result.error) {
    console.error('Error submitting buyer feedback:', result.error);
    throw result.error;
  }

  // Check if showing should be marked as completed
  const completed = await markShowingCompletedIfReady(supabase, showing_request_id);

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Buyer feedback submitted',
      completed 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function submitAgentFeedback(supabase: any, showing_request_id: string, feedback: any) {
  const { agent_id, buyer_id, buyer_interest_level, buyer_seriousness_rating, notes, recommend_buyer } = feedback;

  console.log('Submitting agent feedback:', { showing_request_id, agent_id });

  // Check if feedback already exists
  const { data: existingFeedback } = await supabase
    .from('agent_feedback')
    .select('id')
    .eq('showing_request_id', showing_request_id)
    .eq('agent_id', agent_id)
    .maybeSingle();

  let result;
  if (existingFeedback) {
    // Update existing feedback
    result = await supabase
      .from('agent_feedback')
      .update({
        buyer_id,
        buyer_interest_level,
        buyer_seriousness_rating,
        notes,
        recommend_buyer
      })
      .eq('id', existingFeedback.id);
  } else {
    // Insert new feedback
    result = await supabase
      .from('agent_feedback')
      .insert({
        showing_request_id,
        agent_id,
        buyer_id,
        buyer_interest_level,
        buyer_seriousness_rating,
        notes,
        recommend_buyer
      });
  }

  if (result.error) {
    console.error('Error submitting agent feedback:', result.error);
    throw result.error;
  }

  // Check if showing should be marked as completed
  const completed = await markShowingCompletedIfReady(supabase, showing_request_id);

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Agent feedback submitted',
      completed 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function recordPostShowingAction(supabase: any, showing_request_id: string, actionData: any) {
  const { buyer_id, action_type, action_details } = actionData;

  const { error } = await supabase
    .from('post_showing_actions')
    .insert({
      showing_request_id,
      buyer_id,
      action_type,
      action_details
    });

  if (error) throw error;

  // If action requires agent notification, create workflow trigger
  if (['schedule_same_agent', 'work_with_agent', 'ask_question'].includes(action_type)) {
    await supabase
      .from('workflow_triggers')
      .insert({
        showing_request_id,
        trigger_type: 'agent_notification',
        scheduled_for: new Date().toISOString(),
        payload: { action_type, action_details }
      });
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Action recorded' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function sendFollowUpNudge(supabase: any, showing_request_id: string) {
  // Check if buyer has taken any action
  const { data: actions } = await supabase
    .from('post_showing_actions')
    .select('*')
    .eq('showing_request_id', showing_request_id);

  if (actions && actions.length > 0) {
    console.log('Buyer has already taken action, skipping nudge');
    return new Response(
      JSON.stringify({ success: true, message: 'Nudge skipped - action already taken' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Here you would implement actual notification sending (email, SMS, etc.)
  console.log('Sending follow-up nudge for showing:', showing_request_id);

  return new Response(
    JSON.stringify({ success: true, message: 'Follow-up nudge sent' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function scheduleWorkflowTriggers(supabase: any, showing_request_id: string, data: any) {
  const { scheduled_end_time } = data;

  // Avoid creating duplicate workflow triggers
  const { data: existing } = await supabase
    .from('workflow_triggers')
    .select('id')
    .eq('showing_request_id', showing_request_id)
    .eq('trigger_type', 'post_showing_workflow')
    .limit(1)
    .maybeSingle();

  if (existing) {
    return new Response(
      JSON.stringify({ success: true, message: 'Workflow trigger already scheduled' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Schedule post-showing workflow for 30 minutes after scheduled end
  const workflowTime = new Date(scheduled_end_time);
  workflowTime.setMinutes(workflowTime.getMinutes() + 30);

  // Schedule auto-completion for 3 days after the showing
  const autoCompleteTime = new Date(scheduled_end_time);
  autoCompleteTime.setDate(autoCompleteTime.getDate() + 3);

  const triggers = [
    {
      showing_request_id,
      trigger_type: 'post_showing_workflow',
      scheduled_for: workflowTime.toISOString(),
      payload: { auto_triggered: true }
    },
    {
      showing_request_id,
      trigger_type: 'auto_complete',
      scheduled_for: autoCompleteTime.toISOString(),
      payload: { reason: 'auto_complete_after_3_days' }
    }
  ];

  const { error } = await supabase
    .from('workflow_triggers')
    .insert(triggers);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, message: 'Workflow triggers scheduled including auto-completion' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

serve(handler);
