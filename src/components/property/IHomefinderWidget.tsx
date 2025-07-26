import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Home, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIHomefinderScript } from '@/hooks/useIHomefinderScript';

interface IHomefinderWidgetProps {
  /** Property address for fallback display */
  address: string;
  /** MLS ID or property identifier for iHomefinder */
  mlsId?: string;
  /** Widget height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Loading state override */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** iHomefinder domain (e.g., 'your-site.ihomefinder.com') */
  domain?: string;
}

const IHomefinderWidget: React.FC<IHomefinderWidgetProps> = ({
  address,
  mlsId,
  height = 400,
  className,
  loading = false,
  error,
  domain = 'kestrel.idxhome.com'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  
  // Load iHomefinder script
  const { isLoaded: scriptLoaded, error: scriptError } = useIHomefinderScript({ domain });

  useEffect(() => {
    // If no domain is configured, show error immediately
    if (!domain) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if (!mlsId || loading || error) {
      setIsLoading(false);
      return;
    }

    // If script failed to load, show error
    if (scriptError) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // If script not loaded yet, keep loading
    if (!scriptLoaded) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';
    
    try {
      // Create script tag that will be replaced by ihfKestrel
      const script = document.createElement('script');
      script.innerHTML = `
        document.currentScript.replaceWith(ihfKestrel.render({
          "component": "propertyDetailsWidget",
          "mlsNumber": "${mlsId}",
          "showPhotos": true,
          "showMap": false
        }));
      `;
      
      container.appendChild(script);
      setIsLoading(false);
      setWidgetLoaded(true);
      
    } catch (err) {
      console.error('Error loading iHomefinder widget:', err);
      setHasError(true);
      setIsLoading(false);
    }
  }, [mlsId, scriptLoaded, scriptError, loading, error, domain]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4" style={{ height: `${height}px` }}>
            <div className="text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Loading property details...</p>
              <p className="text-xs text-gray-500 mt-1">{address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error || hasError || scriptError) {
    return (
      <Card className={cn("w-full border-orange-200 bg-orange-50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4" style={{ minHeight: '200px' }}>
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium mb-1">Property details unavailable</p>
              <p className="text-xs text-orange-600">
                {!domain ? 'iHomefinder domain not configured' : 
                 error || scriptError || 'Unable to load property widget'}
              </p>
              <div className="mt-3 p-3 bg-white rounded border">
                <div className="flex items-center gap-2 text-gray-700">
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-medium">{address}</span>
                </div>
                {mlsId && (
                  <p className="text-xs text-gray-500 mt-1">MLS ID: {mlsId}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show widget
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className="w-full"
          style={{ minHeight: `${height}px` }}
        />
        
        {/* Fallback info bar */}
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>{address}</span>
            {mlsId && <span>MLS #{mlsId}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IHomefinderWidget;