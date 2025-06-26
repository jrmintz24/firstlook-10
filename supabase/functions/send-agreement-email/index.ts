
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAgreementEmailRequest {
  showingRequestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { showingRequestId }: SendAgreementEmailRequest = await req.json();

    // Get showing details and user info
    const { data: showingData, error: showingError } = await supabase
      .from('showing_requests')
      .select(`
        *,
        profiles!showing_requests_user_id_fkey(first_name, last_name)
      `)
      .eq('id', showingRequestId)
      .single();

    if (showingError || !showingData) {
      throw new Error(`Failed to fetch showing: ${showingError?.message}`);
    }

    // Get user email from auth.users
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(showingData.user_id);
    
    if (userError || !user) {
      throw new Error(`Failed to get user: ${userError?.message}`);
    }

    // Generate agreement token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_agreement_token');

    if (tokenError) {
      throw new Error(`Failed to generate token: ${tokenError.message}`);
    }

    const token = tokenData;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create tour agreement record with token
    const { error: agreementError } = await supabase
      .from('tour_agreements')
      .insert({
        showing_request_id: showingRequestId,
        buyer_id: showingData.user_id,
        agent_id: showingData.assigned_agent_id,
        email_token: token,
        token_expires_at: expiresAt.toISOString(),
        signed: false
      });

    if (agreementError) {
      throw new Error(`Failed to create agreement: ${agreementError.message}`);
    }

    // Update showing status to awaiting_agreement
    const { error: statusError } = await supabase
      .from('showing_requests')
      .update({ 
        status: 'awaiting_agreement',
        status_updated_at: new Date().toISOString()
      })
      .eq('id', showingRequestId);

    if (statusError) {
      throw new Error(`Failed to update status: ${statusError.message}`);
    }

    // Log email notification
    const { error: notificationError } = await supabase
      .from('showing_email_notifications')
      .insert({
        showing_request_id: showingRequestId,
        notification_type: 'agreement_request'
      });

    if (notificationError) {
      console.error('Failed to log notification:', notificationError);
    }

    // For now, return success. In production, you would integrate with an email service
    // like Resend to send the actual email with the agreement link
    const agreementUrl = `${supabaseUrl.replace('supabase.co', 'lovable.app')}/tour-agreement?token=${token}`;
    
    console.log(`Agreement email would be sent to ${user.email} with URL: ${agreementUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Agreement email process initiated',
        agreementUrl
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-agreement-email function:", error);
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
