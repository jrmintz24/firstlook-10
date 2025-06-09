import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import sgMail from "https://esm.sh/@sendgrid/mail@7.7.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId } = await req.json();
    if (!requestId) {
      return new Response(JSON.stringify({ error: 'requestId required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL');

    if (!supabaseUrl || !supabaseKey || !sendgridKey || !fromEmail) {
      return new Response(JSON.stringify({ error: 'Missing environment configuration' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('showing_requests')
      .select('assigned_agent_email, property_address')
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Request not found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 });
    }

    sgMail.setApiKey(sendgridKey);
    await sgMail.send({
      to: data.assigned_agent_email,
      from: fromEmail,
      subject: 'Showing Request Approved',
      text: `Your showing request for ${data.property_address} has been approved.`,
    });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
