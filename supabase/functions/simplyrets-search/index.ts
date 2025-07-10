
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Updated SimplyRETS demo API configuration
const SIMPLYRETS_BASE_URL = 'https://api.simplyrets.com'
const SIMPLYRETS_USERNAME = 'simplyrets'
const SIMPLYRETS_PASSWORD = 'simplyrets'

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let requestBody
    try {
      requestBody = await req.json()
      console.log('Request body parsed successfully:', JSON.stringify(requestBody, null, 2))
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
    console.log('Created auth header for SimplyRETS demo API')

    switch (endpoint) {
      case 'search': {
        console.log('Processing search request with params:', JSON.stringify(params, null, 2))
        
        // Build SimplyRETS query parameters
        const mlsParams = new URLSearchParams()
        
        // For demo, we'll use simpler parameters that are more likely to work
        if (params?.cities) {
          // Split multiple cities and use the first one for demo
          const cityList = params.cities.split(',')
          mlsParams.set('cities', cityList[0].trim())
          console.log('Set city filter to:', cityList[0].trim())
        }
        
        if (params?.minPrice) {
          mlsParams.set('minprice', params.minPrice.toString())
          console.log('Set min price filter:', params.minPrice)
        }
        
        if (params?.maxPrice) {
          mlsParams.set('maxprice', params.maxPrice.toString())
          console.log('Set max price filter:', params.maxPrice)
        }
        
        if (params?.minBeds) {
          mlsParams.set('minbeds', params.minBeds.toString())
          console.log('Set min beds filter:', params.minBeds)
        }
        
        if (params?.minBaths) {
          mlsParams.set('minbaths', params.minBaths.toString())
          console.log('Set min baths filter:', params.minBaths)
        }
        
        if (params?.propertyType) {
          mlsParams.set('type', params.propertyType)
          console.log('Set property type filter:', params.propertyType)
        }
        
        // Set reasonable defaults for demo
        const limit = params?.limit || 10
        mlsParams.set('limit', limit.toString())
        
        if (params?.lastId) {
          mlsParams.set('lastId', params.lastId)
        }
        
        // Only active listings
        mlsParams.set('status', 'Active')
        
        // Construct the API URL
        const searchUrl = `${SIMPLYRETS_BASE_URL}/properties?${mlsParams.toString()}`
        console.log('Making request to SimplyRETS API:', searchUrl)
        console.log('Query parameters:', mlsParams.toString())
        
        try {
          const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
              'User-Agent': 'Lovable-App/1.0'
            },
          })
          
          console.log('SimplyRETS response status:', response.status)
          console.log('SimplyRETS response headers:', Object.fromEntries(response.headers.entries()))
          
          // Get response text first to check if it's HTML or JSON
          const responseText = await response.text()
          console.log('SimplyRETS response preview (first 500 chars):', responseText.substring(0, 500))
          
          if (!response.ok) {
            console.error(`SimplyRETS API error: ${response.status} ${response.statusText}`)
            
            // Check if response is HTML (404 page)
            if (responseText.includes('<!doctype html>') || responseText.includes('<html>')) {
              console.error('Received HTML response instead of JSON - likely incorrect endpoint')
              return new Response(JSON.stringify({
                error: 'SimplyRETS API endpoint error',
                message: `Got HTML response instead of JSON. Status: ${response.status}`,
                suggestion: 'The API endpoint might be incorrect for demo data',
                endpoint_used: searchUrl
              }), {
                status: 502,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              })
            }
            
            return new Response(JSON.stringify({
              error: 'SimplyRETS API error',
              message: `${response.status} ${response.statusText}`,
              details: responseText.substring(0, 1000)
            }), {
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          
          // Try to parse as JSON
          let data
          try {
            data = JSON.parse(responseText)
            console.log('Successfully parsed JSON response')
            console.log('Data type:', Array.isArray(data) ? 'array' : typeof data)
            console.log('Number of properties:', Array.isArray(data) ? data.length : 'not an array')
          } catch (jsonError) {
            console.error('Failed to parse response as JSON:', jsonError)
            return new Response(JSON.stringify({
              error: 'Invalid JSON response from SimplyRETS',
              message: 'API returned non-JSON data',
              response_preview: responseText.substring(0, 500)
            }), {
              status: 502,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          
          // Ensure data is an array
          const properties = Array.isArray(data) ? data : []
          
          return new Response(JSON.stringify({
            properties: properties,
            pagination: {
              total: properties.length,
              limit: parseInt(limit),
              lastId: properties.length > 0 ? properties[properties.length - 1].mlsId : null
            },
            debug: {
              endpoint_used: searchUrl,
              params_sent: Object.fromEntries(mlsParams),
              response_type: typeof data,
              is_array: Array.isArray(data)
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
          
        } catch (fetchError) {
          console.error('Network error calling SimplyRETS:', fetchError)
          return new Response(JSON.stringify({
            error: 'Network error',
            message: fetchError.message,
            endpoint: searchUrl
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
          const propertyUrl = `${SIMPLYRETS_BASE_URL}/properties/${mlsId}`
          console.log('Making property request to:', propertyUrl)
          
          const response = await fetch(propertyUrl, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
              'User-Agent': 'Lovable-App/1.0'
            },
          })
          
          console.log('Property response status:', response.status)
          
          if (!response.ok) {
            if (response.status === 404) {
              return new Response(JSON.stringify({ error: 'Property not found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              })
            }
            
            const errorText = await response.text()
            console.error(`SimplyRETS property API error: ${response.status} ${response.statusText}`)
            console.error('Error response:', errorText.substring(0, 500))
            
            return new Response(JSON.stringify({
              error: 'SimplyRETS API error',
              message: `${response.status} ${response.statusText}`,
              details: errorText.substring(0, 1000)
            }), {
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }
          
          const responseText = await response.text()
          const property = JSON.parse(responseText)
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
