import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShowingReminderData {
  recipientName: string;
  recipientEmail: string;
  recipientType: 'buyer' | 'agent';
  propertyAddress: string;
  showingDate: string;
  showingTime: string;
  reminderType: '24h' | '2h';
  agentName?: string;
  agentPhone?: string;
  buyerName?: string;
  meetingLocation?: string;
  showingInstructions?: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      recipientName,
      recipientEmail,
      recipientType,
      propertyAddress,
      showingDate,
      showingTime,
      reminderType,
      agentName,
      agentPhone,
      buyerName,
      meetingLocation,
      showingInstructions,
      requestId
    }: ShowingReminderData = await req.json();

    console.log(`Sending ${reminderType} showing reminder to ${recipientType} ${recipientEmail} for ${propertyAddress}`);

    const formattedDate = new Date(showingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const timeUntilShowing = reminderType === '24h' ? 'tomorrow' : 'in 2 hours';
    const urgencyClass = reminderType === '2h' ? 'urgent' : 'standard';
    
    const emailSubject = reminderType === '24h' 
      ? `Reminder: Property Tour Tomorrow - ${propertyAddress}`
      : `🚨 Tour Starting Soon: ${propertyAddress} in 2 Hours`;

    // Different content based on recipient type
    const buyerContent = `
      <div class="highlight">
        <h3 style="margin-top: 0; color: #1976d2;">📍 Tour Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Property</div>
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
          ${agentName ? `
          <div class="info-item">
            <div class="info-label">Your Agent</div>
            <div class="info-value">${agentName}</div>
          </div>
          ` : ''}
        </div>
        ${meetingLocation ? `<p style="margin: 15px 0 5px 0;"><strong>Meeting Location:</strong> ${meetingLocation}</p>` : ''}
      </div>
      
      ${reminderType === '24h' ? `
      <div class="prep-reminder">
        <h3 style="margin-top: 0; color: #f57c00;">📋 Don't Forget to Prepare</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Questions:</strong> Prepare your list of questions about the property</li>
          <li><strong>Route:</strong> Check traffic and plan your travel time</li>
          <li><strong>Materials:</strong> Bring a notebook and comfortable shoes</li>
          <li><strong>ID:</strong> Bring identification if required</li>
        </ul>
      </div>
      ` : `
      <div class="urgent-reminder">
        <h3 style="margin-top: 0; color: #d32f2f;">⚡ Final Reminders</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Leave now:</strong> Check traffic and head to the property</li>
          <li><strong>Arrive early:</strong> Plan to be there 5 minutes before your agent</li>
          <li><strong>Contact agent:</strong> Call if you're running late</li>
        </ul>
      </div>
      `}
      
      ${agentPhone ? `
      <div style="text-align: center; margin: 20px 0;">
        <a href="tel:${agentPhone}" class="button">Call Your Agent</a>
      </div>
      ` : ''}
    `;

    const agentContent = `
      <div class="highlight">
        <h3 style="margin-top: 0; color: #1976d2;">📍 Showing Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Property</div>
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
          ${buyerName ? `
          <div class="info-item">
            <div class="info-label">Client</div>
            <div class="info-value">${buyerName}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      ${reminderType === '24h' ? `
      <div class="prep-reminder">
        <h3 style="margin-top: 0; color: #f57c00;">📋 Agent Checklist</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Research:</strong> Review property details and comparable sales</li>
          <li><strong>Materials:</strong> Prepare business cards and market reports</li>
          <li><strong>Client contact:</strong> Send confirmation to ${buyerName || 'client'}</li>
          <li><strong>Route:</strong> Plan your travel time and parking</li>
        </ul>
      </div>
      ` : `
      <div class="urgent-reminder">
        <h3 style="margin-top: 0; color: #d32f2f;">⚡ Final Checklist</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Depart now:</strong> Leave for the property</li>
          <li><strong>Arrive early:</strong> Be there 5-10 minutes before client</li>
          <li><strong>Materials ready:</strong> Business cards, reports, agreements</li>
          <li><strong>Contact client:</strong> Call if you're running late</li>
        </ul>
      </div>
      `}
    `;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Showing Reminder</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${reminderType === '2h' ? '#d32f2f' : '#000'}; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .prep-reminder { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .urgent-reminder { background: #ffebee; padding: 20px; border-radius: 8px; border-left: 4px solid #d32f2f; margin: 20px 0; }
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
              <h1 style="margin: 0; font-size: 24px;">${reminderType === '2h' ? '🚨' : '⏰'} Tour Reminder</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your property showing is ${timeUntilShowing}</p>
            </div>
            
            <div class="content">
              <p>Hi ${recipientName},</p>
              
              <p>This is a ${reminderType === '24h' ? 'friendly reminder' : 'final reminder'} about your ${recipientType === 'buyer' ? 'property tour' : 'showing appointment'} ${timeUntilShowing}.</p>
              
              ${recipientType === 'buyer' ? buyerContent : agentContent}
              
              ${showingInstructions ? `
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">📝 Special Instructions</h4>
                <p style="margin-bottom: 0; font-size: 14px;">${showingInstructions}</p>
              </div>
              ` : ''}
              
              ${reminderType === '24h' ? `
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #2e7d32;">💡 Tomorrow's Weather</h4>
                <p style="margin-bottom: 0;">Check the weather forecast and dress appropriately for your tour. Don't forget comfortable walking shoes!</p>
              </div>
              ` : `
              <div style="background: #ffebee; padding: 20px; border-radius: 8px; border-left: 4px solid #d32f2f; margin: 20px 0; text-align: center;">
                <h4 style="margin-top: 0; color: #d32f2f;">🕐 Time to Go!</h4>
                <p style="margin-bottom: 0; font-size: 18px; font-weight: bold;">Your tour starts in 2 hours. It's time to head to the property!</p>
              </div>
              `}
              
              <div class="request-id">
                <strong>Reference ID:</strong> ${requestId}
              </div>
            </div>
            
            <div class="footer">
              <p><strong>FirstLook Home Tours</strong><br>
              ${recipientType === 'buyer' ? 'Making home tours transparent and affordable' : 'Agent Support & Operations'}<br>
              <a href="mailto:support@firstlookhometours.com">support@firstlookhometours.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "FirstLook Home Tours <noreply@firstlookhometours.com>",
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending showing reminder:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Showing reminder sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${reminderType} showing reminder sent successfully to ${recipientType}`,
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-showing-reminder function:", error);
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