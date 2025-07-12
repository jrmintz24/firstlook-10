
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only execute once and when the container is available
    if (scriptExecutedRef.current || !containerRef.current) {
      return;
    }

    // Check if ihfKestrel is available
    const checkKestrelAndRender = () => {
      if (window.ihfKestrel && typeof window.ihfKestrel.render === 'function') {
        try {
          // Clear any existing content
          containerRef.current!.innerHTML = '';
          
          // Create and execute the embed script exactly as specified in iHomeFinder instructions
          const script = document.createElement('script');
          script.innerHTML = 'document.currentScript.replaceWith(ihfKestrel.render());';
          
          // Append to container and execute
          containerRef.current!.appendChild(script);
          scriptExecutedRef.current = true;
          setIsLoading(false);
          
        } catch (error) {
          console.error('Failed to render IDX embed widget:', error);
          setError('Failed to load IDX widget. Please try refreshing the page.');
          setIsLoading(false);
        }
      } else {
        // Check for BaseUrlMismatchError in console or global errors
        const errorHandler = (event: ErrorEvent) => {
          if (event.message && event.message.includes('BaseUrlMismatchError')) {
            setError('IDX widget is configured for www.firstlookhometours.com. The widget expects to be accessed at the /idx route on the authorized domain.');
            setIsLoading(false);
          }
        };
        
        window.addEventListener('error', errorHandler);
        
        // Retry checking for ihfKestrel after a short delay
        setTimeout(() => {
          if (!scriptExecutedRef.current) {
            checkKestrelAndRender();
          }
        }, 1000);
        
        // Cleanup event listener
        return () => window.removeEventListener('error', errorHandler);
      }
    };

    checkKestrelAndRender();
  }, []);

  // Show domain mismatch or other errors
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
                <br />• Access the widget at: <code>58695556-20e3-43d8-8b39-34dee2d61caa.lovableproject.com/idx</code>
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
