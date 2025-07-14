
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import PropertyFloatingActions from '../components/property/PropertyFloatingActions';
import PropertyActionManager from '../components/property/PropertyActionManager';
import { PropertyData } from '../utils/propertyDataUtils';

const Listings = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'tour' | 'offer' | 'favorite' | null;
    property: PropertyData | null;
  }>({
    isOpen: false,
    actionType: null,
    property: null
  });

  // Set document head with static title as specified
  useDocumentHead({
    title: 'Property Search - Home Finder Platform',
    description: 'Search and browse available properties with advanced filtering options and detailed listings.',
  });

  const extractPropertyData = (propertyElement: HTMLElement): PropertyData => {
    // Extract property data from IDX elements
    const addressElement = propertyElement.querySelector('[data-address], .address, .property-address');
    const priceElement = propertyElement.querySelector('[data-price], .price, .property-price');
    const bedsElement = propertyElement.querySelector('[data-beds], .beds, .bedroom');
    const bathsElement = propertyElement.querySelector('[data-baths], .baths, .bathroom');
    
    return {
      address: addressElement?.textContent?.trim() || 'Property Address',
      price: priceElement?.textContent?.trim() || '',
      beds: bedsElement?.textContent?.trim() || '',
      baths: bathsElement?.textContent?.trim() || '',
      mlsId: propertyElement.getAttribute('data-mls-id') || ''
    };
  };

  const handlePropertyAction = (actionType: 'tour' | 'offer' | 'favorite', propertyElement: HTMLElement) => {
    const property = extractPropertyData(propertyElement);
    setModalState({
      isOpen: true,
      actionType,
      property
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
      property: null
    });
  };

  const addActionButtons = () => {
    if (!containerRef.current) return;

    // Find property cards in the IDX content
    const propertyCards = containerRef.current.querySelectorAll('[data-property], .property-card, .listing-item');
    
    propertyCards.forEach((card) => {
      const htmlCard = card as HTMLElement;
      
      // Check if buttons already added
      if (htmlCard.querySelector('.property-actions-overlay')) return;
      
      // Create overlay container
      const overlay = document.createElement('div');
      overlay.className = 'property-actions-overlay absolute top-2 right-2 z-10';
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'flex gap-1';
      
      // Create buttons
      const tourBtn = document.createElement('button');
      tourBtn.className = 'px-2 py-1 bg-black text-white text-xs rounded hover:bg-gray-800';
      tourBtn.innerHTML = '📅 Tour';
      tourBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePropertyAction('tour', htmlCard);
      };
      
      const offerBtn = document.createElement('button');
      offerBtn.className = 'px-2 py-1 border border-black text-black text-xs rounded hover:bg-black hover:text-white';
      offerBtn.innerHTML = '💰 Offer';
      offerBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePropertyAction('offer', htmlCard);
      };
      
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50';
      favoriteBtn.innerHTML = '❤️ Save';
      favoriteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePropertyAction('favorite', htmlCard);
      };
      
      buttonContainer.appendChild(tourBtn);
      buttonContainer.appendChild(offerBtn);
      buttonContainer.appendChild(favoriteBtn);
      overlay.appendChild(buttonContainer);
      
      // Make sure the property card is relatively positioned
      htmlCard.style.position = 'relative';
      htmlCard.appendChild(overlay);
    });
  };

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

        // Add click event listener to intercept IDX links and prevent popups
        const handleLinkClick = (event: Event) => {
          const target = event.target as HTMLElement;
          const link = target.closest('a');
          
          if (link && link.href) {
            // Check if this is an IDX property detail link
            const url = new URL(link.href);
            const pathname = url.pathname;
            
            // Common IDX URL patterns for property details
            const isPropertyLink = 
              pathname.includes('/listing/') ||
              pathname.includes('/property/') ||
              pathname.includes('/details/') ||
              url.searchParams.has('listingId') ||
              url.searchParams.has('propertyId') ||
              url.searchParams.has('mlsId');

            if (isPropertyLink) {
              event.preventDefault();
              event.stopPropagation();
              
              // Extract property ID from various possible URL formats
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
                           '';
              }
              
              // Navigate to our listing detail page
              if (propertyId) {
                navigate(`/listing/${propertyId}`);
              } else {
                // Fallback: extract any numeric ID from the URL
                const numericMatch = link.href.match(/\d+/);
                if (numericMatch) {
                  navigate(`/listing/${numericMatch[0]}`);
                }
              }
            }
          }
        };

        // Add event listener to the container using event delegation
        container.addEventListener('click', handleLinkClick, true);

        // Set up MutationObserver to add action buttons when new properties load
        const observer = new MutationObserver(() => {
          setTimeout(addActionButtons, 100); // Small delay to ensure DOM is ready
        });

        observer.observe(container, {
          childList: true,
          subtree: true
        });

        // Initial button addition
        setTimeout(addActionButtons, 1000);

        // Cleanup function
        return () => {
          container.removeEventListener('click', handleLinkClick, true);
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
            className="w-full min-h-96 relative"
          >
            {/* IDX content will be rendered here */}
          </div>
        </div>
      </div>

      {/* Property Action Manager for Modals */}
      <PropertyActionManager
        isOpen={modalState.isOpen}
        onClose={closeModal}
        actionType={modalState.actionType}
        property={modalState.property}
      />
    </div>
  );
};

export default Listings;
