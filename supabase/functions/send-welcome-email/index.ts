
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  firstName: string;
  email: string;
  userType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, email, userType }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} (${firstName}, ${userType})`);

    // Only send welcome emails to buyers for now
    if (userType !== 'buyer') {
      console.log(`Skipping welcome email for user type: ${userType}`);
      return new Response(
        JSON.stringify({ message: "Welcome email not sent - not a buyer" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "FirstLook <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to FirstLook — You're in control now.",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to FirstLook</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center;">
                <div style="background-color: white; width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; font-weight: bold; color: #333;">F</span>
                </div>
                <h1 style="color: white; font-size: 32px; font-weight: 300; margin: 0; letter-spacing: -0.5px;">
                  Your home search, on your terms.
                </h1>
              </div>

              <!-- Main Content -->
              <div style="padding: 48px 40px;">
                <h2 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0 0 24px 0;">
                  Hi ${firstName || 'there'},
                </h2>
                
                <p style="font-size: 16px; color: #4a5568; margin: 0 0 32px 0; line-height: 1.7;">
                  Thanks for signing up for FirstLook. You just joined the only platform designed for buyers who want to tour homes — without pressure, contracts, or awkward sales pitches.
                </p>

                <p style="font-size: 16px; color: #4a5568; margin: 0 0 32px 0; line-height: 1.7;">
                  Here's what you can do starting now:
                </p>

                <!-- Feature List -->
                <div style="margin: 32px 0 40px 0;">
                  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <span style="font-size: 20px; margin-right: 12px;">🏡</span>
                    <span style="font-size: 16px; color: #2d3748; font-weight: 500;">Book a Home Tour — any listing, any time</span>
                  </div>
                  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <span style="font-size: 20px; margin-right: 12px;">✍️</span>
                    <span style="font-size: 16px; color: #2d3748; font-weight: 500;">Write Offers with or without an Agent</span>
                  </div>
                  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <span style="font-size: 20px; margin-right: 12px;">💸</span>
                    <span style="font-size: 16px; color: #2d3748; font-weight: 500;">Save Thousands with our commission refund model</span>
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 48px 0;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('uugchegukcccuqpcsqhl.supabase.co', 'www.firstlookhometours.com') || 'https://www.firstlookhometours.com'}/buyer-dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.25px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                    Book Your First Tour
                  </a>
                </div>

                <p style="font-size: 16px; color: #4a5568; margin: 40px 0 0 0; line-height: 1.7;">
                  We built FirstLook to make sure you stay in control — not the agent, not the listing platform.
                </p>

                <p style="font-size: 16px; color: #4a5568; margin: 16px 0 0 0; line-height: 1.7;">
                  No hidden strings. No spam. Just a smarter way to buy.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 16px; font-weight: 600; color: #2d3748; margin: 0 0 8px 0;">
                  — The FirstLook Team
                </p>
                <p style="font-size: 14px; color: #718096; margin: 0;">
                  No commitment. Full control.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
