import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyData } from '@/utils/propertyDataUtils';

interface SimplifiedIDXInterceptionProps {
  onScheduleTour: (property: PropertyData) => void;
  onMakeOffer: (property: PropertyData) => void;
  onFavorite: (property: PropertyData) => void;
  onRequestInfo: (property: PropertyData) => void;
}

export const useSimplifiedIDXInterception = ({
  onScheduleTour,
  onMakeOffer,
  onFavorite,
  onRequestInfo
}: SimplifiedIDXInterceptionProps) => {
  const navigate = useNavigate();
  const observerRef = useRef<MutationObserver | null>(null);
  const interceptedElementsRef = useRef<Set<Element>>(new Set());

  const extractPropertyData = useCallback((): PropertyData => {
    const addressSelectors = [
      '[data-address]',
      '.address',
      '.property-address', 
      '.listing-address',
      'h1',
      '.ihf-grid-result-title',
      '.ihf-detail-address'
    ];

    const priceSelectors = [
      '[data-price]',
      '.price',
      '.property-price',
      '.listing-price',
      '.ihf-grid-result-price',
      '.ihf-detail-price'
    ];

    const bedsSelectors = [
      '[data-beds]',
      '.beds',
      '.bedroom',
      '.bedrooms',
      '.ihf-grid-result-basic-info-item'
    ];

    const bathsSelectors = [
      '[data-baths]',
      '.baths', 
      '.bathroom',
      '.bathrooms',
      '.ihf-grid-result-basic-info-item'
    ];

    let address = '';
    let price = '';
    let beds = '';
    let baths = '';

    // Extract address
    for (const selector of addressSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        address = element.textContent.trim();
        break;
      }
    }

    // Extract price
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        price = element.textContent.trim();
        break;
      }
    }

    // Extract beds
    for (const selector of bedsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const text = element.textContent.trim();
        if (text.includes('bed') || text.includes('BR')) {
          beds = text;
          break;
        }
      }
    }

    // Extract baths
    for (const selector of bathsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const text = element.textContent.trim();
        if (text.includes('bath') || text.includes('BA')) {
          baths = text;
          break;
        }
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
      /mls[_-]?id[=:]([^&\?#]+)/i,
      /listing[_-]?id[=:]([^&\?#]+)/i,
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

  const interceptPropertyLink = useCallback((element: Element) => {
    if (interceptedElementsRef.current.has(element)) {
      return;
    }

    const href = element.getAttribute('href');
    const listingId = element.getAttribute('data-listing-id') ||
                     element.getAttribute('data-id') ||
                     element.getAttribute('data-mls-id') ||
                     element.getAttribute('data-property-id');

    // Check if this is a property link
    const isPropertyLink = href && (
      /\/(listing|property|details|detail)\//.test(href) ||
      /mls[_-]?id|listing[_-]?id|property[_-]?id/.test(href)
    ) || listingId;

    if (isPropertyLink) {
      const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        let propertyId = listingId;

        if (!propertyId && href) {
          propertyId = extractPropertyIdFromUrl(href);
        }

        if (!propertyId) {
          // Fallback to extracting from link text or nearby elements
          const linkText = element.textContent?.trim();
          const numbersMatch = linkText?.match(/[A-Z0-9]{6,}|[0-9]{5,}/);
          if (numbersMatch) {
            propertyId = numbersMatch[0];
          } else {
            propertyId = 'unknown-' + Date.now();
          }
        }

        console.log('[SimplifiedIDX] Navigating to property:', propertyId);
        navigate(`/listing/${propertyId}`);
      };

      // Override click behavior
      (element as any).onclick = handleClick;
      element.addEventListener('click', handleClick, true);
      
      interceptedElementsRef.current.add(element);
      element.setAttribute('data-enhanced-link', 'true');
    }
  }, [extractPropertyIdFromUrl, navigate]);

  const interceptActionButton = useCallback((button: Element) => {
    if (interceptedElementsRef.current.has(button)) {
      return;
    }

    const buttonText = button.textContent?.toLowerCase() || '';
    const buttonType = button.getAttribute('data-action') || '';
    
    let action: 'tour' | 'offer' | 'favorite' | 'info' | null = null;
    
    if (buttonText.includes('tour') || buttonText.includes('showing') || buttonType.includes('tour')) {
      action = 'tour';
    } else if (buttonText.includes('offer') || buttonText.includes('bid') || buttonType.includes('offer')) {
      action = 'offer';
    } else if (buttonText.includes('favorite') || buttonText.includes('save') || buttonText.includes('heart') || buttonType.includes('favorite')) {
      action = 'favorite';
    } else if (buttonText.includes('info') || buttonText.includes('contact') || buttonText.includes('agent') || buttonType.includes('contact')) {
      action = 'info';
    }

    if (action) {
      const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
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
      interceptedElementsRef.current.add(button);
      button.setAttribute('data-enhanced', 'true');
    }
  }, [extractPropertyData, onScheduleTour, onMakeOffer, onFavorite, onRequestInfo]);

  const scanForElements = useCallback(() => {
    console.log('[SimplifiedIDX] Scanning for elements to intercept');

    // Look for property links with data-listing-id
    const propertyLinks = document.querySelectorAll('[data-listing-id], [data-id], [data-mls-id], [data-property-id]');
    propertyLinks.forEach(link => {
      if (!interceptedElementsRef.current.has(link)) {
        interceptPropertyLink(link);
      }
    });

    // Look for standard property links
    const linkSelectors = [
      'a[href*="/listing/"]',
      'a[href*="/property/"]',
      'a[href*="/details/"]',
      'a[href*="mls"]',
      '.property-item a',
      '.listing-item a',
      '.ihf-grid-result-container a',
      '.ihf-grid-result a'
    ];

    linkSelectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        if (!interceptedElementsRef.current.has(link)) {
          interceptPropertyLink(link);
        }
      });
    });

    // Look for action buttons
    const buttonSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      '.btn',
      '.button',
      '[role="button"]'
    ];

    const relevantKeywords = [
      'tour', 'showing', 'schedule', 'view',
      'offer', 'bid', 'make offer',
      'favorite', 'save', 'heart',
      'info', 'contact', 'agent', 'request'
    ];

    buttonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        const text = button.textContent?.toLowerCase() || '';
        const hasRelevantText = relevantKeywords.some(keyword => text.includes(keyword));
        
        if (hasRelevantText && !interceptedElementsRef.current.has(button)) {
          interceptActionButton(button);
        }
      });
    });

    console.log('[SimplifiedIDX] Enhanced', interceptedElementsRef.current.size, 'elements');
  }, [interceptPropertyLink, interceptActionButton]);

  useEffect(() => {
    // Set up mutation observer to watch for new content
    observerRef.current = new MutationObserver(() => {
      scanForElements();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial scan
    scanForElements();

    // Additional scans with delays to catch dynamically loaded content
    const timeouts = [1000, 3000, 5000].map(delay =>
      setTimeout(scanForElements, delay)
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [scanForElements]);

  return {
    scanForElements,
    interceptedCount: interceptedElementsRef.current.size
  };
};