
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
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    let requestBody
    try {
      requestBody = await req.json()
      console.log('Request body received:', JSON.stringify(requestBody, null, 2))
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        message: parseError.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { endpoint, params, mlsId } = requestBody

    if (!endpoint) {
      console.error('Missing endpoint in request body')
      return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create Basic Auth header
    const credentials = btoa(`${SIMPLYRETS_USERNAME}:${SIMPLYRETS_PASSWORD}`)
    const authHeader = `Basic ${credentials}`
    console.log('Auth header created successfully')

    switch (endpoint) {
      case 'search': {
        console.log('Processing search request with params:', params)
        
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
        
        const searchUrl = `${SIMPLYRETS_BASE_URL}/properties?${mlsParams.toString()}`
        console.log('SimplyRETS search URL:', searchUrl)
        console.log('SimplyRETS search params:', mlsParams.toString())
        
        try {
          const response = await fetch(searchUrl, {
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          })
          
          console.log('SimplyRETS response status:', response.status)
          console.log('SimplyRETS response headers:', Object.fromEntries(response.headers.entries()))
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`SimplyRETS API error: ${response.status} ${response.statusText}`)
            console.error('SimplyRETS error response:', errorText)
            
            return new Response(JSON.stringify({
              error: 'SimplyRETS API error',
              message: `${response.status} ${response.statusText}`,
              details: errorText
            }), {
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          
          const data = await response.json()
          console.log('SimplyRETS returned', Array.isArray(data) ? data.length : 'non-array', 'results')
          
          return new Response(JSON.stringify({
            properties: data,
            pagination: {
              total: Array.isArray(data) ? data.length : 0,
              limit: parseInt(limit),
              lastId: Array.isArray(data) && data.length > 0 ? data[data.length - 1].mlsId : null
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
          
        } catch (fetchError) {
          console.error('Network error calling SimplyRETS:', fetchError)
          return new Response(JSON.stringify({
            error: 'Network error',
            message: fetchError.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
      
      case 'property': {
        if (!mlsId) {
          console.error('MLS ID missing for property endpoint')
          return new Response(JSON.stringify({ error: 'MLS ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        console.log('Fetching property details for MLS ID:', mlsId)
        
        try {
          const response = await fetch(`${SIMPLYRETS_BASE_URL}/properties/${mlsId}`, {
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          })
          
          console.log('Property fetch response status:', response.status)
          
          if (!response.ok) {
            if (response.status === 404) {
              return new Response(JSON.stringify({ error: 'Property not found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              })
            }
            const errorText = await response.text()
            console.error(`SimplyRETS property API error: ${response.status} ${response.statusText}`)
            console.error('Error response:', errorText)
            
            return new Response(JSON.stringify({
              error: 'SimplyRETS API error',
              message: `${response.status} ${response.statusText}`,
              details: errorText
            }), {
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          
          const property = await response.json()
          console.log('Property data retrieved successfully')
          
          return new Response(JSON.stringify(property), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
          
        } catch (fetchError) {
          console.error('Network error fetching property:', fetchError)
          return new Response(JSON.stringify({
            error: 'Network error',
            message: fetchError.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
      
      default:
        console.error('Invalid endpoint requested:', endpoint)
        return new Response(JSON.stringify({ 
          error: 'Invalid endpoint',
          validEndpoints: ['search', 'property'],
          received: endpoint
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
    
  } catch (error) {
    console.error('Unhandled error in SimplyRETS function:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
