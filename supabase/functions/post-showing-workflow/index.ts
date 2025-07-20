
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

      // Send follow-up email to buyer
      try {
        // Get buyer profile for email
        const { data: buyerProfile } = await supabaseClient
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', showingRequest.user_id)
          .single();

        // Get agent profile if assigned
        let agentProfile = null;
        if (showingRequest.assigned_agent_id) {
          const { data: agent } = await supabaseClient
            .from('profiles')
            .select('email, first_name, last_name')
            .eq('id', showingRequest.assigned_agent_id)
            .single();
          agentProfile = agent;
        }

        const testEmail = 'firstlookhometourstest@gmail.com';
        console.log('Sending post-showing email to test address:', testEmail);
        console.log('Buyer profile found:', buyerProfile);

        // Always send to test email for now
        const { error: emailError } = await supabaseClient.functions.invoke('send-post-showing-followup', {
          body: {
            buyerName: `${buyerProfile?.first_name || ''} ${buyerProfile?.last_name || ''}`.trim() || 'Test Buyer',
            buyerEmail: testEmail,
            propertyAddress: showingRequest.property_address,
            agentName: agentProfile ? `${agentProfile.first_name || ''} ${agentProfile.last_name || ''}`.trim() : undefined,
            agentEmail: agentProfile?.email,
            tourDate: showingRequest.updated_at || showingRequest.created_at,
            showingRequestId: showing_request_id
          }
        });

          if (emailError) {
            console.error('Post-showing follow-up email failed:', emailError);
          } else {
            console.log('Post-showing follow-up email sent successfully');
          }
        }
      } catch (emailError) {
        console.error('Error sending post-showing follow-up email:', emailError);
      }

      // You could add more post-showing workflow steps here:
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
