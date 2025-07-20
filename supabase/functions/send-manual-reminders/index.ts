import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShowingWithProfiles {
  id: string;
  property_address: string;
  preferred_date: string;
  preferred_time: string;
  internal_notes: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  assigned_agent_name: string;
  assigned_agent_email: string;
  assigned_agent_phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reminderType } = await req.json(); // '24h' or '2h'
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const currentTime = new Date();
    
    console.log(`Processing ${reminderType} reminders at ${currentTime.toISOString()}`);

    // Calculate time windows for reminders
    let startWindow: Date, endWindow: Date;
    
    if (reminderType === '24h') {
      // 24h reminders: between 23-25 hours from now
      startWindow = new Date(currentTime.getTime() + 23 * 60 * 60 * 1000);
      endWindow = new Date(currentTime.getTime() + 25 * 60 * 60 * 1000);
    } else {
      // 2h reminders: between 1-3 hours from now
      startWindow = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);
      endWindow = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
    }

    // Get confirmed showings in the time window
    const { data: showings, error: fetchError } = await supabase
      .from('showing_requests')
      .select(`
        id,
        property_address,
        preferred_date,
        preferred_time,
        internal_notes,
        assigned_agent_name,
        assigned_agent_email,
        assigned_agent_phone,
        user_id
      `)
      .eq('status', 'agent_confirmed')
      .not('preferred_date', 'is', null)
      .not('preferred_time', 'is', null)
      .gte('preferred_date', startWindow.toISOString().split('T')[0])
      .lte('preferred_date', endWindow.toISOString().split('T')[0]);

    if (fetchError) {
      console.error("Error fetching showings:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch showings", details: fetchError }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (!showings || showings.length === 0) {
      console.log(`No showings found for ${reminderType} reminders`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `No showings found for ${reminderType} reminders`,
          processedCount: 0
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    let successCount = 0;
    let errorCount = 0;

    // Process each showing
    for (const showing of showings as any[]) {
      try {
        const showingDateTime = new Date(`${showing.preferred_date} ${showing.preferred_time}`);
        
        // Check if showing is in our time window
        if (showingDateTime >= startWindow && showingDateTime <= endWindow) {
          console.log(`Processing ${reminderType} reminder for showing ${showing.id}`);

          // Get buyer profile
          const { data: buyerProfile, error: buyerError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone')
            .eq('id', showing.user_id)
            .single();

          if (buyerError || !buyerProfile) {
            console.error(`Failed to get buyer profile for showing ${showing.id}:`, buyerError);
            errorCount++;
            continue;
          }

          // Send reminder to buyer
          const buyerReminderPromise = supabase.functions.invoke('send-showing-reminder', {
            body: {
              recipientName: `${buyerProfile.first_name} ${buyerProfile.last_name}`,
              recipientEmail: buyerProfile.email,
              recipientType: 'buyer',
              propertyAddress: showing.property_address,
              showingDate: showing.preferred_date,
              showingTime: showing.preferred_time,
              reminderType: reminderType,
              agentName: showing.assigned_agent_name,
              agentPhone: showing.assigned_agent_phone,
              requestId: showing.id
            }
          });

          // Send reminder to agent
          const agentReminderPromise = supabase.functions.invoke('send-showing-reminder', {
            body: {
              recipientName: showing.assigned_agent_name,
              recipientEmail: showing.assigned_agent_email,
              recipientType: 'agent',
              propertyAddress: showing.property_address,
              showingDate: showing.preferred_date,
              showingTime: showing.preferred_time,
              reminderType: reminderType,
              buyerName: `${buyerProfile.first_name} ${buyerProfile.last_name}`,
              showingInstructions: showing.internal_notes,
              requestId: showing.id
            }
          });

          // Wait for both emails to send
          const [buyerResult, agentResult] = await Promise.allSettled([
            buyerReminderPromise,
            agentReminderPromise
          ]);

          if (buyerResult.status === 'fulfilled' && agentResult.status === 'fulfilled') {
            successCount++;
            console.log(`Successfully sent ${reminderType} reminders for showing ${showing.id}`);
          } else {
            errorCount++;
            console.error(`Failed to send ${reminderType} reminders for showing ${showing.id}:`, {
              buyerError: buyerResult.status === 'rejected' ? buyerResult.reason : null,
              agentError: agentResult.status === 'rejected' ? agentResult.reason : null
            });
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing showing ${showing.id}:`, error);
      }
    }

    console.log(`${reminderType} reminder processing completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${reminderType} reminder processing completed`,
        processedCount: successCount + errorCount,
        successCount: successCount,
        errorCount: errorCount,
        reminderType: reminderType
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in send-manual-reminders function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);