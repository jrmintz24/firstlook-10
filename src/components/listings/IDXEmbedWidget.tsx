
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IDXEmbedWidgetProps {
  className?: string;
}

const IDXEmbedWidget = ({ className = '' }: IDXEmbedWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptExecutedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only execute once and when the container is available
    if (scriptExecutedRef.current || !containerRef.current || !window.ihfKestrel) {
      return;
    }

    try {
      // Create and execute the embed script
      const script = document.createElement('script');
      script.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
      
      // Add error handling for domain mismatch
      window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('BaseUrlMismatchError')) {
          setError('IDX widget is configured for www.firstlookhometours.com. Please test on the production domain or contact iHomeFinder support to add this development domain.');
        }
      });
      
      // Append to container and execute
      containerRef.current.appendChild(script);
      scriptExecutedRef.current = true;
      
    } catch (error) {
      console.error('Failed to render IDX embed widget:', error);
      setError('Failed to load IDX widget. Please try refreshing the page.');
    }
  }, []);

  // Show domain mismatch error
  if (error) {
    return (
      <div className={className}>
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p><strong>IDX Configuration Issue:</strong></p>
              <p>{error}</p>
              <p className="text-sm">
                To resolve this, either:
                <br />• Deploy to www.firstlookhometours.com
                <br />• Contact iHomeFinder support to add this development domain
                <br />• Update your iHomeFinder Control Panel website settings
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state while iHomeFinder loads
  if (!window.ihfKestrel) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading IDX Property Search...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`idx-embed-widget ${className}`}>
      <div ref={containerRef} className="min-h-[500px] w-full" />
    </div>
  );
};

export default IDXEmbedWidget;
