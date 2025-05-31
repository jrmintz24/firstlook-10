
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';

interface PropertyMapProps {
  properties: Property[];
}

const PropertyMap = ({ properties }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoianJtaW50ejI0IiwiYSI6ImNtYmNueGV4dzFicXYya3BvbHJreXZyMXUifQ.G5vHNjwd-nR2FEGngkBzWg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-77.0369, 38.9072], // Washington DC coordinates
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Filter properties based on criteria
    const filteredProperties = properties.filter(property => {
      const price = property.price;
      const createdAt = new Date(property.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return price >= 500000 && 
             price <= 1000000 && 
             createdAt >= oneWeekAgo &&
             property.latitude && 
             property.longitude;
    });

    // Add markers for each property
    filteredProperties.forEach((property) => {
      if (property.latitude && property.longitude) {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'property-marker';
        markerElement.style.cssText = `
          background: #dc2626;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        markerElement.textContent = '🏠';

        // Create popup content
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="font-family: Arial, sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${property.address}</h3>
            <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: bold; color: #dc2626;">
              ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(property.price)}
            </p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              ${property.beds} beds • ${property.baths} baths${property.sqft ? ` • ${property.sqft} sqft` : ''}
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              ${property.property_type || 'Property'}
            </p>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([property.longitude, property.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [properties]);

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Properties Map</h3>
        <p className="text-sm text-gray-600">
          Showing DC properties $500K-$1M listed within the last week
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-96" />
    </div>
  );
};

export default PropertyMap;
