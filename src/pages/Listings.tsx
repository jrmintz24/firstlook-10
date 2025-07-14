
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyActionManager from '../components/property/PropertyActionManager';
import PropertyFloatingActions from '../components/property/PropertyFloatingActions';

const Listings = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showActionManager, setShowActionManager] = useState(false);

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  const extractPropertyData = (element: HTMLElement) => {
    // Try to extract property data from the clicked element or its parents
    const propertyElement = element.closest('[data-property-id], .property-card, .listing-item') || element;
    
    // Extract basic property information
    const address = propertyElement.querySelector('.address, .property-address')?.textContent ||
                   propertyElement.querySelector('h3, h4')?.textContent ||
                   'Property Address';
    
    const price = propertyElement.querySelector('.price, .property-price')?.textContent || 'Price on Request';
    const beds = propertyElement.querySelector('.beds, .bedrooms')?.textContent || '';
    const baths = propertyElement.querySelector('.baths, .bathrooms')?.textContent || '';
    
    return {
      id: propertyElement.getAttribute('data-property-id') || Math.random().toString(),
      address: address.trim(),
      price: price.trim(),
      beds: beds.trim(),
      baths: baths.trim()
    };
  };

  const injectActionButtons = () => {
    const container = document.getElementById('idx-container');
    if (!container) return;

    // Look for property listings in the IDX content
    const propertyElements = container.querySelectorAll([
      '.property-card',
      '.listing-item', 
      '.search-result',
      '[data-property-id]',
      'div[class*="property"]',
      'div[class*="listing"]'
    ].join(', '));

    propertyElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if already has action buttons
      if (htmlElement.querySelector('.property-floating-actions')) return;

      // Create action buttons container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'property-floating-actions absolute top-2 right-2 z-10';
      actionsContainer.innerHTML = `
        <div class="flex gap-2">
          <button class="favorite-btn p-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-white shadow-sm transition-colors">
            <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button class="tour-btn px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 shadow-sm transition-colors text-sm font-medium">
            <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tour
          </button>
          <button class="offer-btn px-3 py-2 bg-white/90 backdrop-blur-sm border border-black text-black rounded-lg hover:bg-black hover:text-white shadow-sm transition-colors text-sm font-medium">
            <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Offer
          </button>
        </div>
      `;

      // Position the element relatively so the absolute buttons work
      if (getComputedStyle(htmlElement).position === 'static') {
        htmlElement.style.position = 'relative';
      }

      // Add the actions container
      htmlElement.appendChild(actionsContainer);

      // Add event listeners
      const favoriteBtn = actionsContainer.querySelector('.favorite-btn');
      const tourBtn = actionsContainer.querySelector('.tour-btn');
      const offerBtn = actionsContainer.querySelector('.offer-btn');

      const handleAction = (actionType: string) => (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        const propertyData = extractPropertyData(htmlElement);
        setSelectedProperty(propertyData);
        setShowActionManager(true);

        // Trigger specific action based on button clicked
        setTimeout(() => {
          if (actionType === 'favorite') {
            const favModal = document.querySelector('[data-testid="favorite-modal"]') as HTMLElement;
            favModal?.click();
          } else if (actionType === 'tour') {
            // Tour action will be handled by PropertyActionManager
          } else if (actionType === 'offer') {
            const offerModal = document.querySelector('[data-testid="offer-modal"]') as HTMLElement;
            offerModal?.click();
          }
        }, 100);
      };

      favoriteBtn?.addEventListener('click', handleAction('favorite'));
      tourBtn?.addEventListener('click', handleAction('tour'));
      offerBtn?.addEventListener('click', handleAction('offer'));
    });
  };

  useEffect(() => {
    if (!searchParams.get('id')) {
      // Execute the IDX embed code when component mounts
      if (window.ihfKestrel) {
        const container = document.getElementById('idx-container');
        if (container) {
          try {
            // Clear any existing content
            container.innerHTML = '';
            
            // Create and execute the embed script
            const renderedElement = window.ihfKestrel.render();
            if (renderedElement) {
              container.appendChild(renderedElement);
            }

            // Simple click event listener for link interception
            const handleClick = (event: Event) => {
              const target = event.target as HTMLElement;
              const link = target.closest('a');
              
              if (link && link.href) {
                const url = new URL(link.href);
                
                // Check if this looks like a property detail link
                if (url.pathname.includes('/listing/') || 
                    url.pathname.includes('/property/') || 
                    url.searchParams.has('listingId') ||
                    url.searchParams.has('propertyId')) {
                  
                  event.preventDefault();
                  event.stopPropagation();
                  
                  // Extract property ID
                  let propertyId = '';
                  const pathParts = url.pathname.split('/');
                  const listingIndex = pathParts.findIndex(part => 
                    part === 'listing' || part === 'property'
                  );
                  
                  if (listingIndex !== -1 && pathParts[listingIndex + 1]) {
                    propertyId = pathParts[listingIndex + 1];
                  } else {
                    propertyId = url.searchParams.get('listingId') ||
                               url.searchParams.get('propertyId') ||
                               url.searchParams.get('id') || '';
                  }
                  
                  if (propertyId) {
                    navigate(`/listing?id=${propertyId}`);
                  }
                }
              }
            };

            // Add click listener
            container.addEventListener('click', handleClick, true);

            // Inject action buttons after IDX content loads
            const observer = new MutationObserver(() => {
              injectActionButtons();
            });

            observer.observe(container, { 
              childList: true, 
              subtree: true 
            });

            // Initial injection
            setTimeout(injectActionButtons, 1000);
            
            // Cleanup function
            return () => {
              container.removeEventListener('click', handleClick, true);
              observer.disconnect();
            };
          } catch (error) {
            console.error('Error setting up IDX widget:', error);
          }
        }
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

      {/* Property Action Manager */}
      {showActionManager && selectedProperty && (
        <PropertyActionManager
          property={selectedProperty}
          agentName="Your Agent" // Replace with actual agent name
          onClose={() => setShowActionManager(false)}
        />
      )}
    </div>
  );
};

export default Listings;
