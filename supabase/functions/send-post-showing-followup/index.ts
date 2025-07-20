import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PostShowingFollowupData {
  buyerName: string;
  buyerEmail: string;
  propertyAddress: string;
  agentName?: string;
  agentEmail?: string;
  tourDate: string;
  showingRequestId: string;
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
      agentName,
      agentEmail,
      tourDate,
      showingRequestId
    }: PostShowingFollowupData = await req.json();

    console.log(`Sending post-showing follow-up to ${buyerEmail} for ${propertyAddress}`);

    const formattedDate = new Date(tourDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    const emailSubject = `How was your tour of ${propertyAddress}?`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Post-Tour Follow-up</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .cta-section { background: #e3f2fd; padding: 25px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 25px 0; text-align: center; }
            .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .action-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; text-align: center; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button-outline { display: inline-block; background: transparent; color: #000; border: 2px solid #000; padding: 10px 22px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🏠 How was your tour?</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We'd love to hear about your experience</p>
            </div>
            
            <div class="content">
              <p>Hi ${buyerName},</p>
              
              <p>We hope you enjoyed your tour of <strong>${propertyAddress}</strong> on ${formattedDate}! ${agentName ? `${agentName} mentioned it was great meeting you.` : ''}</p>
              
              <div class="cta-section">
                <h3 style="margin-top: 0; color: #1976d2;">💭 What did you think?</h3>
                <p style="margin-bottom: 20px;">Your feedback helps us improve and helps other buyers know what to expect.</p>
                <a href="https://firstlookhometours.com/feedback?showing=${showingRequestId}" class="button">Leave Feedback (2 minutes)</a>
              </div>
              
              <h3>What's Next?</h3>
              <p>Based on how you're feeling about the property, here are your options:</p>
              
              <div class="action-buttons">
                <div class="action-card">
                  <h4 style="margin-top: 0; color: #4caf50;">❤️ Loved It?</h4>
                  <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Ready to make an offer or want to see more like this?</p>
                  <a href="https://firstlookhometours.com/next-steps?property=${encodeURIComponent(propertyAddress)}&action=interested" class="button-outline">I'm Interested</a>
                </div>
                
                <div class="action-card">
                  <h4 style="margin-top: 0; color: #ff9800;">🤔 Not Sure?</h4>
                  <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Want to discuss what you saw or see similar properties?</p>
                  <a href="https://firstlookhometours.com/next-steps?property=${encodeURIComponent(propertyAddress)}&action=discuss" class="button-outline">Let's Talk</a>
                </div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">📋 Quick Survey (Optional)</h4>
                <p style="font-size: 14px; margin-bottom: 15px;">Help us understand what you're looking for:</p>
                <ul style="font-size: 14px; color: #666; margin: 10px 0;">
                  <li>How did this property compare to your expectations?</li>
                  <li>What features were most/least important to you?</li>
                  <li>Are you ready to make an offer or need to see more properties?</li>
                  <li>Any questions about the neighborhood or market?</li>
                </ul>
                <a href="https://firstlookhometours.com/survey?showing=${showingRequestId}" style="color: #1976d2; text-decoration: none; font-size: 14px;">→ Take 2-minute survey</a>
              </div>
              
              <h3>Need Help Deciding?</h3>
              <p>Our team is here to help you navigate your home buying journey:</p>
              <ul>
                <li><strong>Schedule More Tours:</strong> Found other properties you want to see?</li>
                <li><strong>Market Analysis:</strong> Get detailed comparable sales and pricing insights</li>
                <li><strong>Offer Strategy:</strong> Ready to make an offer? We'll help you win</li>
                <li><strong>Agent Support:</strong> Questions about the process or this property?</li>
              </ul>
              
              ${agentName ? `
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0;">👤 Your Agent: ${agentName}</h4>
                <p style="margin-bottom: 0; font-size: 14px;">Feel free to reach out directly with any questions about the property or neighborhood.</p>
                ${agentEmail ? `<p style="margin: 5px 0 0 0; font-size: 14px;">📧 <a href="mailto:${agentEmail}">${agentEmail}</a></p>` : ''}
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://firstlookhometours.com/schedule-tour" class="button">Schedule Another Tour</a>
                <a href="mailto:support@firstlookhometours.com" class="button-outline">Contact Support</a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>FirstLook</strong><br>
              Making home buying transparent and affordable<br>
              <a href="mailto:support@firstlookhometours.com">support@firstlookhometours.com</a></p>
              
              <p style="font-size: 12px; margin-top: 15px;">
                <a href="https://firstlookhometours.com/unsubscribe?email=${encodeURIComponent(buyerEmail)}" style="color: #999;">Unsubscribe from follow-up emails</a>
              </p>
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
      console.error("Error sending post-showing follow-up email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Post-showing follow-up email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Post-showing follow-up email sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-post-showing-followup function:", error);
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