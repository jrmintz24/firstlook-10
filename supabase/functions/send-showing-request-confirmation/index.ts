import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShowingRequestConfirmationData {
  buyerName: string;
  buyerEmail: string;
  properties: Array<{
    address: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
  }>;
  requestId: string;
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
      properties,
      requestId
    }: ShowingRequestConfirmationData = await req.json();

    console.log(`Sending showing request confirmation to ${buyerEmail} for ${properties.length} properties`);

    const propertyCount = properties.length;
    const isMultiple = propertyCount > 1;
    
    const emailSubject = isMultiple 
      ? `Your Tour Requests Have Been Received (${propertyCount} Properties)`
      : `Your Tour Request Has Been Received - ${properties[0]?.address}`;

    const propertiesHtml = properties.map((property, index) => `
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #1976d2; font-size: 16px;">📍 ${property.address}</h4>
        ${property.preferredDate ? `<p style="margin: 5px 0; color: #666;"><strong>Preferred Date:</strong> ${new Date(property.preferredDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>` : ''}
        ${property.preferredTime ? `<p style="margin: 5px 0; color: #666;"><strong>Preferred Time:</strong> ${property.preferredTime}</p>` : ''}
        ${property.notes ? `<p style="margin: 5px 0; color: #666;"><strong>Notes:</strong> ${property.notes}</p>` : ''}
      </div>
    `).join('');
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Tour Request Confirmation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .highlight { background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0; }
            .timeline { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .request-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #666; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">✅ Tour Request${isMultiple ? 's' : ''} Received</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We've got your request${isMultiple ? 's' : ''} and our team is on it!</p>
            </div>
            
            <div class="content">
              <p>Hi ${buyerName},</p>
              
              <p>Great news! We've received your tour request${isMultiple ? 's' : ''} and our team is already working to connect you with a local agent. Here's what you requested:</p>
              
              <div style="margin: 25px 0;">
                ${propertiesHtml}
              </div>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #2e7d32;">🎯 What Happens Next</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Agent Assignment (within 2 hours):</strong> We'll connect you with a qualified local agent</li>
                  <li><strong>Tour Confirmation (within 24 hours):</strong> Your agent will reach out to confirm tour details</li>
                  <li><strong>Agreement Signing:</strong> You'll receive an email with a simple tour agreement to sign</li>
                  <li><strong>Tour Day:</strong> Meet your agent at the property for your personalized tour</li>
                </ul>
              </div>
              
              <div class="timeline">
                <h3 style="margin-top: 0; color: #f57c00;">⏰ Timeline Expectations</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Today:</strong> Agent assignment and initial contact</li>
                  <li><strong>Within 24 hours:</strong> Tour confirmation and scheduling</li>
                  <li><strong>Before your tour:</strong> Agreement signing and preparation</li>
                </ul>
              </div>
              
              <h3>What to Expect</h3>
              <ul>
                <li><strong>Professional Agent:</strong> Licensed, vetted, and familiar with your area</li>
                <li><strong>Transparent Pricing:</strong> First tour free, then $99 per additional tour</li>
                <li><strong>No Pressure:</strong> Tours are informational - no obligation to make offers</li>
                <li><strong>Expert Guidance:</strong> Market insights, neighborhood info, and honest opinions</li>
              </ul>
              
              <h3>Questions or Changes?</h3>
              <p>Need to modify your request or have questions? Just reply to this email or contact us:</p>
              <ul>
                <li>📧 Email: <a href="mailto:support@firstlookhometours.com">support@firstlookhometours.com</a></li>
                <li>📱 Text: We'll send you our support number when your agent is assigned</li>
              </ul>
              
              <div class="request-id">
                <strong>Request ID:</strong> ${requestId}<br>
                <small>Keep this for your records</small>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>FirstLook Home Tours</strong><br>
              Making home tours transparent and affordable<br>
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
      console.error("Error sending showing request confirmation email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Showing request confirmation email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Showing request confirmation email sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-showing-request-confirmation function:", error);
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