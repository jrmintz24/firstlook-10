import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShowingConfirmationAgentData {
  agentName: string;
  agentEmail: string;
  buyerId?: string; // New field to fetch buyer email if needed
  buyerName: string;
  buyerEmail?: string; // Made optional - will fetch if not provided
  buyerPhone?: string;
  propertyAddress: string;
  showingDate: string;
  showingTime: string;
  listingAgent?: string;
  listingAgentPhone?: string;
  showingInstructions?: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Agent confirmation email request body:', requestBody);
    
    const { 
      agentName,
      agentEmail,
      buyerId,
      buyerName, 
      buyerEmail: providedBuyerEmail,
      buyerPhone,
      propertyAddress,
      showingDate,
      showingTime,
      listingAgent,
      listingAgentPhone,
      showingInstructions,
      requestId
    }: ShowingConfirmationAgentData = requestBody;

    // Get buyer email if not provided
    let buyerEmail = providedBuyerEmail;
    
    if (!buyerEmail && buyerId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(buyerId);
        
        if (!authError && authUser?.user?.email) {
          buyerEmail = authUser.user.email;
          console.log(`Fetched buyer email for ${buyerId}: ${buyerEmail}`);
        } else {
          console.error("Failed to fetch buyer email:", authError);
        }
      }
    }

    // Validate required fields
    if (!agentName || !agentEmail || !propertyAddress || !showingDate || !showingTime) {
      const missingFields = [];
      if (!agentName) missingFields.push('agentName');
      if (!agentEmail) missingFields.push('agentEmail');
      if (!propertyAddress) missingFields.push('propertyAddress');
      if (!showingDate) missingFields.push('showingDate');
      if (!showingTime) missingFields.push('showingTime');
      
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Sending showing confirmation to agent ${agentEmail} for ${propertyAddress}`);
    console.log('All email parameters:', {
      agentName,
      agentEmail,
      buyerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      propertyAddress,
      showingDate,
      showingTime,
      showingInstructions,
      requestId
    });

    const formattedDate = new Date(showingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailSubject = `Showing Confirmed: ${propertyAddress} - ${formattedDate} at ${showingTime}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Showing Confirmed - Agent</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .property-info { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .client-info { background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin: 20px 0; }
            .listing-info { background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0; }
            .checklist { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .info-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 16px; margin-top: 5px; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .request-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #666; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">✅ Showing Confirmed</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your showing appointment is confirmed</p>
            </div>
            
            <div class="content">
              <p>Hi ${agentName},</p>
              
              <p>Great news! Your showing appointment has been confirmed. All parties have been notified and you're all set for the tour.</p>
              
              <div class="property-info">
                <h3 style="margin-top: 0; color: #1976d2;">🏠 Property Details</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Address</div>
                    <div class="info-value">${propertyAddress}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value">${formattedDate}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Time</div>
                    <div class="info-value">${showingTime}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Duration</div>
                    <div class="info-value">30-45 minutes</div>
                  </div>
                </div>
              </div>
              
              <div class="client-info">
                <h3 style="margin-top: 0; color: #7b1fa2;">👤 Client Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${buyerName}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value"><a href="mailto:${buyerEmail}">${buyerEmail}</a></div>
                  </div>
                  ${buyerPhone ? `
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value"><a href="tel:${buyerPhone}">${buyerPhone}</a></div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              ${listingAgent ? `
              <div class="listing-info">
                <h3 style="margin-top: 0; color: #2e7d32;">🏢 Listing Agent</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Agent</div>
                    <div class="info-value">${listingAgent}</div>
                  </div>
                  ${listingAgentPhone ? `
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value"><a href="tel:${listingAgentPhone}">${listingAgentPhone}</a></div>
                  </div>
                  ` : ''}
                </div>
              </div>
              ` : ''}
              
              ${showingInstructions ? `
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">📝 Showing Instructions</h4>
                <p style="margin-bottom: 0; font-size: 14px;">${showingInstructions}</p>
              </div>
              ` : ''}
              
              <div class="checklist">
                <h3 style="margin-top: 0; color: #f57c00;">📋 Pre-Showing Checklist</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Confirm with client:</strong> Send reminder 24 hours before</li>
                  <li><strong>Research property:</strong> Review listing details, photos, and comparable sales</li>
                  <li><strong>Prepare materials:</strong> Bring business cards, market reports, and showing agreements</li>
                  <li><strong>Check traffic/parking:</strong> Plan your route and arrival time</li>
                  <li><strong>Client communication:</strong> Confirm meeting location and any last-minute questions</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${buyerEmail}?subject=Showing Reminder - ${propertyAddress}&body=Hi ${buyerName},%0D%0A%0D%0AThis is a friendly reminder about our showing tomorrow at ${showingTime} for ${propertyAddress}.%0D%0A%0D%0APlease let me know if you have any questions or need to make any changes.%0D%0A%0D%0ABest regards,%0D%0A${agentName}" class="button">Send Client Reminder</a>
              </div>
              
              <h3>📱 Day-of-Showing Tips</h3>
              <ul>
                <li><strong>Arrive early:</strong> Be at the property 5-10 minutes before the client</li>
                <li><strong>Professional appearance:</strong> Dress appropriately and bring business materials</li>
                <li><strong>Document the visit:</strong> Take notes on client feedback and preferences</li>
                <li><strong>Follow-up:</strong> Send recap email within 24 hours after the showing</li>
              </ul>
              
              <div class="request-id">
                <strong>Request ID:</strong> ${requestId}<br>
                <small>Reference this ID for all communications about this showing</small>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>FirstLook Home Tours</strong><br>
              Agent Support & Operations<br>
              <a href="mailto:support@firstlookhometours.com">support@firstlookhometours.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "FirstLook Home Tours <noreply@firstlookhometours.com>",
      to: agentEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending agent showing confirmation:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Agent showing confirmation sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Agent showing confirmation sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-showing-confirmation-agent function:", error);
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