import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShowingConfirmationBuyerData {
  buyerId?: string; // New field to fetch email if not provided
  buyerName: string;
  buyerEmail?: string; // Made optional - will fetch if not provided
  agentName: string;
  agentEmail?: string;
  agentPhone?: string;
  propertyAddress: string;
  showingDate: string;
  showingTime: string;
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
    console.log('===== BUYER EMAIL FUNCTION CALLED =====');
    console.log('Function started successfully');
    
    const { 
      buyerId,
      buyerName,
      buyerEmail: providedBuyerEmail,
      agentName,
      agentEmail,
      agentPhone,
      propertyAddress,
      showingDate,
      showingTime,
      meetingLocation,
      showingInstructions,
      requestId
    }: ShowingConfirmationBuyerData = await req.json();
    
    console.log('Request payload received:', JSON.stringify({
      buyerId, buyerName, providedBuyerEmail, agentName, propertyAddress, requestId
    }, null, 2));

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
          return new Response(
            JSON.stringify({ error: "Failed to fetch buyer email" }),
            { 
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
      }
    }
    
    if (!buyerEmail) {
      return new Response(
        JSON.stringify({ error: "Buyer email is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Sending showing confirmation to buyer ${buyerEmail} for ${propertyAddress}`);

    const formattedDate = new Date(showingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailSubject = `Tour Agreement Required: ${propertyAddress} - Sign to Confirm Showing`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Tour is Confirmed - Please Sign Agreement</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .action-required { background: #ffebee; padding: 20px; border-radius: 8px; border-left: 4px solid #f44336; margin: 20px 0; }
            .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .specialist-info { background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin: 20px 0; }
            .prep-info { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .info-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 16px; margin-top: 5px; }
            .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .button-primary { display: inline-block; background: #f44336; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
            .button-outline { display: inline-block; background: transparent; color: #000; border: 2px solid #000; padding: 10px 22px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .request-id { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #666; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📋 Agreement Required</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">A Showing Specialist is ready to show you this property</p>
            </div>
            
            <div class="content">
              <p>Hi ${buyerName},</p>
              
              <p>Great news! A professional Showing Specialist is ready to show you this property. <strong>However, your tour is NOT yet confirmed.</strong></p>
              
              <p><strong>To confirm your showing, you must first sign the single-day tour agreement.</strong> This quick digital signature takes less than 30 seconds and is required before any showing can proceed.</p>
              
              <div class="action-required">
                <h3 style="margin-top: 0; color: #d32f2f;">⚠️ REQUIRED: Sign Tour Agreement First</h3>
                <p style="margin: 10px 0;"><strong>Your showing CANNOT proceed without this signed agreement.</strong> This protects both you and the property owner during the tour.</p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="https://firstlookhometours.com/dashboard" class="button-primary">SIGN AGREEMENT TO CONFIRM TOUR →</a>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;"><strong>Only after signing will your tour be officially confirmed.</strong> You'll then receive final tour details and instructions.</p>
              </div>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #1976d2;">📍 Proposed Tour Details</h3>
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
                  <div class="info-item">
                    <div class="info-label">Duration</div>
                    <div class="info-value">30-45 minutes</div>
                  </div>
                </div>
                <p style="margin: 15px 0 5px 0; color: #e65100; font-weight: bold;">⚠️ These times are TENTATIVE until you sign the agreement</p>
                ${meetingLocation ? `<p style="margin: 15px 0 5px 0;"><strong>Meeting Location:</strong> ${meetingLocation}</p>` : ''}
              </div>
              
              <div class="specialist-info">
                <h3 style="margin-top: 0; color: #7b1fa2;">👤 Your Assigned Showing Specialist: ${agentName}</h3>
                <p style="margin: 10px 0;"><strong>This specialist is ready to show you the property.</strong> However, they cannot proceed until you complete the required tour agreement.</p>
                <div class="info-grid">
                  ${agentEmail ? `
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value"><a href="mailto:${agentEmail}">${agentEmail}</a></div>
                  </div>
                  ` : ''}
                  ${agentPhone ? `
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value"><a href="tel:${agentPhone}">${agentPhone}</a></div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              ${showingInstructions ? `
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">📝 Special Instructions</h4>
                <p style="margin-bottom: 0; font-size: 14px;">${showingInstructions}</p>
              </div>
              ` : ''}
              
              <div class="prep-info">
                <h3 style="margin-top: 0; color: #f57c00;">📋 How to Prepare for Your Tour</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Arrive on time:</strong> Plan to arrive a few minutes early</li>
                  <li><strong>Bring questions:</strong> Prepare a list of questions about the property and neighborhood</li>
                  <li><strong>Take notes:</strong> Bring a notebook or use your phone to record thoughts</li>
                  <li><strong>Wear appropriate shoes:</strong> Comfortable shoes for walking through the property</li>
                  <li><strong>Bring ID:</strong> Some properties may require identification</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://firstlookhometours.com/dashboard" class="button-primary">SIGN AGREEMENT TO CONFIRM →</a>
                <p style="margin: 15px 0; font-size: 14px; color: #666;">Questions? Contact us through your dashboard after signing the agreement.</p>
              </div>
              
              <h3>🏠 What to Expect During Your Tour</h3>
              <ul>
                <li><strong>Property walkthrough:</strong> See every room and space in the home</li>
                <li><strong>Neighborhood insights:</strong> Learn about the area, schools, and amenities</li>
                <li><strong>Market information:</strong> Get comparable sales and pricing insights</li>
                <li><strong>No pressure:</strong> This is an informational tour with no obligation</li>
                <li><strong>Professional guidance:</strong> Ask questions and get expert opinions</li>
              </ul>
              
              <h3>📱 Need to Reschedule?</h3>
              <p><strong>First, sign the agreement to confirm your tour.</strong> Then, if you need to reschedule, you can contact your specialist through the platform messaging system.</p>
              
              <div style="background: #ffe0b2; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #e65100;">🔒 Single-Day Tour Agreement Required</h4>
                <p style="margin-bottom: 10px;"><strong>This is NOT optional.</strong> The single-day tour agreement:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Must be signed before any showing</strong></li>
                  <li>Protects both you and the property owner</li>
                  <li>Covers only this one property tour</li>
                  <li>Takes less than 30 seconds to complete digitally</li>
                  <li>Activates your tour confirmation</li>
                </ul>
                <p style="margin-bottom: 0; font-weight: bold; color: #d32f2f;">⚠️ NO AGREEMENT = NO TOUR. Sign now or your showing request will expire.</p>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #2e7d32;">💡 Pro Tip</h4>
                <p style="margin-bottom: 0;">Take photos (with permission) and notes during your tour. This will help you remember details when comparing multiple properties!</p>
              </div>
              
              <div class="request-id">
                <strong>Tour ID:</strong> ${requestId}<br>
                <small>Reference this ID if you need to contact support</small>
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

    // Send to actual buyer email
    const finalEmailAddress = buyerEmail;
    console.log('About to send email with Resend API to actual buyer:', finalEmailAddress);
    console.log('Email subject:', emailSubject);
    
    const { data, error } = await resend.emails.send({
      from: "FirstLook Home Tours <noreply@firstlookhometours.com>",
      to: finalEmailAddress,
      subject: emailSubject,
      html: emailHtml,
    });
    
    console.log('===== BUYER EMAIL SEND ATTEMPT =====');
    console.log('Resend API response - Data:', JSON.stringify(data, null, 2));
    console.log('Resend API response - Error:', JSON.stringify(error, null, 2));
    console.log('Email sent to:', finalEmailAddress);
    console.log('Email subject:', emailSubject);
    console.log('===== END BUYER EMAIL DEBUG =====');

    if (error) {
      console.error("Error sending buyer showing confirmation:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Buyer showing confirmation sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Buyer showing confirmation sent successfully",
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-showing-confirmation-buyer function:", error);
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