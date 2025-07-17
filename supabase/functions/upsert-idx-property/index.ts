import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { property } = await req.json()

    if (!property?.mlsId || !property?.address) {
      throw new Error('Missing required property data: mlsId and address are required')
    }

    console.log('Processing property data:', { mlsId: property.mlsId, address: property.address })

    // Clean and normalize property data
    const cleanedProperty = {
      mls_id: property.mlsId,
      listing_id: property.listingId || null,
      address: property.address,
      city: property.city || null,
      state: property.state || null,
      zip: property.zip || null,
      price: property.price ? parseFloat(property.price.replace(/[^0-9.]/g, '')) || null : null,
      beds: property.beds ? parseInt(property.beds) || null : null,
      baths: property.baths ? parseFloat(property.baths) || null : null,
      sqft: property.sqft ? parseInt(property.sqft.replace(/[^0-9]/g, '')) || null : null,
      lot_size: property.lotSize || null,
      year_built: property.yearBuilt ? parseInt(property.yearBuilt) || null : null,
      property_type: property.propertyType || null,
      status: property.status || 'active',
      description: property.description || null,
      features: property.features || [],
      images: property.images || [],
      virtual_tour_url: property.virtualTourUrl || null,
      latitude: property.latitude ? parseFloat(property.latitude) || null : null,
      longitude: property.longitude ? parseFloat(property.longitude) || null : null,
      agent_name: property.agentName || null,
      agent_phone: property.agentPhone || null,
      agent_email: property.agentEmail || null,
      ihf_page_url: property.pageUrl || null,
      raw_data: property
    }

    console.log('Cleaned property data:', cleanedProperty)

    // Upsert property data
    const { data, error } = await supabaseClient
      .from('idx_properties')
      .upsert(cleanedProperty, {
        onConflict: 'mls_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Successfully upserted property:', data.id)

    // Skip property view logging for now since table doesn't exist yet
    console.log('Property upserted successfully, skipping view logging')

    return new Response(
      JSON.stringify({ 
        success: true, 
        propertyId: data.id,
        mlsId: data.mls_id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})