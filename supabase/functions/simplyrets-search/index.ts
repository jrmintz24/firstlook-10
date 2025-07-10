import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SIMPLYRETS_BASE_URL = 'https://simplyrets.com/api'
const SIMPLYRETS_USERNAME = 'simplyrets'
const SIMPLYRETS_PASSWORD = 'simplyrets'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json()
    const { endpoint, params, mlsId } = requestBody

    // Create Basic Auth header
    const credentials = btoa(`${SIMPLYRETS_USERNAME}:${SIMPLYRETS_PASSWORD}`)
    const authHeader = `Basic ${credentials}`

    switch (endpoint) {
      case 'search': {
        // Build SimplyRETS query parameters from request body params
        const mlsParams = new URLSearchParams()
        
        // Location filters (DC/Baltimore area)
        const cities = params?.cities
        if (cities) {
          mlsParams.set('cities', cities)
        } else {
          // Default to DC/Baltimore area
          mlsParams.set('cities', 'Washington,Baltimore,Bethesda,Arlington,Alexandria,Silver Spring,Rockville,Gaithersburg,Annapolis')
        }
        
        // Price filters
        const minPrice = params?.minPrice
        const maxPrice = params?.maxPrice
        if (minPrice) mlsParams.set('minprice', minPrice.toString())
        if (maxPrice) mlsParams.set('maxprice', maxPrice.toString())
        
        // Property filters
        const minBeds = params?.minBeds
        const minBaths = params?.minBaths
        const propertyType = params?.propertyType
        
        if (minBeds) mlsParams.set('minbeds', minBeds.toString())
        if (minBaths) mlsParams.set('minbaths', minBaths.toString())
        if (propertyType) mlsParams.set('type', propertyType)
        
        // Pagination
        const limit = params?.limit || 20
        const lastId = params?.lastId
        
        mlsParams.set('limit', limit.toString())
        if (lastId) mlsParams.set('lastId', lastId)
        
        // Status filter - only active listings
        mlsParams.set('status', 'Active')
        
        console.log('SimplyRETS search params:', mlsParams.toString())
        
        const response = await fetch(`${SIMPLYRETS_BASE_URL}/properties?${mlsParams.toString()}`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`SimplyRETS API error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        return new Response(JSON.stringify({
          properties: data,
          pagination: {
            total: data.length,
            limit: parseInt(limit),
            lastId: data.length > 0 ? data[data.length - 1].mlsId : null
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      case 'property': {
        if (!mlsId) {
          return new Response(JSON.stringify({ error: 'MLS ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        console.log('Fetching property details for MLS ID:', mlsId)
        
        const response = await fetch(`${SIMPLYRETS_BASE_URL}/properties/${mlsId}`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            return new Response(JSON.stringify({ error: 'Property not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          throw new Error(`SimplyRETS API error: ${response.status} ${response.statusText}`)
        }
        
        const property = await response.json()
        
        return new Response(JSON.stringify(property), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
    
  } catch (error) {
    console.error('SimplyRETS API Error:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})