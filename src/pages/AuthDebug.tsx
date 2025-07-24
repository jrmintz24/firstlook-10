import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';

export default function AuthDebug() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testDirectOAuth = async () => {
    try {
      addLog('Starting OAuth test...');
      addLog(`Current URL: ${window.location.href}`);
      addLog(`Origin: ${window.location.origin}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true
        }
      });

      if (error) {
        addLog(`Error: ${JSON.stringify(error)}`);
      } else {
        addLog(`Success! OAuth URL: ${data?.url}`);
        addLog('Copy this URL and examine it for issues');
      }
    } catch (err) {
      addLog(`Exception: ${err}`);
    }
  };

  const checkSupabaseConfig = async () => {
    addLog('Checking Supabase configuration...');
    addLog(`Supabase URL: ${import.meta.env.VITE_SUPABASE_URL}`);
    
    // Test basic auth functionality
    const { data: { session } } = await supabase.auth.getSession();
    addLog(`Current session: ${session ? 'Active' : 'None'}`);
  };

  const testManualRedirect = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google`;
    addLog(`Manual OAuth URL: ${oauthUrl}`);
    window.open(oauthUrl, '_blank');
  };

  const checkCurrentUrl = () => {
    addLog('Current page URL analysis:');
    addLog(`Full URL: ${window.location.href}`);
    addLog(`Hash: ${window.location.hash}`);
    addLog(`Search params: ${window.location.search}`);
    
    // Check if there's an auth error in the URL
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    if (params.get('error') || hashParams.get('error')) {
      addLog(`Auth error found: ${params.get('error') || hashParams.get('error')}`);
      addLog(`Error description: ${params.get('error_description') || hashParams.get('error_description')}`);
    }
    
    if (params.get('code')) {
      addLog(`Auth code found: ${params.get('code')}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={checkSupabaseConfig}>
          Check Supabase Config
        </Button>
        
        <Button onClick={testDirectOAuth}>
          Test Direct OAuth (No Redirect)
        </Button>
        
        <Button onClick={testManualRedirect}>
          Test Manual OAuth (New Tab)
        </Button>
        
        <Button onClick={checkCurrentUrl}>
          Check Current URL
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Debug Logs:</h2>
        <pre className="text-xs whitespace-pre-wrap">
          {logs.join('\n') || 'No logs yet...'}
        </pre>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Check Supabase Config" first</li>
          <li>Click "Test Direct OAuth" to see the OAuth URL without redirecting</li>
          <li>Click "Test Manual OAuth" to open OAuth in a new tab</li>
          <li>Share the logs with your developer</li>
        </ol>
      </div>
    </div>
  );
}