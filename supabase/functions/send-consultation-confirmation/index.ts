import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationEmailRequest {
  buyerName: string;
  buyerEmail: string;
  propertyAddress: string;
  consultationDate: string;
  consultationTime: string;
  consultationType: 'video' | 'phone';
  agentName?: string;
  meetingLink?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      buyerName, 
      buyerEmail, 
      propertyAddress, 
      consultationDate, 
      consultationTime,
      consultationType,
      agentName,
      meetingLink
    }: ConsultationEmailRequest = await req.json();

    console.log(`Sending consultation confirmation to ${buyerEmail} for ${propertyAddress}`);

    const formattedDate = new Date(consultationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailSubject = `Your Offer Strategy Consultation is Confirmed - ${propertyAddress}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Consultation Confirmed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; }
            .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { font-size: 16px; margin-top: 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">✅ Consultation Confirmed</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your offer strategy session is all set</p>
            </div>
            
            <div class="content">
              <p>Hi ${buyerName},</p>
              
              <p>Great news! Your offer strategy consultation has been confirmed. Our team is excited to help you put together a winning offer for this property.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #1976d2;">📍 Property</h3>
                <p style="font-size: 18px; margin: 5px 0;"><strong>${propertyAddress}</strong></p>
              </div>
              
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">${formattedDate}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Time</div>
                  <div class="detail-value">${consultationTime}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Type</div>
                  <div class="detail-value">${consultationType === 'video' ? '📹 Video Call' : '📞 Phone Call'}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Duration</div>
                  <div class="detail-value">30 minutes</div>
                </div>
              </div>
              
              ${agentName ? `<p><strong>Your consultant:</strong> ${agentName}</p>` : ''}
              
              ${meetingLink ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${meetingLink}" class="button">Join Video Call</a>
                  <p style="font-size: 14px; color: #666; margin-top: 10px;">We'll also call you at your scheduled time</p>
                </div>
              ` : ''}
              
              <h3>What to Expect</h3>
              <ul>
                <li><strong>Market Analysis:</strong> We'll review comparable sales and current market conditions</li>
                <li><strong>Pricing Strategy:</strong> Determine the optimal offer amount and terms</li>
                <li><strong>Competitive Positioning:</strong> Discuss escalation clauses and contingencies</li>
                <li><strong>Timeline Planning:</strong> Settlement dates and closing coordination</li>
                <li><strong>Documentation Review:</strong> Forms, contracts, and required documents</li>
              </ul>
              
              <h3>Before Your Call</h3>
              <p>To make the most of our time together, please have ready:</p>
              <ul>
                <li>Your pre-approval letter (if you have one)</li>
                <li>Proof of down payment funds</li>
                <li>Any specific questions about the property or neighborhood</li>
                <li>Your ideal timeline for closing</li>
              </ul>
              
              <div class="highlight">
                <p style="margin: 0;"><strong>Need to reschedule?</strong> Just reply to this email and we'll work with you to find a better time.</p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>FirstLook Home Tours</strong><br>
              Making home buying transparent and affordable<br>
              <a href="mailto:support@firstlookhometours.com">support@firstlookhometours.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "FirstLook Home Tours <noreply@firstlookhometours.com>",
      to: buyerEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending consultation confirmation email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Consultation confirmation email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Consultation confirmation email sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-consultation-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);