
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PostShowingWorkflowRequest {
  action: string;
  showing_request_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, showing_request_id }: PostShowingWorkflowRequest = await req.json();

    console.log('Post-showing workflow triggered:', { action, showing_request_id });

    // Get the showing request details
    const { data: showingRequest, error: showingError } = await supabaseClient
      .from('showing_requests')
      .select('*')
      .eq('id', showing_request_id)
      .single();

    if (showingError || !showingRequest) {
      console.error('Error fetching showing request:', showingError);
      throw new Error(`Failed to fetch showing request: ${showingError?.message}`);
    }

    // Only trigger workflow for completed showings
    if (showingRequest.status === 'completed') {
      console.log('Processing post-showing workflow for completed showing');

      // Create agent notification about the completed showing
      if (showingRequest.assigned_agent_id) {
        const { error: notificationError } = await supabaseClient
          .from('agent_notifications')
          .insert({
            agent_id: showingRequest.assigned_agent_id,
            buyer_id: showingRequest.user_id,
            showing_request_id: showing_request_id,
            notification_type: 'showing_completed',
            message: `Showing completed at ${showingRequest.property_address}. Follow up with buyer available.`,
            metadata: {
              property_address: showingRequest.property_address,
              completed_at: new Date().toISOString()
            }
          });

        if (notificationError) {
          console.error('Error creating agent notification:', notificationError);
        } else {
          console.log('Agent notification created for completed showing');
        }
      }

      // You could add more post-showing workflow steps here:
      // - Send follow-up emails
      // - Create feedback requests
      // - Schedule follow-up appointments
      // - Generate analytics data
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Post-showing workflow processed successfully' 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in post-showing-workflow function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
