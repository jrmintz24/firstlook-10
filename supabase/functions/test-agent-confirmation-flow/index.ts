import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    console.log("Testing agent confirmation flow...");

    // Check for agent_confirmed showings
    const { data: confirmedShowings, error: showingsError } = await supabase
      .from('showing_requests')
      .select(`
        id,
        property_address,
        status,
        user_id,
        assigned_agent_id,
        assigned_agent_name,
        assigned_agent_email,
        preferred_date,
        preferred_time,
        created_at,
        updated_at
      `)
      .eq('status', 'agent_confirmed')
      .order('updated_at', { ascending: false })
      .limit(3);

    if (showingsError) {
      console.error("Error fetching confirmed showings:", showingsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch confirmed showings", details: showingsError }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const testResults = {
      confirmedShowings: confirmedShowings || [],
      buyerEmailTests: [],
      potentialIssues: []
    };

    // Test buyer email fetching for each confirmed showing
    for (const showing of confirmedShowings || []) {
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(showing.user_id);
        
        if (authError) {
          testResults.potentialIssues.push(`Cannot fetch buyer email for ${showing.id}: ${authError.message}`);
        }

        testResults.buyerEmailTests.push({
          showing_id: showing.id,
          property_address: showing.property_address,
          buyer_user_id: showing.user_id,
          buyer_email: authUser?.user?.email || null,
          agent_assigned: !!showing.assigned_agent_id,
          agent_name: showing.assigned_agent_name,
          email_fetch_success: !!authUser?.user?.email,
          error: authError?.message || null
        });

        // Test if we can send a confirmation email for this showing
        if (authUser?.user?.email && showing.assigned_agent_name) {
          try {
            console.log(`Testing email send for showing ${showing.id}...`);
            
            const emailTestPromise = supabase.functions.invoke('send-showing-confirmation-buyer', {
              body: {
                buyerId: showing.user_id,
                buyerName: "Test Buyer Name",
                agentName: showing.assigned_agent_name,
                agentEmail: showing.assigned_agent_email || "test@firstlookhometours.com",
                agentPhone: "+1 (555) 123-4567",
                propertyAddress: showing.property_address,
                showingDate: showing.preferred_date || "2025-01-25",
                showingTime: showing.preferred_time || "2:00 PM",
                meetingLocation: "Meet at the property",
                showingInstructions: "Test confirmation email",
                requestId: showing.id
              }
            });

            // Don't await - just test if it can be invoked
            testResults.buyerEmailTests[testResults.buyerEmailTests.length - 1].email_send_test = "attempted";
            
          } catch (emailError) {
            testResults.buyerEmailTests[testResults.buyerEmailTests.length - 1].email_send_error = emailError.message;
          }
        }
        
      } catch (error) {
        testResults.potentialIssues.push(`Error testing showing ${showing.id}: ${error.message}`);
      }
    }

    // Check recent showing request updates
    const { data: recentUpdates, error: updatesError } = await supabase
      .from('showing_requests')
      .select('id, status, updated_at, property_address')
      .order('updated_at', { ascending: false })
      .limit(5);

    const summary = {
      confirmed_showings_count: confirmedShowings?.length || 0,
      recent_updates: recentUpdates || [],
      emails_fetchable: testResults.buyerEmailTests.filter(t => t.email_fetch_success).length,
      potential_issues_count: testResults.potentialIssues.length
    };

    console.log("Agent confirmation flow test completed");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Agent confirmation flow test completed",
        test_results: testResults,
        summary: summary
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in test-agent-confirmation-flow function:", error);
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