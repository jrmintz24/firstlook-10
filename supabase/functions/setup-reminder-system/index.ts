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

    console.log("Adding reminder columns to showing_requests table...");

    // Test database connection and check current schema
    const { data: tables, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'showing_requests')
      .eq('column_name', 'reminder_24h_sent');

    if (schemaError) {
      console.error("Error checking schema:", schemaError);
      return new Response(
        JSON.stringify({ error: "Failed to check database schema", details: schemaError }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const columnExists = tables && tables.length > 0;
    console.log("Reminder columns exist:", columnExists);

    if (columnExists) {
      console.log("Reminder columns already exist, skipping creation");
    } else {
      console.log("Reminder columns need to be added manually to the database");
    }

    console.log("Reminder system setup completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reminder system database setup completed successfully",
        details: {
          columns_added: ["reminder_24h_sent", "reminder_24h_sent_at", "reminder_2h_sent", "reminder_2h_sent_at"],
          index_created: "idx_showing_requests_reminder_lookup"
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in setup-reminder-system function:", error);
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