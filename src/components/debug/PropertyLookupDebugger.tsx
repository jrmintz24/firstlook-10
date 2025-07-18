import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PropertyLookupDebugger = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchDebugData = async () => {
      try {
        console.log('🔍 [Debug] Fetching property lookup debug data for user:', user.id);
        
        // Get showing requests with MLS IDs
        const { data: showings, error: showingsError } = await supabase
          .from('showing_requests')
          .select('id, property_address, mls_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (showingsError) {
          console.error('🔍 [Debug] Error fetching showings:', showingsError);
          return;
        }

        // Get all properties and their MLS IDs and listing IDs
        const { data: properties, error: propertiesError } = await supabase
          .from('idx_properties')
          .select('mls_id, listing_id, address, price, beds, baths, sqft, images')
          .limit(20);

        if (propertiesError) {
          console.error('🔍 [Debug] Error fetching properties:', propertiesError);
          return;
        }

        // For each showing, try to find matching property by listing_id first, then mls_id
        const lookupResults = [];
        for (const showing of showings || []) {
          if (showing.mls_id) {
            const matchingPropertyByListingId = properties?.find(p => p.listing_id === showing.mls_id);
            const matchingPropertyByMlsId = properties?.find(p => p.mls_id === showing.mls_id);
            const matchingProperty = matchingPropertyByListingId || matchingPropertyByMlsId;
            
            lookupResults.push({
              showing,
              matchingProperty,
              hasMatch: !!matchingProperty,
              matchType: matchingPropertyByListingId ? 'listing_id' : (matchingPropertyByMlsId ? 'mls_id' : 'none')
            });
          }
        }

        const debugInfo = {
          user_id: user.id,
          showings: showings || [],
          properties: properties || [],
          lookupResults,
          totalShowings: showings?.length || 0,
          totalProperties: properties?.length || 0,
          successfulMatches: lookupResults.filter(r => r.hasMatch).length
        };

        console.log('🔍 [Debug] Complete property lookup debug data:', debugInfo);
        setDebugData(debugInfo);

      } catch (error) {
        console.error('🔍 [Debug] Error in property lookup debug:', error);
      }
    };

    fetchDebugData();
  }, [user]);

  if (!debugData) return <div className="p-4 bg-gray-100 rounded">Loading property lookup debug data...</div>;

  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
      <h3 className="font-bold mb-4 text-red-800">🔍 Property Lookup Debug Info</h3>
      
      <div className="space-y-4">
        <div>
          <strong>User ID:</strong> {debugData.user_id}
        </div>
        
        <div>
          <strong>Showing Requests:</strong> {debugData.totalShowings} | 
          <strong>Properties in DB:</strong> {debugData.totalProperties} | 
          <strong>Successful Matches:</strong> {debugData.successfulMatches}
        </div>

        <div>
          <strong>MLS ID Matching Results:</strong>
          <div className="bg-white p-3 rounded mt-2 max-h-60 overflow-auto">
            {debugData.lookupResults.map((result: any, index: number) => (
              <div key={index} className={`p-2 mb-2 rounded ${result.hasMatch ? 'bg-green-100' : 'bg-red-100'}`}>
                <div><strong>Showing MLS ID:</strong> {result.showing.mls_id}</div>
                <div><strong>Address:</strong> {result.showing.property_address}</div>
                <div><strong>Match Found:</strong> {result.hasMatch ? `✅ YES (${result.matchType})` : '❌ NO'}</div>
                {result.matchingProperty && (
                  <div className="mt-1 text-sm">
                    <div><strong>Property Price:</strong> ${result.matchingProperty.price}</div>
                    <div><strong>Beds/Baths:</strong> {result.matchingProperty.beds}bed/{result.matchingProperty.baths}bath</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <strong>All MLS IDs in Showing Requests:</strong>
          <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-40">
            {debugData.showings.map((s: any) => `${s.mls_id} - ${s.property_address}`).join('\n')}
          </pre>
        </div>

        <div>
          <strong>All IDs in Properties DB:</strong>
          <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-40">
            {debugData.properties.map((p: any) => `MLS: ${p.mls_id} | Listing: ${p.listing_id} | ${p.address} - $${p.price}`).join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PropertyLookupDebugger;