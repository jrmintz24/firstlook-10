import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyDataDebuggerProps {
  address: string;
  idxPropertyId?: string | null;
}

const PropertyDataDebugger: React.FC<PropertyDataDebuggerProps> = ({ 
  address, 
  idxPropertyId 
}) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const info: any = {
      searchParams: {
        address,
        idxPropertyId
      },
      queries: {},
      results: {}
    };

    try {
      // 1. Check if idx_properties table exists and has any data
      const { data: allProperties, error: allError, count } = await supabase
        .from('idx_properties')
        .select('*', { count: 'exact' })
        .limit(5);
      
      info.queries.allPropertiesQuery = {
        query: "SELECT * FROM idx_properties LIMIT 5",
        error: allError,
        count,
        sampleData: allProperties
      };

      // 2. Try to find by IDX property ID if provided
      if (idxPropertyId) {
        const { data: byId, error: idError } = await supabase
          .from('idx_properties')
          .select('*')
          .or(`idx_id.eq.${idxPropertyId},mls_id.eq.${idxPropertyId}`)
          .limit(1);
        
        info.queries.byIdQuery = {
          query: `SELECT * FROM idx_properties WHERE idx_id = '${idxPropertyId}' OR mls_id = '${idxPropertyId}'`,
          error: idError,
          results: byId
        };
      }

      // 3. Try to find by address
      if (address) {
        const { data: byAddress, error: addressError } = await supabase
          .from('idx_properties')
          .select('*')
          .ilike('address', `%${address}%`)
          .limit(3);
        
        info.queries.byAddressQuery = {
          query: `SELECT * FROM idx_properties WHERE address ILIKE '%${address}%'`,
          error: addressError,
          results: byAddress
        };

        // 4. Try exact address match
        const { data: exactAddress, error: exactError } = await supabase
          .from('idx_properties')
          .select('*')
          .eq('address', address)
          .limit(1);
        
        info.queries.exactAddressQuery = {
          query: `SELECT * FROM idx_properties WHERE address = '${address}'`,
          error: exactError,
          results: exactAddress
        };
      }

      // 5. Check showing_requests table connection
      const { data: showingRequests, error: showingError } = await supabase
        .from('showing_requests')
        .select('id, property_address, idx_property_id')
        .ilike('property_address', `%${address}%`)
        .limit(3);
      
      info.queries.showingRequestsQuery = {
        query: `SELECT id, property_address, idx_property_id FROM showing_requests WHERE property_address ILIKE '%${address}%'`,
        error: showingError,
        results: showingRequests
      };

      setDebugInfo(info);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-red-800 text-sm">
          🐛 Property Data Debugger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs">
          <div><strong>Address:</strong> {address}</div>
          <div><strong>IDX Property ID:</strong> {idxPropertyId || 'None'}</div>
          
          <Button 
            onClick={runDiagnostics}
            disabled={loading}
            size="sm"
            variant="outline"
            className="mt-2"
          >
            {loading ? 'Running...' : 'Run Diagnostics'}
          </Button>

          {debugInfo && (
            <div className="mt-4 p-3 bg-white rounded border text-xs overflow-auto max-h-96">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDataDebugger;