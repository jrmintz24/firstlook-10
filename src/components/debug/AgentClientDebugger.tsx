import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AgentClientDebugger = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const runDebugTest = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const agentId = user.id;
      console.log('🔍 [AgentClientDebugger] Testing for agent:', agentId);
      
      const debugInfo: any = {
        agentId,
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Check agent_referrals table
      try {
        const { data: referrals, error: referralsError } = await supabase
          .from('agent_referrals')
          .select('*')
          .eq('agent_id', agentId);
        
        debugInfo.tests.agent_referrals = {
          success: !referralsError,
          error: referralsError?.message,
          count: referrals?.length || 0,
          data: referrals
        };
      } catch (err) {
        debugInfo.tests.agent_referrals = {
          success: false,
          error: err.message,
          count: 0
        };
      }

      // Test 2: Check buyer_agent_matches table  
      try {
        const { data: matches, error: matchesError } = await supabase
          .from('buyer_agent_matches')
          .select('*')
          .eq('agent_id', agentId);
        
        debugInfo.tests.buyer_agent_matches = {
          success: !matchesError,
          error: matchesError?.message,
          count: matches?.length || 0,
          data: matches
        };
      } catch (err) {
        debugInfo.tests.buyer_agent_matches = {
          success: false,
          error: err.message,
          count: 0
        };
      }

      // Test 3: Check showing_requests assigned to this agent
      try {
        const { data: showings, error: showingsError } = await supabase
          .from('showing_requests')
          .select('id, user_id, property_address, status, assigned_agent_id')
          .eq('assigned_agent_id', agentId)
          .eq('status', 'completed')
          .limit(10);
        
        debugInfo.tests.completed_showings = {
          success: !showingsError,
          error: showingsError?.message,
          count: showings?.length || 0,
          data: showings
        };
      } catch (err) {
        debugInfo.tests.completed_showings = {
          success: false,
          error: err.message,
          count: 0
        };
      }

      // Test 4: Check post_showing_actions for hired_agent
      try {
        const { data: actions, error: actionsError } = await supabase
          .from('post_showing_actions')
          .select('*')
          .eq('action_type', 'hired_agent')
          .limit(10);
        
        // Filter for this agent if action_details contains agent_id
        const agentActions = actions?.filter(action => 
          action.action_details?.agent_id === agentId
        ) || [];
        
        debugInfo.tests.hired_agent_actions = {
          success: !actionsError,
          error: actionsError?.message,
          total_count: actions?.length || 0,
          agent_count: agentActions.length,
          data: agentActions
        };
      } catch (err) {
        debugInfo.tests.hired_agent_actions = {
          success: false,
          error: err.message,
          count: 0
        };
      }

      // Test 5: Check profiles table access
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, user_type')
          .eq('id', agentId)
          .single();
        
        debugInfo.tests.agent_profile = {
          success: !profileError,
          error: profileError?.message,
          data: profile
        };
      } catch (err) {
        debugInfo.tests.agent_profile = {
          success: false,
          error: err.message
        };
      }

      console.log('🔍 [AgentClientDebugger] Complete debug results:', debugInfo);
      setDebugData(debugInfo);

    } catch (error) {
      console.error('🔍 [AgentClientDebugger] Debug test failed:', error);
      setDebugData({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDebugTest();
    }
  }, [user]);

  if (!user) return <div>Please log in to run debug test</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔍 Agent Client Connection Debugger
          <Button onClick={runDebugTest} disabled={loading}>
            {loading ? 'Testing...' : 'Re-run Test'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!debugData && loading && (
          <div>Running debug tests...</div>
        )}
        
        {debugData && (
          <div className="space-y-4">
            <div>
              <strong>Agent ID:</strong> {debugData.agentId}<br/>
              <strong>Timestamp:</strong> {debugData.timestamp}
            </div>

            {debugData.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <strong>Error:</strong> {debugData.error}
              </div>
            )}

            {debugData.tests && Object.entries(debugData.tests).map(([testName, result]: [string, any]) => (
              <div key={testName} className={`p-4 border rounded ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className="font-bold">{testName.replace(/_/g, ' ').toUpperCase()}</h4>
                <div>
                  <strong>Status:</strong> {result.success ? '✅ SUCCESS' : '❌ FAILED'}<br/>
                  {result.error && <><strong>Error:</strong> {result.error}<br/></>}
                  <strong>Count:</strong> {result.count || result.agent_count || 0}
                  {result.total_count && <> (Total: {result.total_count})</>}
                </div>
                
                {result.data && result.data.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">View Data</summary>
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentClientDebugger;