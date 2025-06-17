
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageId, senderId, receiverId, showingRequestId, content } = await req.json();
    
    if (!messageId || !senderId || !receiverId || !showingRequestId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const client = createClient(supabaseUrl, supabaseKey);

    // Get receiver profile and showing details
    const { data: receiverProfile, error: receiverError } = await client
      .from('profiles')
      .select('first_name, last_name, user_type')
      .eq('id', receiverId)
      .single();

    const { data: senderProfile, error: senderError } = await client
      .from('profiles')
      .select('first_name, last_name, user_type')
      .eq('id', senderId)
      .single();

    const { data: showing, error: showingError } = await client
      .from('showing_requests')
      .select('property_address')
      .eq('id', showingRequestId)
      .single();

    if (receiverError || senderError || showingError || !receiverProfile || !senderProfile || !showing) {
      console.error('Error fetching data:', { receiverError, senderError, showingError });
      return new Response(
        JSON.stringify({ error: 'Failed to fetch notification data' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get receiver's email from auth.users
    const { data: { user }, error: userError } = await client.auth.admin.getUserById(receiverId);
    
    if (userError || !user?.email) {
      console.error('Error fetching user email:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user email' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // For now, just log the notification (email sending would require additional setup)
    console.log('Message notification:', {
      to: user.email,
      receiverName: `${receiverProfile.first_name} ${receiverProfile.last_name}`,
      senderName: `${senderProfile.first_name} ${senderProfile.last_name}`,
      senderType: senderProfile.user_type,
      propertyAddress: showing.property_address,
      messagePreview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
    });

    // TODO: Integrate with email service (SendGrid, Resend, etc.) here
    // For now, we'll just return success to enable the functionality

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification logged (email integration pending)' 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-message-notification function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
