
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/types/simplyrets';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    const initializeWidget = () => {
      try {
        if (window.ihfKestrel && containerRef.current) {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Set up property selection callback
          window.ihfKestrel.onPropertySelect = (propertyData: any) => {
            if (onPropertySelect) {
              // Transform iHomeFinder property data to our Property interface
              const transformedProperty = transformIHomefinderProperty(propertyData);
              onPropertySelect(transformedProperty);
            }
          };
          
          // Render the widget
          const widget = window.ihfKestrel.render();
          containerRef.current.appendChild(widget);
          setIsLoaded(true);
        } else {
          throw new Error('iHomeFinder Kestrel not available');
        }
      } catch (err) {
        console.error('Failed to initialize iHomeFinder widget:', err);
        setError('Failed to load property search widget. Please refresh the page.');
      }
    };

    // Check if Kestrel is already loaded
    if (window.ihfKestrel) {
      initializeWidget();
    } else {
      // Wait for Kestrel to load
      const checkKestrel = setInterval(() => {
        if (window.ihfKestrel) {
          clearInterval(checkKestrel);
          initializeWidget();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkKestrel);
        if (!isLoaded) {
          setError('Widget loading timed out. Please check your internet connection.');
        }
      }, 10000);
    }
  }, [onPropertySelect]);

  const transformIHomefinderProperty = (ihfProperty: any): Property => {
    // Transform iHomeFinder property data to our standardized Property interface
    // This mapping will need to be adjusted based on actual iHomeFinder data structure
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

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
              <p className="text-sm text-gray-500 mt-2">Connecting to MLS data</p>
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
        
        <div ref={containerRef} className="min-h-[400px] bg-white rounded-lg border" />
      </div>
    </div>
  );
};

export default IHomefinderWidget;
