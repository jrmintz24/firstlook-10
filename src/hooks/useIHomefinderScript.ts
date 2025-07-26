import { useEffect, useState } from 'react';

interface UseIHomefinderScriptProps {
  /** Your iHomefinder domain (e.g., 'your-site.ihomefinder.com') */
  domain?: string;
}

export const useIHomefinderScript = ({ domain }: UseIHomefinderScriptProps = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useIHomefinderScript] Starting with domain:', domain);
    
    // Check if ihfKestrel is already available
    if (typeof window !== 'undefined' && (window as any).ihfKestrel) {
      console.log('[useIHomefinderScript] ihfKestrel already available');
      setIsLoaded(true);
      return;
    }

    // Don't load if no domain provided
    if (!domain) {
      console.log('[useIHomefinderScript] No domain provided');
      setError('iHomefinder domain not configured');
      setIsLoaded(false);
      return;
    }

    const scriptUrl = `https://${domain}/ihf-kestrel.js`;
    console.log('[useIHomefinderScript] Loading script from:', scriptUrl);

    // Create script element
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;

    script.onload = () => {
      console.log('[useIHomefinderScript] Script loaded, checking for ihfKestrel...');
      // Wait a bit for ihfKestrel to be available
      setTimeout(() => {
        if ((window as any).ihfKestrel) {
          console.log('[useIHomefinderScript] ihfKestrel is now available');
          setIsLoaded(true);
        } else {
          console.log('[useIHomefinderScript] Script loaded but ihfKestrel not available');
          setError('iHomefinder script loaded but ihfKestrel not available');
        }
      }, 100);
    };

    script.onerror = (err) => {
      console.error('[useIHomefinderScript] Script failed to load:', err);
      setError('Failed to load iHomefinder script');
    };

    document.head.appendChild(script);
    console.log('[useIHomefinderScript] Script element added to head');

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        console.log('[useIHomefinderScript] Script removed from head');
      }
    };
  }, [domain]);

  return { isLoaded, error };
};