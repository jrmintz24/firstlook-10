import { useEffect, useRef, useState } from 'react';

interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
  listingUrl?: string;
}

export const useIDXIntegration = () => {
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const processedButtons = useRef(new Set<Element>());

  const extractPropertyData = (element: Element): PropertyData | null => {
    try {
      // Try to find property data in the element or its parents
      const container = element.closest('[data-property], .property-card, .listing-item') || element;
      
      // Extract address - try multiple selectors
      const addressSelectors = [
        '.property-address',
        '.listing-address', 
        '[data-address]',
        '.address',
        'h3, h4, h5'
      ];
      
      let address = '';
      for (const selector of addressSelectors) {
        const addressEl = container.querySelector(selector);
        if (addressEl?.textContent?.trim()) {
          address = addressEl.textContent.trim();
          break;
        }
      }

      // Extract price
      const priceSelectors = [
        '.price',
        '.property-price',
        '[data-price]',
        '.listing-price'
      ];
      
      let price = '';
      for (const selector of priceSelectors) {
        const priceEl = container.querySelector(selector);
        if (priceEl?.textContent?.trim()) {
          price = priceEl.textContent.trim();
          break;
        }
      }

      // Extract beds/baths
      const bedsEl = container.querySelector('.beds, [data-beds], .bedroom-count');
      const bathsEl = container.querySelector('.baths, [data-baths], .bathroom-count');
      
      const beds = bedsEl?.textContent?.trim();
      const baths = bathsEl?.textContent?.trim();

      // Extract MLS ID
      const mlsEl = container.querySelector('.mls-id, [data-mls], .listing-id');
      const mlsId = mlsEl?.textContent?.trim();

      // If we can't find an address, try to extract from button text or nearby elements
      if (!address) {
        const nearbyText = container.textContent || '';
        const addressMatch = nearbyText.match(/\d+[\w\s]+(?:st|nd|rd|th|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|way|pl|place)/i);
        if (addressMatch) {
          address = addressMatch[0].trim();
        }
      }

      return address ? { address, price, beds, baths, mlsId } : null;
    } catch (error) {
      console.warn('Error extracting property data:', error);
      return null;
    }
  };

  const replaceButtons = (onScheduleTour: (propertyData: PropertyData) => void) => {
    const container = document.getElementById('ihf-container');
    if (!container) return;

    // Find all potential tour/contact buttons
    const buttonSelectors = [
      'button[title*="tour" i]',
      'button[title*="schedule" i]', 
      'a[title*="tour" i]',
      'a[title*="schedule" i]',
      'button:contains("Schedule")',
      'button:contains("Tour")',
      'a:contains("Schedule")',
      'a:contains("Tour")',
      '.schedule-tour',
      '.contact-agent',
      '.tour-button'
    ];

    buttonSelectors.forEach(selector => {
      const buttons = container.querySelectorAll(selector);
      buttons.forEach(button => {
        if (processedButtons.current.has(button)) return;
        
        const propertyData = extractPropertyData(button);
        if (!propertyData) return;

        // Hide original button
        (button as HTMLElement).style.display = 'none';
        
        // Create custom button
        const customButton = document.createElement('button');
        customButton.className = 'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors';
        customButton.textContent = 'Schedule Tour';
        customButton.style.position = 'absolute';
        customButton.style.zIndex = '1000';
        
        // Position the custom button
        const rect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        customButton.style.left = `${rect.left - containerRect.left}px`;
        customButton.style.top = `${rect.top - containerRect.top}px`;
        customButton.style.width = `${rect.width}px`;
        customButton.style.height = `${rect.height}px`;

        customButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          onScheduleTour(propertyData);
        });

        // Insert the custom button
        if (button.parentNode) {
          button.parentNode.insertBefore(customButton, button.nextSibling);
        }

        processedButtons.current.add(button);
      });
    });
  };

  const initializeObserver = (onScheduleTour: (propertyData: PropertyData) => void) => {
    const container = document.getElementById('ihf-container');
    if (!container) return;

    // Initial replacement
    replaceButtons(onScheduleTour);

    // Set up mutation observer for dynamic content
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations) => {
      let shouldReplace = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldReplace = true;
        }
      });

      if (shouldReplace) {
        setTimeout(() => replaceButtons(onScheduleTour), 100);
      }
    });

    observerRef.current.observe(container, {
      childList: true,
      subtree: true
    });

    setIsReady(true);
  };

  const cleanup = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    processedButtons.current.clear();
    setIsReady(false);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    isReady,
    initializeObserver,
    cleanup,
    extractPropertyData
  };
};