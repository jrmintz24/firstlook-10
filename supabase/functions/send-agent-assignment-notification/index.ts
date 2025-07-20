import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AgentAssignmentData {
  agentName: string;
  agentEmail: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  properties: Array<{
    address: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
  }>;
  requestId: string;
  assignedBy?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      agentName,
      agentEmail,
      buyerName, 
      buyerEmail,
      buyerPhone,
      properties,
      requestId,
      assignedBy
    }: AgentAssignmentData = await req.json();

    console.log(`Sending agent assignment notification to ${agentEmail} for ${properties.length} properties`);

    const propertyCount = properties.length;
    const isMultiple = propertyCount > 1;
    
    const emailSubject = isMultiple 
      ? `New Tour Assignment: ${propertyCount} Properties for ${buyerName}`
      : `New Tour Assignment: ${properties[0]?.address} for ${buyerName}`;

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
          <title>New Tour Assignment</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .client-info { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .action-required { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button-outline { display: inline-block; background: transparent; color: #000; border: 2px solid #000; padding: 10px 22px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .client-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .client-detail { background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; }
            .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { font-size: 16px; margin-top: 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .request-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #666; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎯 New Tour Assignment</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You've been assigned a new client${isMultiple ? ' with multiple properties' : ''}</p>
            </div>
            
            <div class="content">
              <p>Hi ${agentName},</p>
              
              <p>Great news! You've been assigned a new tour request${isMultiple ? 's' : ''} from ${buyerName}. ${assignedBy ? `This assignment was made by ${assignedBy}.` : ''}</p>
              
              <div class="client-info">
                <h3 style="margin-top: 0; color: #1976d2;">👤 Client Information</h3>
                <div class="client-grid">
                  <div class="client-detail">
                    <div class="detail-label">Name</div>
                    <div class="detail-value">${buyerName}</div>
                  </div>
                  <div class="client-detail">
                    <div class="detail-label">Email</div>
                    <div class="detail-value"><a href="mailto:${buyerEmail}">${buyerEmail}</a></div>
                  </div>
                  ${buyerPhone ? `
                  <div class="client-detail">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value"><a href="tel:${buyerPhone}">${buyerPhone}</a></div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <h3>🏠 Property Request${isMultiple ? 's' : ''}</h3>
              <div style="margin: 25px 0;">
                ${propertiesHtml}
              </div>
              
              <div class="action-required">
                <h3 style="margin-top: 0; color: #f57c00;">⚡ Action Required</h3>
                <p style="margin-bottom: 15px;"><strong>Next Steps (within 24 hours):</strong></p>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Contact Client:</strong> Reach out to ${buyerName} to introduce yourself</li>
                  <li><strong>Confirm Details:</strong> Verify tour preferences and answer any questions</li>
                  <li><strong>Schedule Tours:</strong> Coordinate showing times with listing agents</li>
                  <li><strong>Send Agreement:</strong> Email the tour agreement for signature</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${buyerEmail}?subject=Tour Request - ${properties[0]?.address}&body=Hi ${buyerName},%0D%0A%0D%0AI'm ${agentName}, your assigned agent for the upcoming property tour${isMultiple ? 's' : ''}. I'm excited to help you with your home search!%0D%0A%0D%0ALet's connect to confirm the details and schedule your tour${isMultiple ? 's' : ''}." class="button">Email Client</a>
                <a href="tel:${buyerPhone || ''}" class="button-outline">Call Client</a>
              </div>
              
              <h3>📋 Tour Guidelines</h3>
              <ul>
                <li><strong>Preparation:</strong> Research properties, comparable sales, and neighborhood info</li>
                <li><strong>Documentation:</strong> Bring business cards, market reports, and agreement forms</li>
                <li><strong>Follow-up:</strong> Send recap email within 24 hours after tours</li>
                <li><strong>Pricing:</strong> First tour free, $99 for additional tours per our policy</li>
              </ul>
              
              <h3>🆘 Need Support?</h3>
              <ul>
                <li><strong>Admin Questions:</strong> Contact support for assignment details</li>
                <li><strong>Property Access:</strong> Coordinate with listing agents directly</li>
                <li><strong>Client Issues:</strong> Escalate any concerns immediately</li>
                <li><strong>Technical Help:</strong> Platform or scheduling assistance</li>
              </ul>
              
              <div class="request-id">
                <strong>Request ID:</strong> ${requestId}<br>
                <small>Reference this ID for all communications about this assignment</small>
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
      console.error("Error sending agent assignment notification:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Agent assignment notification sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Agent assignment notification sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-agent-assignment-notification function:", error);
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