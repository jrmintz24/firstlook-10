import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
    
    console.log('[Simple Upsert] Received property data:', property)

    // Validate required fields
    if (!property?.mlsId || !property?.address) {
      console.error('[Simple Upsert] Missing required fields:', { 
        mlsId: property?.mlsId, 
        address: property?.address 
      })
      throw new Error('Missing required fields: mlsId and address')
    }

    // Simple data cleaning - focus on essential fields only
    const cleanedProperty = {
      idx_id: property.mlsId.toString().trim(), // Use idx_id as primary IDX identifier
      mls_id: property.mlsId.toString().trim(), // Keep mls_id for compatibility
      address: property.address.trim(),
      price: property.price ? parseFloat(property.price.replace(/[^0-9.]/g, '')) || null : null,
      beds: property.beds ? parseInt(property.beds.replace(/[^0-9]/g, '')) || null : null,
      baths: property.baths ? parseFloat(property.baths.replace(/[^0-9.]/g, '')) || null : null,
      sqft: property.sqft ? parseInt(property.sqft.replace(/[^0-9]/g, '')) || null : null,
      images: Array.isArray(property.images) ? property.images.slice(0, 10) : [],
      property_type: property.property_type || null,
      status: property.status || 'active',
      city: property.city || null,
      state: property.state || null,
      ihf_page_url: property.pageUrl || null,
      raw_data: property
    }

    console.log('[Simple Upsert] Cleaned property data:', cleanedProperty)

    // Upsert property data using idx_id as primary conflict resolution
    const { data, error } = await supabaseClient
      .from('idx_properties')
      .upsert(cleanedProperty, {
        onConflict: 'idx_id'
      })
      .select()
      .single()

    if (error) {
      console.error('[Simple Upsert] Database error:', error)
      throw error
    }

    console.log('[Simple Upsert] Success:', data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        propertyId: data.id,
        idxId: data.idx_id,
        mlsId: data.mls_id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('[Simple Upsert] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})