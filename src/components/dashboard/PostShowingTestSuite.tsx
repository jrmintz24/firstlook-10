import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

const PostShowingTestSuite = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending' },
    { name: 'Post-Showing Actions Table', status: 'pending' },
    { name: 'Property Favorites Table', status: 'pending' },
    { name: 'Buyer-Agent Matches Table', status: 'pending' },
    { name: 'Agent Notifications Table', status: 'pending' },
    { name: 'Post-Showing Workflow Trigger', status: 'pending' },
    { name: 'Real-time Notifications', status: 'pending' },
    { name: 'Analytics Data Fetching', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const updateTestStatus = (testName: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status, message, duration }
        : test
    ));
  };

  const runTest = async (testName: string): Promise<void> => {
    const startTime = Date.now();
    updateTestStatus(testName, 'running');

    try {
      switch (testName) {
        case 'Database Connection':
          await supabase.from('profiles').select('count', { count: 'exact', head: true });
          break;

        case 'Post-Showing Actions Table':
          await supabase.from('post_showing_actions').select('*').limit(1);
          break;

        case 'Property Favorites Table':
          await supabase.from('property_favorites').select('*').limit(1);
          break;

        case 'Buyer-Agent Matches Table':
          await supabase.from('buyer_agent_matches').select('*').limit(1);
          break;

        case 'Agent Notifications Table':
          await supabase.from('agent_notifications').select('*').limit(1);
          break;

        case 'Post-Showing Workflow Trigger':
          // Test the edge function
          const { error: functionError } = await supabase.functions.invoke('post-showing-workflow', {
            body: { action: 'health_check' }
          });
          if (functionError) throw functionError;
          break;

        case 'Real-time Notifications':
          // Test real-time subscription
          const channel = supabase
            .channel('test-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'post_showing_actions' }, () => {})
            .subscribe();
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          supabase.removeChannel(channel);
          break;

        case 'Analytics Data Fetching':
          // Test analytics query
          const { data, error: analyticsError } = await supabase
            .from('showing_requests')
            .select('id, status, property_address')
            .eq('status', 'completed')
            .limit(5);
          
          if (analyticsError) throw analyticsError;
          break;

        default:
          throw new Error('Unknown test');
      }

      const duration = Date.now() - startTime;
      updateTestStatus(testName, 'success', 'Passed', duration);

    } catch (testError) {
      const duration = Date.now() - startTime;
      updateTestStatus(testName, 'error', testError instanceof Error ? testError.message : 'Unknown error', duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test.name);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'success').length;
    const totalTests = tests.length;
    
    toast({
      title: "Test Suite Complete",
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = tests.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Post-Showing System Test Suite
          </CardTitle>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Test Summary */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{totalTests}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  {test.message && (
                    <div className="text-sm text-gray-600">{test.message}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {test.duration && (
                  <span className="text-sm text-gray-500">{test.duration}ms</span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Testing Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Run tests to verify all post-showing components are working</li>
            <li>• Check database connectivity and table access</li>
            <li>• Validate real-time notifications and edge functions</li>
            <li>• Ensure analytics data can be fetched correctly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostShowingTestSuite;
