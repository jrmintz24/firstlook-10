
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAgreementEmailRequest {
  showing_request_id: string;
  buyer_user_id: string;
  buyer_name: string;
  property_address: string;
  agent_name: string;
  preferred_date?: string;
  preferred_time?: string;
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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { 
      showing_request_id, 
      buyer_user_id,
      buyer_name, 
      property_address, 
      agent_name,
      preferred_date,
      preferred_time 
    }: SendAgreementEmailRequest = await req.json();

    console.log('Sending agreement email for showing:', showing_request_id);

    // Get buyer's email from auth.users using service role
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserById(buyer_user_id);
    
    if (authError || !authUser) {
      console.error('Error fetching buyer auth details:', authError);
      throw new Error(`Failed to fetch buyer contact details: ${authError?.message}`);
    }

    const buyerEmail = authUser.user.email;
    if (!buyerEmail) {
      throw new Error('Buyer email not found');
    }

    // Create tour agreement record with token
    const { data: agreement, error: agreementError } = await supabaseClient
      .from('tour_agreements')
      .insert({
        showing_request_id,
        buyer_id: buyer_user_id,
        agreement_type: 'single_tour',
        signed: false
      })
      .select('email_token')
      .single();

    if (agreementError) {
      console.error('Error creating agreement:', agreementError);
      throw new Error(`Failed to create agreement: ${agreementError.message}`);
    }

    const agreementUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.netlify.app/sign-agreement?token=${agreement.email_token}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Tour Agreement Required</h1>
        
        <p>Hi ${buyer_name},</p>
        
        <p>Great news! Your tour request for <strong>${property_address}</strong> has been confirmed by ${agent_name}.</p>
        
        ${preferred_date && preferred_time ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Tour Details:</h3>
            <p><strong>Date:</strong> ${new Date(preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${preferred_time}</p>
            <p><strong>Property:</strong> ${property_address}</p>
            <p><strong>Agent:</strong> ${agent_name}</p>
          </div>
        ` : ''}
        
        <p><strong>Next Step:</strong> Please sign the single-day non-exclusive tour agreement to finalize your appointment.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${agreementUrl}" 
             style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Sign Tour Agreement
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This agreement allows you to tour the property with our agent. The agreement is non-exclusive and valid for this single tour only.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong> This link expires in 7 days. If you need assistance, please contact us.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you didn't request this tour, please ignore this email.
        </p>
      </div>
    `;

    const emailResult = await resend.emails.send({
      from: "HomeTours <noreply@resend.dev>",
      to: [buyerEmail],
      subject: `Tour Agreement Required - ${property_address}`,
      html: emailHtml,
    });

    console.log('Agreement email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        agreement_token: agreement.email_token,
        email_id: emailResult.data?.id 
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
