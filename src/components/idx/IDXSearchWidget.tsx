
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/types/simplyrets';

interface IDXSearchWidgetProps {
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

const IDXSearchWidget = ({ onPropertySelect, className = '' }: IDXSearchWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load iHomeFinder IDX widget script
    const script = document.createElement('script');
    script.src = 'https://www.ihomefinder.com/js/ihf-widget.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      initializeIDXWidget();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeIDXWidget = () => {
    if (containerRef.current && window.IHF) {
      // Initialize the IDX widget
      window.IHF.init({
        container: containerRef.current,
        widgetType: 'search',
        onPropertyClick: handlePropertyClick,
        // Add your demo account configuration here
        theme: {
          primaryColor: '#1f2937',
          fontFamily: 'Inter, sans-serif'
        }
      });
    }
  };

  const handlePropertyClick = (idxProperty: any) => {
    // Convert IDX property data to our Property interface
    const mappedProperty = mapIDXToProperty(idxProperty);
    if (onPropertySelect && mappedProperty) {
      onPropertySelect(mappedProperty);
    }
  };

  const mapIDXToProperty = (idxProperty: any): Property | null => {
    try {
      return {
        mlsId: idxProperty.mlsNumber || idxProperty.id || '',
        listPrice: parseFloat(idxProperty.price) || 0,
        listDate: idxProperty.listDate || new Date().toISOString(),
        modificationTimestamp: idxProperty.modifiedDate || new Date().toISOString(),
        address: {
          streetNumber: idxProperty.streetNumber || '',
          streetName: idxProperty.streetName || '',
          unit: idxProperty.unit || undefined,
          city: idxProperty.city || '',
          state: idxProperty.state || '',
          postalCode: idxProperty.zipCode || '',
          country: 'US',
          full: idxProperty.fullAddress || `${idxProperty.streetNumber} ${idxProperty.streetName}, ${idxProperty.city}, ${idxProperty.state} ${idxProperty.zipCode}`
        },
        geo: {
          lat: parseFloat(idxProperty.latitude) || 0,
          lng: parseFloat(idxProperty.longitude) || 0
        },
        property: {
          bedrooms: parseInt(idxProperty.bedrooms) || 0,
          bathsFull: parseInt(idxProperty.fullBaths) || 0,
          bathsHalf: parseInt(idxProperty.halfBaths) || 0,
          area: parseInt(idxProperty.squareFeet) || 0,
          type: idxProperty.propertyType || 'Single Family',
          subType: idxProperty.propertySubType || '',
          yearBuilt: parseInt(idxProperty.yearBuilt) || undefined,
          lotSize: parseInt(idxProperty.lotSize) || undefined,
          stories: parseInt(idxProperty.stories) || undefined,
          parking: {
            spaces: parseInt(idxProperty.parkingSpaces) || undefined,
            type: idxProperty.parkingType || undefined
          },
          roof: idxProperty.roofType || undefined,
          cooling: idxProperty.cooling || undefined,
          heating: idxProperty.heating || undefined,
          flooring: idxProperty.flooring ? [idxProperty.flooring] : undefined
        },
        listingAgent: {
          name: idxProperty.listingAgent?.name || undefined,
          phone: idxProperty.listingAgent?.phone || undefined,
          email: idxProperty.listingAgent?.email || undefined
        },
        coListingAgent: idxProperty.coListingAgent ? {
          name: idxProperty.coListingAgent.name || undefined,
          phone: idxProperty.coListingAgent.phone || undefined,
          email: idxProperty.coListingAgent.email || undefined
        } : undefined,
        office: {
          name: idxProperty.listingOffice?.name || undefined,
          phone: idxProperty.listingOffice?.phone || undefined
        },
        photos: idxProperty.photos || [],
        remarks: idxProperty.description || undefined,
        disclaimer: idxProperty.disclaimer || undefined,
        status: idxProperty.status || 'Active',
        mls: {
          status: idxProperty.mlsStatus || 'Active',
          area: idxProperty.mlsArea || '',
          daysOnMarket: parseInt(idxProperty.daysOnMarket) || undefined,
          originalListPrice: parseFloat(idxProperty.originalPrice) || undefined
        }
      };
    } catch (error) {
      console.error('Error mapping IDX property:', error);
      return null;
    }
  };

  return (
    <div className={`idx-search-widget ${className}`}>
      <div ref={containerRef} className="min-h-[400px]">
        {!isLoaded && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property search...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    IHF: any;
  }
}

export default IDXSearchWidget;
