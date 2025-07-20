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

    console.log("Starting email integration diagnostics...");

    // Check recent showing requests and their user profiles
    const { data: recentRequests, error: requestsError } = await supabase
      .from('showing_requests')
      .select(`
        id,
        property_address,
        status,
        user_id,
        assigned_agent_email,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (requestsError) {
      console.error("Error fetching showing requests:", requestsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch showing requests", details: requestsError }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const diagnostics = {
      recentRequests: [],
      userProfiles: [],
      authUsers: []
    };

    // For each recent request, check the user profile and auth user
    for (const request of recentRequests || []) {
      diagnostics.recentRequests.push({
        id: request.id,
        property_address: request.property_address,
        status: request.status,
        user_id: request.user_id,
        assigned_agent_email: request.assigned_agent_email,
        created_at: request.created_at
      });

      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, user_type')
        .eq('id', request.user_id)
        .single();

      if (profile) {
        diagnostics.userProfiles.push({
          request_id: request.id,
          profile_id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          user_type: profile.user_type,
          has_email: !!profile.email
        });
      } else {
        diagnostics.userProfiles.push({
          request_id: request.id,
          profile_id: request.user_id,
          error: profileError?.message || "Profile not found"
        });
      }

      // Check auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(request.user_id);
      
      if (authUser?.user) {
        diagnostics.authUsers.push({
          request_id: request.id,
          auth_user_id: authUser.user.id,
          email: authUser.user.email,
          email_confirmed_at: authUser.user.email_confirmed_at,
          has_email: !!authUser.user.email
        });
      } else {
        diagnostics.authUsers.push({
          request_id: request.id,
          auth_user_id: request.user_id,
          error: authError?.message || "Auth user not found"
        });
      }
    }

    // Check confirmed showings for agent confirmation emails
    const { data: confirmedShowings, error: confirmedError } = await supabase
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
        preferred_time
      `)
      .eq('status', 'agent_confirmed')
      .order('created_at', { ascending: false })
      .limit(3);

    const agentDiagnostics = {
      confirmedShowings: confirmedShowings || [],
      agentProfiles: []
    };

    // Check agent profiles for confirmed showings
    for (const showing of confirmedShowings || []) {
      if (showing.assigned_agent_id) {
        const { data: agentProfile, error: agentError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, user_type')
          .eq('id', showing.assigned_agent_id)
          .single();

        if (agentProfile) {
          agentDiagnostics.agentProfiles.push({
            showing_id: showing.id,
            agent_profile_id: agentProfile.id,
            first_name: agentProfile.first_name,
            last_name: agentProfile.last_name,
            email: agentProfile.email,
            assigned_agent_email_field: showing.assigned_agent_email,
            has_profile_email: !!agentProfile.email,
            has_assigned_email: !!showing.assigned_agent_email
          });
        }
      }
    }

    console.log("Email integration diagnostics completed");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email integration diagnostics completed",
        diagnostics: {
          ...diagnostics,
          agent_diagnostics: agentDiagnostics,
          summary: {
            total_recent_requests: diagnostics.recentRequests.length,
            profiles_with_email: diagnostics.userProfiles.filter(p => p.has_email).length,
            auth_users_with_email: diagnostics.authUsers.filter(u => u.has_email).length,
            confirmed_showings: agentDiagnostics.confirmedShowings.length,
            agents_with_email: agentDiagnostics.agentProfiles.filter(a => a.has_profile_email).length
          }
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in diagnose-email-integration function:", error);
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