
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
          
          // Create and execute the embed script with enhanced search integration
          try {
            let renderedElement;
            
            // Try to render with search parameters if available
            if (searchTerm && window.ihfKestrel.renderWithSearch) {
              console.log('[Listings] Attempting IDX render with search parameters');
              renderedElement = window.ihfKestrel.renderWithSearch({ search: searchTerm });
            } else {
              renderedElement = window.ihfKestrel.render();
            }
            
            if (renderedElement) {
              containerRef.current.appendChild(renderedElement);
              console.log('[Listings] IDX content successfully rendered with search:', searchTerm);
              
              // Enhanced search integration and click interception
              setTimeout(() => {
                interceptPropertyClicks();
                
                // Apply search with retry mechanism
                if (searchTerm) {
                  retrySearchApplication(searchTerm, 0, 5); // Try up to 5 times
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

    // Retry mechanism for search application
    const retrySearchApplication = (searchTerm: string, attempt: number, maxAttempts: number) => {
      console.log(`[Listings] Search application attempt ${attempt + 1}/${maxAttempts}`);
      
      const success = applySearchToIDXWidget(searchTerm);
      
      if (!success && attempt < maxAttempts - 1) {
        // Wait longer between each retry
        const delay = 1000 + (attempt * 500); // 1s, 1.5s, 2s, etc.
        setTimeout(() => {
          retrySearchApplication(searchTerm, attempt + 1, maxAttempts);
        }, delay);
      } else if (!success) {
        console.warn('[Listings] All search application attempts failed');
        // Show user feedback that search couldn't be auto-applied
        showSearchFeedback(searchTerm);
        
        // Consider falling back to iHomeFinder search shortcode
        considerSearchFallback(searchTerm);
      }
    };
    
    // Show user feedback about search status
    const showSearchFeedback = (searchTerm: string) => {
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Search for "${searchTerm}" - please use the search box above</span>
        <button onclick="this.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
      `;
      document.body.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    };
    
    // Consider using iHomeFinder search shortcode as fallback
    const considerSearchFallback = (searchTerm: string) => {
      console.log('[Listings] Considering search fallback for:', searchTerm);
      
      // Store the search term for potential future use
      sessionStorage.setItem('pendingSearch', searchTerm);
      
      // In the future, you could implement a fallback to iHomeFinder's search shortcode
      // For now, just log that we're considering it
      console.log('[Listings] Search term stored for potential fallback implementation');
    };

    // Enhanced function to apply search term to IDX widget
    const applySearchToIDXWidget = (searchTerm: string | null): boolean => {
      if (!searchTerm || !containerRef.current) return false;
      
      console.log('[Listings] Applying search term to IDX widget:', searchTerm);
      
      // Multiple strategies to find and populate the search input
      const searchStrategies = [
        // Strategy 1: Common search input selectors
        () => containerRef.current?.querySelector('input[type="text"][placeholder*="search" i], input[type="text"][placeholder*="city" i], input[type="text"][placeholder*="address" i]') as HTMLInputElement,
        
        // Strategy 2: Look for inputs with search-related names
        () => containerRef.current?.querySelector('input[name*="search" i], input[name*="city" i], input[name*="location" i], input[name*="address" i]') as HTMLInputElement,
        
        // Strategy 3: Look for inputs in search forms
        () => containerRef.current?.querySelector('form[class*="search" i] input[type="text"], .search-form input[type="text"], .ihf-search input[type="text"]') as HTMLInputElement,
        
        // Strategy 4: Look for any text input in the first form
        () => containerRef.current?.querySelector('form input[type="text"]') as HTMLInputElement,
        
        // Strategy 5: Look for any text input (last resort)
        () => containerRef.current?.querySelector('input[type="text"]') as HTMLInputElement
      ];
      
      let searchInput: HTMLInputElement | null = null;
      let strategyUsed = -1;
      
      // Try each strategy
      for (let i = 0; i < searchStrategies.length; i++) {
        try {
          searchInput = searchStrategies[i]();
          if (searchInput) {
            strategyUsed = i + 1;
            console.log(`[Listings] Found search input using strategy ${strategyUsed}`);
            break;
          }
        } catch (error) {
          console.log(`[Listings] Strategy ${i + 1} failed:`, error);
        }
      }
      
      if (searchInput) {
        try {
          // Set the value and trigger various events
          searchInput.value = searchTerm;
          searchInput.focus();
          
          // Trigger multiple events to ensure the search is processed
          const events = ['input', 'change', 'blur', 'keyup'];
          events.forEach(eventType => {
            searchInput!.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          
          // Also try keyboard events
          searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
          
          console.log(`[Listings] Successfully populated search input with: "${searchTerm}" using strategy ${strategyUsed}`);
          
          // Try to find and click search button
          setTimeout(() => {
            const searchButtons = containerRef.current?.querySelectorAll('button[type="submit"], input[type="submit"], button[class*="search" i], .search-button, .btn-search');
            if (searchButtons && searchButtons.length > 0) {
              const searchButton = searchButtons[0] as HTMLElement;
              console.log('[Listings] Found search button, attempting to trigger search');
              searchButton.click();
            }
          }, 100);
          
          return true; // Success!
          
        } catch (error) {
          console.error('[Listings] Error applying search term to input:', error);
        }
      } else {
        console.warn('[Listings] Could not find search input in IDX widget');
        
        // Alternative: Try to modify the IDX URL or configuration
        tryAlternativeSearchMethods(searchTerm);
      }
      
      return false; // Failed to apply search
    };
    
    // Alternative search methods for IDX
    const tryAlternativeSearchMethods = (searchTerm: string) => {
      console.log('[Listings] Trying alternative search methods for:', searchTerm);
      
      // Try to update the page URL to include search parameters
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('ihf-search', searchTerm);
        currentUrl.searchParams.set('location', searchTerm);
        window.history.replaceState({}, '', currentUrl.toString());
        console.log('[Listings] Updated URL with search parameters');
      } catch (error) {
        console.log('[Listings] Could not update URL:', error);
      }
      
      // Try to trigger a custom event that IDX might listen for
      try {
        window.dispatchEvent(new CustomEvent('idxSearch', { 
          detail: { searchTerm, location: searchTerm } 
        }));
        console.log('[Listings] Dispatched custom IDX search event');
      } catch (error) {
        console.log('[Listings] Could not dispatch custom event:', error);
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {isLoading && (
          <div className="space-y-8">
            {/* Quick loading message */}
            <div className="text-center py-12">
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
            bg-white rounded-xl border border-border overflow-hidden
            shadow-lg min-h-screen
          `}
          style={{
            /* Ensure IDX content has proper spacing */
            '--idx-content-padding': '2rem',
          }}
        />
      </div>
    </div>
  );
};

export default Listings;
