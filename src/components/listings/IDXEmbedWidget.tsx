
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IDXEmbedWidgetProps {
  className?: string;
}

const IDXEmbedWidget = ({ className = '' }: IDXEmbedWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(`[IDX Debug]: ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    let pollAttempts = 0;
    const maxPollAttempts = 30; // 15 seconds max

    const tryRenderWidget = () => {
      addDebugInfo('Attempting to render IDX widget...');
      
      if (!containerRef.current) {
        addDebugInfo('Container ref not available');
        return false;
      }

      // Check if ihfKestrel is available
      if (!window.ihfKestrel) {
        addDebugInfo('window.ihfKestrel not available');
        return false;
      }

      if (typeof window.ihfKestrel.render !== 'function') {
        addDebugInfo('ihfKestrel.render is not a function');
        return false;
      }

      try {
        addDebugInfo('All prerequisites met, rendering widget...');
        
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Direct approach: call render and append result
        const widgetElement = window.ihfKestrel.render();
        
        if (!widgetElement) {
          addDebugInfo('ihfKestrel.render() returned null/undefined');
          return false;
        }
        
        addDebugInfo(`Widget element created: ${widgetElement.tagName || 'unknown'}`);
        containerRef.current.appendChild(widgetElement);
        
        addDebugInfo('Widget successfully rendered and appended');
        setIsLoading(false);
        setError(null);
        return true;
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        addDebugInfo(`Render failed: ${errorMessage}`);
        console.error('IDX render error:', err);
        
        // Try alternative approach: script injection
        try {
          addDebugInfo('Trying alternative script injection method...');
          const script = document.createElement('script');
          script.textContent = 'this.parentNode.replaceChild(ihfKestrel.render(), this);';
          containerRef.current.appendChild(script);
          
          addDebugInfo('Alternative method executed');
          setIsLoading(false);
          setError(null);
          return true;
        } catch (altErr) {
          addDebugInfo(`Alternative method also failed: ${altErr}`);
          return false;
        }
      }
    };

    const pollForKestrel = () => {
      pollAttempts++;
      addDebugInfo(`Polling attempt ${pollAttempts}/${maxPollAttempts}`);
      
      if (tryRenderWidget()) {
        return; // Success, stop polling
      }
      
      if (pollAttempts >= maxPollAttempts) {
        addDebugInfo('Max polling attempts reached');
        setError(
          `IDX widget failed to load after ${maxPollAttempts} attempts. ` +
          `iHomeFinder script status: ${!!window.ihfKestrel ? 'loaded' : 'not loaded'}. ` +
          `This may be due to network issues, domain restrictions, or configuration problems.`
        );
        setIsLoading(false);
        return;
      }
      
      // Continue polling
      setTimeout(pollForKestrel, 500);
    };

    // Start polling
    addDebugInfo('Starting IDX widget initialization...');
    pollForKestrel();

    // Cleanup function
    return () => {
      addDebugInfo('Component unmounting, cleaning up...');
    };
  }, []);

  // Error handler for global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('BaseUrlMismatchError')) {
        addDebugInfo('BaseUrlMismatchError detected');
        setError('IDX widget domain mismatch error detected. The widget is configured for a different domain.');
        setIsLoading(false);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className={className}>
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p><strong>IDX Loading Error:</strong></p>
              <p>{error}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Debug Information</summary>
                <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto bg-gray-100 p-2 rounded">
                  {debugInfo.map((info, index) => (
                    <div key={index}>{info}</div>
                  ))}
                </div>
              </details>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading IDX Property Search...</p>
              <p className="text-sm text-gray-500 mt-2">
                Connecting to iHomeFinder MLS data...
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-gray-400">Debug Info</summary>
                <div className="mt-2 text-xs space-y-1 max-h-20 overflow-y-auto">
                  {debugInfo.slice(-5).map((info, index) => (
                    <div key={index} className="text-gray-500">{info}</div>
                  ))}
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`idx-embed-widget ${className}`}>
      <div ref={containerRef} className="min-h-[500px] w-full border rounded-lg" />
      
      {/* Debug panel for successful loads in development */}
      {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-gray-400">Debug Log</summary>
          <div className="mt-1 text-xs space-y-1 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-gray-600">{info}</div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default IDXEmbedWidget;
