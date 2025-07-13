
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
    const maxRetries = 20;
    
    const injectButtons = () => {
      retryCount++;
      
      // Look for IDX containers
      const containerSelectors = [
        '.ihf-property-details',
        '.ihf-detail-container',
        '.ihf-listing-detail',
        '.ihf-grid-result-container',
        '.ihf-list-result-container',
        '.ihf-container'
      ];
      
      let container: Element | null = null;
      for (const selector of containerSelectors) {
        container = document.querySelector(selector);
        if (container) break;
      }
      
      if (!container || document.querySelector('#custom-idx-buttons')) {
        if (retryCount < maxRetries) {
          setTimeout(injectButtons, 500);
        }
        return;
      }
      
      // Extract property data
      const propertyData = extractPropertyData();
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'custom-idx-buttons';
      buttonContainer.className = 'flex gap-3 mt-4 p-4 border-t border-gray-200';
      
      // Schedule Tour Button
      const tourBtn = document.createElement('button');
      tourBtn.className = 'flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2';
      tourBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Schedule Tour
      `;
      tourBtn.onclick = () => onScheduleTour(propertyData);
      
      // Make Offer Button
      const offerBtn = document.createElement('button');
      offerBtn.className = 'flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2';
      offerBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
        Make Offer
      `;
      offerBtn.onclick = () => onMakeOffer(propertyData);
      
      // Favorite Button
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2';
      favoriteBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        Favorite
      `;
      favoriteBtn.onclick = () => onFavorite(propertyData);
      
      buttonContainer.appendChild(tourBtn);
      buttonContainer.appendChild(offerBtn);
      buttonContainer.appendChild(favoriteBtn);
      
      container.appendChild(buttonContainer);
      
      console.log('IDX custom buttons injected successfully with property data:', propertyData);
    };
    
    // Start injection process
    const startTime = setTimeout(injectButtons, 1000);
    
    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldReinject = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.className && element.className.includes('ihf')) {
                shouldReinject = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldReinject && !document.querySelector('#custom-idx-buttons')) {
        setTimeout(injectButtons, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      clearTimeout(startTime);
      observer.disconnect();
      const existingButtons = document.querySelector('#custom-idx-buttons');
      if (existingButtons) {
        existingButtons.remove();
      }
    };
  }, [onScheduleTour, onMakeOffer, onFavorite]);
  
  return null; // This component doesn't render anything in React
};

export default IDXButtonInjector;
