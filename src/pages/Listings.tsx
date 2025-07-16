
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { LoadingSpinner } from '../components/dashboard/shared/LoadingStates';
import { ListingsPageSkeleton } from '../components/listings/ListingsPageSkeleton';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Listings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    console.log('[Listings] Starting IDX load process');

    const loadIDX = async () => {
      try {
        // Ensure the IDX script is loaded
        if (window.ihfKestrel && containerRef.current) {
          console.log('[Listings] IDX Kestrel found, rendering...');
          
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Get search parameters from URL
          const searchTerm = searchParams.get('search');
          console.log('[Listings] Search term from URL:', searchTerm);
          
          // Create and execute the embed script with error handling
          try {
            const renderedElement = window.ihfKestrel.render();
            
            if (renderedElement) {
              containerRef.current.appendChild(renderedElement);
              console.log('[Listings] IDX content successfully rendered with search:', searchTerm);
              
              // Enhanced click interception for property links
              setTimeout(() => {
                interceptPropertyClicks();
                
                // If we have a search term, try to trigger search after render
                if (searchTerm) {
                  console.log('[Listings] Will attempt to trigger search for:', searchTerm);
                  try {
                    const searchInput = containerRef.current?.querySelector('input[type="text"], input[placeholder*="search"], input[name*="search"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = searchTerm;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
                      console.log('[Listings] Search term applied to IDX widget');
                    }
                  } catch (error) {
                    console.log('[Listings] Could not auto-populate search:', error);
                  }
                }
              }, 500);
              
            } else {
              console.error('[Listings] IDX render returned null/undefined');
              setHasError(true);
            }
          } catch (idxError: any) {
            console.error('[Listings] IDX render error:', idxError);
            
            // Handle BaseUrlMismatchError and other IDX domain errors
            if (idxError?.message?.includes('BaseUrlMismatchError') || 
                idxError?.message?.includes('domain') || 
                idxError?.message?.includes('unauthorized')) {
              console.warn('[Listings] IDX domain configuration error detected, implementing fallback');
              setHasError(true);
            } else {
              throw idxError;
            }
          }
          
          // Set loading to false after content renders
          setTimeout(() => {
            console.log('[Listings] IDX load complete');
            setIsLoading(false);
          }, 1000);
          
        } else {
          console.log('[Listings] IDX Kestrel not available, showing error');
          // If IDX is not available, show error after a delay
          setTimeout(() => {
            setIsLoading(false);
            setHasError(true);
          }, 2000);
        }
      } catch (error) {
        console.error('[Listings] Error loading IDX content:', error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    // Function to intercept property clicks and handle navigation manually
    const interceptPropertyClicks = () => {
      const observer = new MutationObserver(() => {
        const propertyLinks = document.querySelectorAll(
          'a[href*="/listing/"], a[href*="/property/"], a[href*="/details/"], ' +
          '.ihf-grid-result a, .property-item a, .listing-item a, ' +
          '[class*="property"] a, [class*="listing"] a'
        );

        propertyLinks.forEach((link) => {
          if (!link.getAttribute('data-intercepted')) {
            link.setAttribute('data-intercepted', 'true');
            
            link.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const href = link.getAttribute('href');
              console.log('[Listings] Property link clicked:', href);
              
              // Extract property ID from href or data attributes
              let propertyId = extractPropertyId(href, link);
              
              if (propertyId) {
                console.log('[Listings] Navigating to property:', propertyId);
                window.location.href = `/listing/${propertyId}`;
              } else {
                console.warn('[Listings] Could not extract property ID from link');
              }
            });
          }
        });
      });

      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true 
      });

      // Cleanup observer after 30 seconds
      setTimeout(() => observer.disconnect(), 30000);
    };

    // Function to extract property ID from various sources
    const extractPropertyId = (href: string | null, element: Element): string | null => {
      // Try href first
      if (href) {
        const patterns = [
          /\/listing\/([^\/\?#]+)/i,
          /\/property\/([^\/\?#]+)/i,
          /\/details\/([^\/\?#]+)/i,
          /mls[_-]?id[=:]([^&\?#]+)/i,
          /id[=:]([^&\?#]+)/i,
          /\/([A-Z0-9]{6,})/i
        ];

        for (const pattern of patterns) {
          const match = href.match(pattern);
          if (match && match[1]) {
            return match[1];
          }
        }
      }

      // Try data attributes
      const dataId = element.getAttribute('data-id') || 
                   element.getAttribute('data-mls-id') || 
                   element.getAttribute('data-listing-id') ||
                   element.getAttribute('data-property-id');
      if (dataId) return dataId;

      // Try parent container data attributes
      const parent = element.closest('[data-id], [data-mls-id], [data-listing-id]');
      if (parent) {
        return parent.getAttribute('data-id') || 
               parent.getAttribute('data-mls-id') || 
               parent.getAttribute('data-listing-id') || null;
      }

      return null;
    };

    loadIDX();
  }, [searchParams]);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Unable to Load Property Search</h2>
              <p className="text-muted-foreground">
                We're having trouble connecting to the property database. Please try again.
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Page Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Property Search</h1>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Search and browse available properties with live MLS data
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="space-y-8">
            {/* Quick loading message */}
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Loading property search..." />
            </div>
            
            {/* Skeleton placeholder */}
            <ListingsPageSkeleton />
          </div>
        )}
        
        {/* IDX Content Container */}
        <div 
          ref={containerRef} 
          className={`
            ${isLoading ? 'opacity-0 absolute -z-10' : 'opacity-100'} 
            transition-opacity duration-500
            bg-card rounded-lg border border-border overflow-hidden
            shadow-sm
          `}
        />
      </div>
    </div>
  );
};

export default Listings;
