
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Property } from '@/types/simplyrets';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface IHomefinderWidgetProps {
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

// Extend the global window object to include iHomeFinder types
declare global {
  interface Window {
    ihfKestrel: {
      render: () => HTMLElement;
      config: {
        platform: string;
        activationToken: string;
      };
      onPropertySelect?: (propertyData: any) => void;
    };
  }
}

const IHomefinderWidget = ({ onPropertySelect, className = '' }: IHomefinderWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [scriptLoadAttempts, setScriptLoadAttempts] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);

  const addDebugInfo = useCallback((message: string) => {
    console.log(`[iHomeFinder Debug]: ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  // Ref callback to ensure container is available
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (node) {
      addDebugInfo('Container ref is now available');
      // Try to initialize if Kestrel is already loaded
      if (window.ihfKestrel && typeof window.ihfKestrel.render === 'function' && !isLoaded && !isInitializing) {
        initializeWidget();
      }
    }
  }, [isLoaded, isInitializing]);

  const transformIHomefinderProperty = (ihfProperty: any): Property => {
    // Transform iHomeFinder property data to our standardized Property interface
    return {
      mlsId: `IHF${ihfProperty.mlsNumber || ihfProperty.id || Date.now()}`,
      listPrice: ihfProperty.listPrice || ihfProperty.price || 0,
      listDate: ihfProperty.listDate || new Date().toISOString(),
      modificationTimestamp: ihfProperty.modificationTimestamp || new Date().toISOString(),
      address: {
        streetNumber: ihfProperty.streetNumber || '',
        streetName: ihfProperty.streetName || '',
        city: ihfProperty.city || '',
        state: ihfProperty.state || '',
        postalCode: ihfProperty.postalCode || ihfProperty.zipCode || '',
        country: 'US',
        full: ihfProperty.fullAddress || `${ihfProperty.streetNumber || ''} ${ihfProperty.streetName || ''}, ${ihfProperty.city || ''}, ${ihfProperty.state || ''} ${ihfProperty.postalCode || ihfProperty.zipCode || ''}`.trim()
      },
      geo: {
        lat: ihfProperty.latitude || ihfProperty.lat || 0,
        lng: ihfProperty.longitude || ihfProperty.lng || 0
      },
      property: {
        bedrooms: ihfProperty.bedrooms || ihfProperty.beds || 0,
        bathsFull: ihfProperty.bathsFull || ihfProperty.baths || 0,
        bathsHalf: ihfProperty.bathsHalf || 0,
        area: ihfProperty.squareFeet || ihfProperty.area || 0,
        type: ihfProperty.propertyType || 'Single Family',
        subType: ihfProperty.propertySubType || 'Detached'
      },
      listingAgent: {
        name: ihfProperty.listingAgent?.name || 'iHomeFinder Agent',
        phone: ihfProperty.listingAgent?.phone || '',
        email: ihfProperty.listingAgent?.email || ''
      },
      office: {
        name: ihfProperty.listingOffice?.name || 'iHomeFinder Office'
      },
      photos: ihfProperty.photos || [],
      remarks: ihfProperty.remarks || ihfProperty.description || 'Property via iHomeFinder',
      status: ihfProperty.status || 'Active',
      mls: {
        status: ihfProperty.status || 'Active',
        area: ihfProperty.area || ihfProperty.city || '',
        daysOnMarket: ihfProperty.daysOnMarket || 0
      }
    };
  };

  const initializeWidget = useCallback(() => {
    if (isInitializing) {
      addDebugInfo('Already initializing, skipping...');
      return;
    }

    setIsInitializing(true);
    addDebugInfo('Starting widget initialization...');
    
    try {
      // Check if container ref is available
      if (!containerRef.current) {
        throw new Error('Container ref is not available - DOM element not yet rendered');
      }
      
      // Check if iHomeFinder Kestrel is available
      if (!window.ihfKestrel) {
        throw new Error('window.ihfKestrel is not available - script may not have loaded');
      }
      
      if (typeof window.ihfKestrel.render !== 'function') {
        throw new Error('ihfKestrel.render is not a function - API may have changed');
      }

      addDebugInfo('All prerequisites met, rendering widget...');
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Set up property selection callback
      window.ihfKestrel.onPropertySelect = (propertyData: any) => {
        addDebugInfo(`Property selected: ${JSON.stringify(propertyData)}`);
        if (onPropertySelect) {
          const transformedProperty = transformIHomefinderProperty(propertyData);
          onPropertySelect(transformedProperty);
        }
      };
      
      // Render the widget
      const widget = window.ihfKestrel.render();
      addDebugInfo(`Widget element created: ${!!widget}`);
      
      if (!widget) {
        throw new Error('ihfKestrel.render() returned null or undefined');
      }
      
      containerRef.current.appendChild(widget);
      setIsLoaded(true);
      setError(null);
      addDebugInfo('Widget successfully initialized and rendered');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      addDebugInfo(`Widget initialization failed: ${errorMessage}`);
      console.error('Failed to initialize iHomeFinder widget:', err);
      setError(`Widget initialization failed: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  }, [onPropertySelect, addDebugInfo, isInitializing]);

  const retryInitialization = () => {
    addDebugInfo('Manual retry initiated...');
    setError(null);
    setIsLoaded(false);
    setScriptLoadAttempts(prev => prev + 1);
    
    // Force a check after a brief delay
    setTimeout(() => {
      if (window.ihfKestrel && containerRef.current) {
        initializeWidget();
      } else {
        addDebugInfo(`Retry failed - Kestrel: ${!!window.ihfKestrel}, Container: ${!!containerRef.current}`);
        setError('iHomeFinder Kestrel still not available after retry. Please check your internet connection or contact support.');
      }
    }, 1000);
  };

  // Use useLayoutEffect to ensure DOM is ready before initialization
  useLayoutEffect(() => {
    addDebugInfo('useLayoutEffect: Component mounted, checking initialization readiness...');
    
    // Check if both prerequisites are met
    if (window.ihfKestrel && 
        typeof window.ihfKestrel.render === 'function' && 
        containerRef.current && 
        !isLoaded && 
        !isInitializing) {
      
      addDebugInfo('useLayoutEffect: Both Kestrel and container ready, initializing...');
      initializeWidget();
    } else {
      addDebugInfo(`useLayoutEffect: Not ready - Kestrel: ${!!window.ihfKestrel}, Container: ${!!containerRef.current}, Loaded: ${isLoaded}, Initializing: ${isInitializing}`);
    }
  }, [initializeWidget, isLoaded, isInitializing]);

  // Fallback polling for Kestrel availability
  useEffect(() => {
    if (isLoaded || isInitializing) return;

    addDebugInfo('Starting fallback polling for Kestrel availability...');
    
    const pollInterval = setInterval(() => {
      if (window.ihfKestrel && 
          typeof window.ihfKestrel.render === 'function' && 
          containerRef.current && 
          !isLoaded && 
          !isInitializing) {
        
        addDebugInfo('Polling: Kestrel became available, initializing...');
        clearInterval(pollInterval);
        initializeWidget();
      }
    }, 500); // Check every 500ms

    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (!isLoaded && !isInitializing) {
        addDebugInfo('Polling timeout reached, widget failed to load');
        
        let errorMsg = 'iHomeFinder widget failed to load within 15 seconds. ';
        
        if (!window.ihfKestrel) {
          errorMsg += 'The iHomeFinder script did not load properly. This could be due to network issues, domain restrictions, or the activation token not being authorized for this domain.';
        } else if (!containerRef.current) {
          errorMsg += 'Container element is not available.';
        } else if (typeof window.ihfKestrel.render !== 'function') {
          errorMsg += 'The iHomeFinder script loaded but the render function is not available.';
        }
        
        setError(errorMsg);
      }
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [initializeWidget, isLoaded, isInitializing]);

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>iHomeFinder Widget Error:</strong></p>
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryInitialization}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        {/* Debug information (only show in development) */}
        {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-gray-600">{info}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading iHomeFinder Property Search...</p>
              <p className="text-sm text-gray-500 mt-2">
                {isInitializing ? 'Initializing widget...' : 'Connecting to MLS data...'}
              </p>
              {scriptLoadAttempts > 0 && (
                <p className="text-xs text-gray-400 mt-1">Attempt {scriptLoadAttempts + 1}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Live MLS Data:</strong> You're now viewing real property listings via iHomeFinder. 
            Select any property to add it to your tour request.
          </AlertDescription>
        </Alert>
        
        <div ref={setContainerRef} className="min-h-[400px] bg-white rounded-lg border" />
        
        {/* Debug panel for development */}
        {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">Debug Information</summary>
            <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-600">{info}</div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default IHomefinderWidget;
