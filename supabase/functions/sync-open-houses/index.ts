
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpenHouseData {
  mls_id?: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  lot_size?: string;
  property_type?: string;
  year_built?: number;
  description?: string;
  open_house_date: string;
  open_house_start_time: string;
  open_house_end_time: string;
  listing_agent_name?: string;
  listing_agent_phone?: string;
  listing_agent_email?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
}

// Mock data generator for demonstration (replace with real API call)
function generateMockOpenHouses(): OpenHouseData[] {
  const dcNeighborhoods = [
    'Dupont Circle', 'Georgetown', 'Capitol Hill', 'Adams Morgan', 'Logan Circle',
    'Shaw', 'Foggy Bottom', 'Woodley Park', 'Cleveland Park', 'Columbia Heights'
  ];
  
  const properties: OpenHouseData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 20; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
    
    const neighborhood = dcNeighborhoods[Math.floor(Math.random() * dcNeighborhoods.length)];
    const address = `${Math.floor(Math.random() * 9999) + 1000} ${neighborhood} St NW`;
    
    properties.push({
      mls_id: `DC${Math.floor(Math.random() * 1000000)}`,
      address,
      city: 'Washington',
      state: 'DC',
      zip_code: `200${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
      price: Math.floor(Math.random() * 2000000) + 300000,
      beds: Math.floor(Math.random() * 5) + 1,
      baths: Math.floor(Math.random() * 4) + 1 + (Math.random() > 0.5 ? 0.5 : 0),
      sqft: Math.floor(Math.random() * 3000) + 800,
      lot_size: `${Math.floor(Math.random() * 8000) + 2000} sq ft`,
      property_type: ['Single Family', 'Townhouse', 'Condo', 'Cooperative'][Math.floor(Math.random() * 4)],
      year_built: Math.floor(Math.random() * 100) + 1924,
      description: `Beautiful ${neighborhood} property with modern amenities and great location.`,
      open_house_date: futureDate.toISOString().split('T')[0],
      open_house_start_time: ['10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00'][Math.floor(Math.random() * 5)],
      open_house_end_time: ['14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00'][Math.floor(Math.random() * 5)],
      listing_agent_name: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'David Brown'][Math.floor(Math.random() * 5)],
      listing_agent_phone: `(202) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      listing_agent_email: 'agent@example.com',
      images: ['/placeholder.svg'],
      latitude: 38.9072 + (Math.random() - 0.5) * 0.1,
      longitude: -77.0369 + (Math.random() - 0.5) * 0.1,
    });
  }
  
  return properties;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create sync log entry
    const { data: syncLog, error: syncLogError } = await supabaseClient
      .from('api_sync_logs')
      .insert({
        sync_type: 'open_houses',
        status: 'in_progress'
      })
      .select()
      .single()

    if (syncLogError) {
      throw new Error(`Failed to create sync log: ${syncLogError.message}`)
    }

    console.log('Starting open house sync...')

    // TODO: Replace with real API call
    // For now, using mock data for demonstration
    const openHouseData = generateMockOpenHouses()

    // Clear existing data (in production, you might want to update instead)
    await supabaseClient
      .from('open_houses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    // Insert new data
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('open_houses')
      .insert(openHouseData)

    if (insertError) {
      await supabaseClient
        .from('api_sync_logs')
        .update({
          status: 'error',
          error_message: insertError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncLog.id)

      throw new Error(`Failed to insert open houses: ${insertError.message}`)
    }

    // Update sync log as successful
    await supabaseClient
      .from('api_sync_logs')
      .update({
        status: 'success',
        records_processed: openHouseData.length,
        completed_at: new Date().toISOString()
      })
      .eq('id', syncLog.id)

    console.log(`Successfully synced ${openHouseData.length} open houses`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${openHouseData.length} open houses`,
        records_processed: openHouseData.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in sync-open-houses function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
