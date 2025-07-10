import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Property } from '@/types/simplyrets'

// Note: In a real implementation, this would use the Mapbox token from secrets
// For now, using a placeholder - this should be configured via Supabase secrets
const MAPBOX_TOKEN = 'pk.example.token'

interface MapViewProps {
  properties?: Property[]
  selectedProperty?: Property
  onPropertySelect?: (property: Property) => void
  center?: [number, number]
  zoom?: number
  height?: string
}

export const MapView = ({ 
  properties = [], 
  selectedProperty,
  onPropertySelect,
  center = [-77.0369, 38.9072], // Washington DC
  zoom = 10,
  height = '400px'
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // For demo purposes, show a simple div instead of actual map
    // In production, you'd configure the Mapbox token properly
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.example.token') {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div style="height: ${height}; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
            <div style="text-align: center; color: #6b7280;">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🗺️</div>
              <div>Map View</div>
              <div style="font-size: 0.875rem; margin-top: 0.25rem;">${properties.length} properties in this area</div>
            </div>
          </div>
        `
      }
      return
    }

    // Real Mapbox implementation would go here
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [center, zoom, height])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add markers for each property
    properties.forEach((property) => {
      if (property.geo?.lat && property.geo?.lng) {
        const el = document.createElement('div')
        el.className = 'property-marker'
        el.style.cssText = `
          background-color: ${selectedProperty?.mlsId === property.mlsId ? '#2563eb' : '#dc2626'};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `

        const marker = new mapboxgl.Marker(el)
          .setLngLat([property.geo.lng, property.geo.lat])
          .addTo(map.current!)

        // Add click handler
        el.addEventListener('click', () => {
          if (onPropertySelect) {
            onPropertySelect(property)
          }
        })

        // Add popup on hover
        const popup = new mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 8px; min-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 4px;">
              $${property.listPrice.toLocaleString()}
            </div>
            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 4px;">
              ${property.address.full}
            </div>
            <div style="font-size: 0.875rem;">
              ${property.property.bedrooms} bed • ${property.property.bathsFull + (property.property.bathsHalf * 0.5)} bath
              ${property.property.area ? ` • ${property.property.area.toLocaleString()} sqft` : ''}
            </div>
          </div>
        `)

        el.addEventListener('mouseenter', () => {
          popup.setLngLat([property.geo.lng, property.geo.lat]).addTo(map.current!)
        })

        el.addEventListener('mouseleave', () => {
          popup.remove()
        })

        markers.current.push(marker)
      }
    })

    // Fit map to show all properties
    if (properties.length > 0) {
      const coordinates = properties
        .filter(p => p.geo?.lat && p.geo?.lng)
        .map(p => [p.geo.lng, p.geo.lat] as [number, number])

      if (coordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        coordinates.forEach(coord => bounds.extend(coord))
        
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        })
      }
    }
  }, [properties, selectedProperty, onPropertySelect])

  return (
    <div 
      ref={mapContainer} 
      style={{ height }} 
      className="w-full rounded-lg border border-gray-200"
    />
  )
}