
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';

const Listings = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  useEffect(() => {
    // Execute the IDX embed code when component mounts
    if (window.ihfKestrel) {
      const container = document.getElementById('idx-container');
      if (container) {
        // Clear any existing content
        container.innerHTML = '';
        
        // Create and execute the embed script
        const renderedElement = window.ihfKestrel.render();
        container.appendChild(renderedElement);

        // Enhanced click event listener to intercept ALL IDX interactions
        const handleAllClicks = (event: Event) => {
          const target = event.target as HTMLElement;
          
          // Check for direct links
          const link = target.closest('a');
          if (link && link.href) {
            if (shouldInterceptLink(link.href)) {
              event.preventDefault();
              event.stopPropagation();
              navigateToListing(link.href);
              return;
            }
          }
          
          // Check for clickable elements that might trigger popups (divs, buttons, etc.)
          const clickableElement = target.closest('[data-listing-id], [onclick*="listing"], [onclick*="popup"], [onclick*="modal"]');
          if (clickableElement) {
            const listingId = extractListingIdFromElement(clickableElement);
            if (listingId) {
              event.preventDefault();
              event.stopPropagation();
              navigate(`/listing/${listingId}`);
              return;
            }
          }
          
          // Check for elements with specific IDX classes that might be clickable
          const idxElement = target.closest('.ihf-listing-card, .ihf-property-card, .listing-item, .property-item');
          if (idxElement) {
            const listingId = extractListingIdFromElement(idxElement);
            if (listingId) {
              event.preventDefault();
              event.stopPropagation();
              navigate(`/listing/${listingId}`);
              return;
            }
          }
        };

        // Helper function to check if we should intercept this link
        const shouldInterceptLink = (href: string): boolean => {
          try {
            const url = new URL(href);
            const pathname = url.pathname;
            
            return pathname.includes('/listing/') ||
                   pathname.includes('/property/') ||
                   pathname.includes('/details/') ||
                   url.searchParams.has('listingId') ||
                   url.searchParams.has('propertyId') ||
                   url.searchParams.has('mlsId') ||
                   url.searchParams.has('id');
          } catch {
            return false;
          }
        };

        // Helper function to navigate to listing page
        const navigateToListing = (href: string) => {
          try {
            const url = new URL(href);
            const pathname = url.pathname;
            let propertyId = '';
            
            // Try to extract from pathname
            const pathParts = pathname.split('/');
            const listingIndex = pathParts.findIndex(part => 
              part === 'listing' || part === 'property' || part === 'details'
            );
            
            if (listingIndex !== -1 && pathParts[listingIndex + 1]) {
              propertyId = pathParts[listingIndex + 1];
            }
            
            // Try to extract from search params if not found in path
            if (!propertyId) {
              propertyId = url.searchParams.get('listingId') ||
                         url.searchParams.get('propertyId') ||
                         url.searchParams.get('mlsId') ||
                         url.searchParams.get('id') ||
                         '';
            }
            
            // Navigate to our listing detail page
            if (propertyId) {
              navigate(`/listing/${propertyId}`);
            } else {
              // Fallback: extract any numeric ID from the URL
              const numericMatch = href.match(/\d+/);
              if (numericMatch) {
                navigate(`/listing/${numericMatch[0]}`);
              }
            }
          } catch (error) {
            console.error('Error navigating to listing:', error);
          }
        };

        // Helper function to extract listing ID from various element attributes
        const extractListingIdFromElement = (element: Element): string => {
          // Check common data attributes
          const dataAttrs = ['data-listing-id', 'data-property-id', 'data-mls-id', 'data-id'];
          for (const attr of dataAttrs) {
            const value = element.getAttribute(attr);
            if (value) return value;
          }
          
          // Check onclick attribute for IDs
          const onclick = element.getAttribute('onclick');
          if (onclick) {
            const match = onclick.match(/\d+/);
            if (match) return match[0];
          }
          
          // Check href if it's a link
          if (element.tagName === 'A') {
            const href = (element as HTMLAnchorElement).href;
            if (href && shouldInterceptLink(href)) {
              const url = new URL(href);
              return url.searchParams.get('listingId') || 
                     url.searchParams.get('propertyId') || 
                     url.searchParams.get('mlsId') || 
                     url.searchParams.get('id') || 
                     '';
            }
          }
          
          return '';
        };

        // Add comprehensive event listeners
        container.addEventListener('click', handleAllClicks, true);
        container.addEventListener('mousedown', handleAllClicks, true);
        
        // Override any window.open calls that might be triggered by IDX
        const originalWindowOpen = window.open;
        window.open = function(url, name, specs) {
          if (url && typeof url === 'string' && shouldInterceptLink(url)) {
            navigateToListing(url);
            return null;
          }
          return originalWindowOpen.call(window, url, name, specs);
        };

        // Set up MutationObserver to handle dynamically added content
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Re-attach event listeners to new content
                const links = element.querySelectorAll('a[href*="listing"], a[href*="property"], a[href*="details"]');
                links.forEach(link => {
                  link.addEventListener('click', handleAllClicks, true);
                });
              }
            });
          });
        });

        observer.observe(container, {
          childList: true,
          subtree: true
        });

        // Cleanup function
        return () => {
          container.removeEventListener('click', handleAllClicks, true);
          container.removeEventListener('mousedown', handleAllClicks, true);
          window.open = originalWindowOpen;
          observer.disconnect();
        };
      }
    }
  }, [navigate, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Find Your Perfect Home
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {searchTerm 
                ? `Searching for properties: "${searchTerm}"`
                : 'Search through thousands of properties with advanced filtering options and detailed listings to find the home that\'s right for you.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* IDX Search Widget Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div 
            id="idx-container"
            ref={containerRef}
            className="w-full min-h-96"
          >
            {/* IDX content will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
