
import React, { useEffect } from 'react';
import { extractPropertyData, PropertyData } from '@/utils/idxCommunication';

interface IDXButtonInjectorProps {
  onScheduleTour: (propertyData: PropertyData) => void;
  onMakeOffer: (propertyData: PropertyData) => void;
  onFavorite: (propertyData: PropertyData) => void;
}

const IDXButtonInjector: React.FC<IDXButtonInjectorProps> = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite
}) => {
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 30;
    let injectionInterval: NodeJS.Timeout;
    
    const injectButtons = () => {
      retryCount++;
      console.log(`IDX Button Injection Attempt #${retryCount}`);
      
      // Check if buttons already exist
      if (document.querySelector('#custom-idx-buttons')) {
        console.log('Custom IDX buttons already exist, skipping injection');
        return;
      }
      
      // More comprehensive list of selectors to try
      const containerSelectors = [
        // iHomeFinder specific selectors
        '.ihf-property-details',
        '.ihf-detail-container',
        '.ihf-listing-detail',
        '.ihf-grid-result-container',
        '.ihf-list-result-container',
        '.ihf-container',
        '.ihf-detail-wrapper',
        '.ihf-property-wrapper',
        '.ihf-listing-wrapper',
        
        // Generic selectors that might work
        '.property-details',
        '.listing-details',
        '.listing-container',
        '.property-container',
        '#property-details',
        '#listing-details',
        
        // Fallback to common container patterns
        '[class*="property"]',
        '[class*="listing"]',
        '[class*="detail"]',
        'main',
        '.main-content',
        '#main-content'
      ];
      
      let container: Element | null = null;
      let usedSelector = '';
      
      // Try each selector
      for (const selector of containerSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Trying selector "${selector}": found ${elements.length} elements`);
        
        if (elements.length > 0) {
          // Use the first visible element
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              container = element;
              usedSelector = selector;
              break;
            }
          }
          if (container) break;
        }
      }
      
      if (!container) {
        console.log('No suitable container found. Available elements:');
        // Log some info about what's available
        const allDivs = document.querySelectorAll('div');
        console.log(`Total div elements: ${allDivs.length}`);
        
        // Log elements with IDs or classes that might be relevant
        const relevantElements = document.querySelectorAll('[id], [class*="property"], [class*="listing"], [class*="detail"], [class*="ihf"]');
        console.log('Potentially relevant elements:', Array.from(relevantElements).map(el => ({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          text: el.textContent?.substring(0, 50)
        })));
        
        if (retryCount < maxRetries) {
          setTimeout(injectButtons, 1000);
        } else {
          console.log('Max retries reached, giving up on injection');
        }
        return;
      }
      
      console.log(`Found container using selector "${usedSelector}":`, container);
      
      // Extract property data
      const propertyData = extractPropertyData();
      console.log('Extracted property data:', propertyData);
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'custom-idx-buttons';
      buttonContainer.className = 'flex gap-3 mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm';
      
      // Add a header to make it obvious
      const header = document.createElement('div');
      header.className = 'w-full mb-3 text-sm font-medium text-gray-700 border-b pb-2';
      header.textContent = 'Quick Actions';
      buttonContainer.appendChild(header);
      
      const buttonRow = document.createElement('div');
      buttonRow.className = 'flex gap-3 w-full';
      
      // Schedule Tour Button
      const tourBtn = document.createElement('button');
      tourBtn.className = 'flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2';
      tourBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Schedule Tour
      `;
      tourBtn.onclick = () => {
        console.log('Schedule Tour clicked with data:', propertyData);
        onScheduleTour(propertyData);
      };
      
      // Make Offer Button
      const offerBtn = document.createElement('button');
      offerBtn.className = 'flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2';
      offerBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
        Make Offer
      `;
      offerBtn.onclick = () => {
        console.log('Make Offer clicked with data:', propertyData);
        onMakeOffer(propertyData);
      };
      
      // Favorite Button
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2';
      favoriteBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        Favorite
      `;
      favoriteBtn.onclick = () => {
        console.log('Favorite clicked with data:', propertyData);
        onFavorite(propertyData);
      };
      
      buttonRow.appendChild(tourBtn);
      buttonRow.appendChild(offerBtn);
      buttonRow.appendChild(favoriteBtn);
      buttonContainer.appendChild(buttonRow);
      
      // Try to append to the container
      try {
        container.appendChild(buttonContainer);
        console.log('✅ IDX custom buttons injected successfully!');
        console.log('Container used:', usedSelector);
        console.log('Property data:', propertyData);
      } catch (error) {
        console.error('Error appending buttons to container:', error);
        
        // Fallback: try to insert at the end of body
        document.body.appendChild(buttonContainer);
        console.log('Buttons added to body as fallback');
      }
      
      // Clear the interval once successful
      if (injectionInterval) {
        clearInterval(injectionInterval);
      }
    };
    
    // Start injection attempts
    console.log('Starting IDX button injection process...');
    
    // Try immediately
    setTimeout(injectButtons, 500);
    
    // Also set up periodic retries
    injectionInterval = setInterval(injectButtons, 2000);
    
    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldReinject = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.className && (
                element.className.includes('ihf') || 
                element.className.includes('property') || 
                element.className.includes('listing')
              )) {
                shouldReinject = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldReinject && !document.querySelector('#custom-idx-buttons')) {
        console.log('Content change detected, re-injecting buttons...');
        setTimeout(injectButtons, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      if (injectionInterval) {
        clearInterval(injectionInterval);
      }
      observer.disconnect();
      const existingButtons = document.querySelector('#custom-idx-buttons');
      if (existingButtons) {
        existingButtons.remove();
      }
      console.log('IDX button injector cleanup completed');
    };
  }, [onScheduleTour, onMakeOffer, onFavorite]);
  
  return null; // This component doesn't render anything in React
};

export default IDXButtonInjector;
