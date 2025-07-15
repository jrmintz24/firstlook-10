
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyData } from '@/utils/propertyDataUtils';

interface IDXButtonInterceptionProps {
  onScheduleTour: (property: PropertyData) => void;
  onMakeOffer: (property: PropertyData) => void;
  onFavorite: (property: PropertyData) => void;
  onRequestInfo: (property: PropertyData) => void;
}

export const useIDXButtonInterception = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  onRequestInfo
}: IDXButtonInterceptionProps) => {
  const navigate = useNavigate();
  const observerRef = useRef<MutationObserver | null>(null);
  const interceptedCountRef = useRef<number>(0);

  // Enhanced debugging function
  const debugLog = useCallback((message: string, data?: any) => {
    console.log(`[IDX Debug] ${message}`, data || '');
  }, []);

  const extractPropertyData = useCallback((): PropertyData => {
    const addressSelectors = [
      '[data-address]',
      '.address',
      '.property-address',
      '.listing-address',
      'h1',
      '.property-title',
      '.listing-title',
      '.ihf-grid-result-title',
      '.ihf-detail-address'
    ];

    const priceSelectors = [
      '[data-price]',
      '.price',
      '.property-price',
      '.listing-price',
      '.price-display',
      '.ihf-grid-result-price',
      '.ihf-detail-price'
    ];

    let address = '';
    let price = '';
    let beds = '';
    let baths = '';

    for (const selector of addressSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        address = element.textContent.trim();
        break;
      }
    }

    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        price = element.textContent.trim();
        break;
      }
    }

    if (!address) {
      address = window.location.pathname.includes('/listing/') 
        ? `Property ${window.location.pathname.split('/').pop()}` 
        : 'Selected Property';
    }

    return {
      address,
      price,
      beds,
      baths,
      mlsId: window.location.pathname.split('/').pop() || ''
    };
  }, []);

  const extractPropertyIdFromUrl = useCallback((url: string): string | null => {
    const patterns = [
      /\/listing\/([^\/\?#]+)/i,
      /\/property\/([^\/\?#]+)/i,
      /\/details\/([^\/\?#]+)/i,
      /\/detail\/([^\/\?#]+)/i,
      /mls[_-]?id[=:]([^&\?#]+)/i,
      /listing[_-]?id[=:]([^&\?#]+)/i,
      /property[_-]?id[=:]([^&\?#]+)/i,
      /id[=:]([^&\?#]+)/i,
      /\/([A-Z0-9]{6,})/i,
      /\/([0-9]{5,})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }, []);

  const removeIDXForms = useCallback(() => {
    const formSelectors = [
      '.ihf-contact-form',
      '.ihf-request-info',
      '.ihf-lead-form',
      '.contact-form',
      '.request-info-form',
      '.lead-capture-form',
      '.ihf-sidebar-form',
      '.sidebar-contact',
      '.property-contact-form',
      '.widget-contact',
      '.widget-request-info'
    ];

    let removedCount = 0;
    formSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.remove();
        removedCount++;
      });
    });

    if (removedCount > 0) {
      debugLog(`Removed ${removedCount} IDX forms`);
    }
  }, [debugLog]);

  const interceptPropertyLinks = useCallback(() => {
    // Target property cards with various selectors
    const propertySelectors = [
      '[data-listing-id]',
      '[data-mls-id]',
      '[data-property-id]',
      '.property-item',
      '.listing-item',
      '.property-card',
      '.listing-card',
      '.ihf-grid-result-container',
      '.ihf-grid-result',
      '.ihf-result-item',
      'a[href*="/listing/"]',
      'a[href*="/property/"]',
      'a[href*="/details/"]',
      'a[href*="mls"]'
    ];

    let interceptedCount = 0;

    propertySelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        // Skip if already intercepted
        if (el.hasAttribute('data-intercepted')) return;

        el.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          debugLog('Property click intercepted', { element: el, selector });

          // Try to get listing ID from various attributes
          let listingId = el.getAttribute('data-listing-id') || 
                         el.getAttribute('data-mls-id') || 
                         el.getAttribute('data-property-id');

          // If no data attribute, try to extract from href
          if (!listingId) {
            const href = el.getAttribute('href');
            if (href) {
              listingId = extractPropertyIdFromUrl(href);
            }
          }

          // If still no ID, try to extract from element text or nearby elements
          if (!listingId) {
            const linkText = el.textContent?.trim();
            const numbersMatch = linkText?.match(/[A-Z0-9]{6,}|[0-9]{5,}/);
            if (numbersMatch) {
              listingId = numbersMatch[0];
            } else {
              listingId = 'unknown-' + Date.now();
            }
          }

          if (listingId) {
            debugLog('Navigating to listing', { listingId, path: `/listing/${listingId}` });
            
            // Use React Router navigation
            navigate(`/listing/${listingId}`);
          }
        };

        // Mark as intercepted
        el.setAttribute('data-intercepted', 'true');
        interceptedCount++;
      });
    });

    debugLog(`Intercepted ${interceptedCount} property links`);
    interceptedCountRef.current += interceptedCount;
  }, [debugLog, extractPropertyIdFromUrl, navigate]);

  const interceptActionButtons = useCallback(() => {
    const buttonSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      '.btn',
      '.button',
      '[role="button"]',
      '.ihf-btn',
      '.ihf-button'
    ];

    const relevantKeywords = [
      'tour', 'showing', 'schedule', 'view',
      'offer', 'bid', 'make offer',
      'favorite', 'save', 'heart',
      'info', 'contact', 'agent', 'request'
    ];

    let buttonCount = 0;
    buttonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        if (button.hasAttribute('data-enhanced')) return;

        const text = button.textContent?.toLowerCase() || '';
        const hasRelevantText = relevantKeywords.some(keyword => text.includes(keyword));
        
        if (hasRelevantText) {
          let action: 'tour' | 'offer' | 'favorite' | 'info' | null = null;
          
          if (text.includes('tour') || text.includes('showing')) {
            action = 'tour';
          } else if (text.includes('offer') || text.includes('bid')) {
            action = 'offer';
          } else if (text.includes('favorite') || text.includes('save') || text.includes('heart')) {
            action = 'favorite';
          } else if (text.includes('info') || text.includes('contact') || text.includes('agent')) {
            action = 'info';
          }

          if (action) {
            const handleClick = (event: Event) => {
              event.preventDefault();
              event.stopPropagation();
              
              const propertyData = extractPropertyData();
              
              switch (action) {
                case 'tour':
                  onScheduleTour(propertyData);
                  break;
                case 'offer':
                  onMakeOffer(propertyData);
                  break;
                case 'favorite':
                  onFavorite(propertyData);
                  break;
                case 'info':
                  onRequestInfo(propertyData);
                  break;
              }
            };

            button.addEventListener('click', handleClick, true);
            button.setAttribute('data-enhanced', 'true');
            buttonCount++;
          }
        }
      });
    });

    debugLog(`Enhanced ${buttonCount} action buttons`);
  }, [extractPropertyData, onScheduleTour, onMakeOffer, onFavorite, onRequestInfo, debugLog]);

  const scanForElements = useCallback(() => {
    interceptPropertyLinks();
    interceptActionButtons();
    removeIDXForms();
  }, [interceptPropertyLinks, interceptActionButtons, removeIDXForms]);

  useEffect(() => {
    debugLog('Initializing IDX property link interception');

    // Initial scan on DOM ready
    const initialScan = () => {
      scanForElements();
    };

    // Set up MutationObserver as specified in the instructions
    observerRef.current = new MutationObserver(() => {
      scanForElements();
    });

    // Start observing
    observerRef.current.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Multiple scan attempts to catch all IDX content
    const scanTimers = [
      setTimeout(initialScan, 100),
      setTimeout(scanForElements, 500),
      setTimeout(scanForElements, 1000),
      setTimeout(scanForElements, 2000),
      setTimeout(scanForElements, 5000)
    ];

    return () => {
      debugLog('Cleaning up IDX interception');
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      scanTimers.forEach(timer => clearTimeout(timer));
      
      // Clean up intercepted elements
      document.querySelectorAll('[data-intercepted]').forEach(el => {
        el.removeAttribute('data-intercepted');
      });
      document.querySelectorAll('[data-enhanced]').forEach(el => {
        el.removeAttribute('data-enhanced');
      });
    };
  }, [debugLog, scanForElements]);

  return {
    scanForButtons: scanForElements,
    interceptedCount: interceptedCountRef.current
  };
};
