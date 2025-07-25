import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/Auth0AuthContext';

const DatabaseDebugger = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchDebugData = async () => {
      try {
        console.log('🔍 [DEBUG] Fetching debug data for user:', user.id);
        
        // Get recent showing requests with property data
        const { data: showings, error: showingsError } = await supabase
          .from('showing_requests')
          .select(`
            *,
            idx_properties (
              id,
              mls_id,
              address,
              price,
              beds,
              baths,
              sqft,
              images,
              ihf_page_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (showingsError) {
          console.error('🔍 [DEBUG] Error fetching showings:', showingsError);
          return;
        }

        // Get all idx_properties
        const { data: allProps, error: propsError } = await supabase
          .from('idx_properties')
          .select('*')
          .limit(10);

        if (propsError) {
          console.error('🔍 [DEBUG] Error fetching properties:', propsError);
          return;
        }

        const debugInfo = {
          user_id: user.id,
          showing_requests: showings,
          all_properties: allProps,
          showing_count: showings?.length || 0,
          properties_count: allProps?.length || 0,
          linked_showings: showings?.filter(s => s.idx_properties).length || 0
        };

        console.log('🔍 [DEBUG] Complete debug data:', debugInfo);
        setDebugData(debugInfo);

      } catch (error) {
        console.error('🔍 [DEBUG] Error in debug fetch:', error);
      }
    };

    fetchDebugData();
  }, [user]);

  if (!debugData) return <div className="p-4 bg-gray-100 rounded">Loading debug data...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <h3 className="font-bold mb-4">🔍 Database Debug Info</h3>
      
      <div className="space-y-4">
        <div>
          <strong>User ID:</strong> {debugData.user_id}
        </div>
        
        <div>
          <strong>Showing Requests:</strong> {debugData.showing_count} total, {debugData.linked_showings} linked to properties
        </div>
        
        <div>
          <strong>Available Properties:</strong> {debugData.properties_count}
        </div>

        <div>
          <strong>Recent Showings:</strong>
          <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-60">
            {JSON.stringify(debugData.showing_requests, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Available Properties:</strong>
          <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-60">
            {JSON.stringify(debugData.all_properties, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDebugger;