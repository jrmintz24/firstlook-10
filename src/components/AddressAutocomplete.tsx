
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Start typing an address...", 
  label = "Property Address",
  id = "address-autocomplete"
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Google Places API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      
      console.log('API Key check:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey) {
        setLoadError('Google Places API key is missing');
        console.error('VITE_GOOGLE_PLACES_API_KEY environment variable is not set');
        return;
      }

      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Wait for it to load
        window.initAutocomplete = initializeAutocomplete;
        return;
      }

      // Create and load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        setLoadError('Failed to load Google Places API');
        console.error('Failed to load Google Places API script');
      };
      
      window.initAutocomplete = initializeAutocomplete;
      
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'us' },
            fields: ['formatted_address', 'geometry', 'place_id']
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
        });

        setIsLoaded(true);
        setLoadError(null);
        console.log('Google Places Autocomplete initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
        setLoadError('Error initializing address search');
      }
    };

    loadGoogleMapsAPI();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        placeholder={
          loadError 
            ? "Enter address manually..." 
            : isLoaded 
              ? placeholder 
              : "Loading address search..."
        }
        autoComplete="off"
      />
      {loadError && (
        <p className="text-xs text-red-500 mt-1">
          {loadError} - You can still enter addresses manually
        </p>
      )}
      {!isLoaded && !loadError && (
        <p className="text-xs text-gray-500 mt-1">
          Loading Google Places API for address suggestions...
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
