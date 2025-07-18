import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.error('Google Places API key not found');
      return new Response(
        JSON.stringify({ error: 'Google Places API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { input, placeId } = await req.json();
    
    if (!input && !placeId) {
      return new Response(
        JSON.stringify({ error: 'Input or placeId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Making Google Places API request for input:', input, 'placeId:', placeId);

    // If placeId is provided, get place details for full address
    if (placeId) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,address_components,geometry&key=${apiKey}`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      if (!detailsResponse.ok) {
        console.error('Google Places Details API error:', detailsData);
        return new Response(
          JSON.stringify({ 
            error: 'Google Places Details API request failed',
            details: detailsData.error_message || 'Unknown error'
          }),
          { 
            status: detailsResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify(detailsData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call Google Places Autocomplete API with broader location types
    // Removed restrictive types parameter to allow all location types while keeping US-only
    // Note: This API key must be configured for server-side use (not browser/referrer restricted)
    const placesUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:us&key=${apiKey}`;
    
    const response = await fetch(placesUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API error:', data);
      
      // Handle specific Google Places API errors
      if (data.error_message?.includes('API keys with referer restrictions cannot be used with this API')) {
        return new Response(
          JSON.stringify({ 
            error: 'API key configuration error. Please use a server-side API key without referrer restrictions.',
            details: data.error_message 
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Google Places API request failed',
          details: data.error_message || 'Unknown error'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Google Places API response status:', data.status);
    console.log('Google Places API predictions count:', data.predictions?.length || 0);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in google-places function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
