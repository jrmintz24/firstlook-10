import { useEffect, useState } from 'react';

interface UseIHomefinderScriptProps {
  /** Your iHomefinder domain (e.g., 'your-site.ihomefinder.com') */
  domain?: string;
}

export const useIHomefinderScript = ({ domain }: UseIHomefinderScriptProps = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if ihfKestrel is already available
    if (typeof window !== 'undefined' && (window as any).ihfKestrel) {
      setIsLoaded(true);
      return;
    }

    // Don't load if no domain provided
    if (!domain) {
      setError('iHomefinder domain not configured');
      setIsLoaded(false);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://${domain}/ihf-kestrel.js`;
    script.async = true;

    script.onload = () => {
      // Wait a bit for ihfKestrel to be available
      setTimeout(() => {
        if ((window as any).ihfKestrel) {
          setIsLoaded(true);
        } else {
          setError('iHomefinder script loaded but ihfKestrel not available');
        }
      }, 100);
    };

    script.onerror = () => {
      setError('Failed to load iHomefinder script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [domain]);

  return { isLoaded, error };
};