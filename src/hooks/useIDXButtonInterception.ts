
import { useEffect, useRef } from 'react';
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
  const observerRef = useRef<MutationObserver | null>(null);
  const interceptedButtonsRef = useRef<Set<Element>>(new Set());

  const extractPropertyData = (): PropertyData => {
    // Try to extract property data from the current page
    const addressSelectors = [
      '[data-address]',
      '.address',
      '.property-address',
      '.listing-address',
      'h1',
      '.property-title',
      '.listing-title'
    ];

    const priceSelectors = [
      '[data-price]',
      '.price',
      '.property-price',
      '.listing-price',
      '.price-display'
    ];

    const bedsSelectors = [
      '[data-beds]',
      '.beds',
      '.bedroom',
      '.bedrooms'
    ];

    const bathsSelectors = [
      '[data-baths]',
      '.baths',
      '.bathroom',
      '.bathrooms'
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
        beds = element.textContent.trim();
        break;
      }
    }

    // Extract baths
    for (const selector of bathsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        baths = element.textContent.trim();
        break;
      }
    }

    // Fallback to URL or generic data if extraction fails
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
  };

  const removeIDXForms = () => {
    // Comprehensive list of selectors to remove IDX forms
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
      '.widget-request-info',
      '[class*="contact-form"]',
      '[class*="request-info"]',
      '[class*="lead-form"]',
      '[class*="sidebar-form"]',
      '[class*="sidebar-contact"]',
      '[id*="contact-form"]',
      '[id*="request-info"]',
      '[id*="lead-form"]'
    ];

    formSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        console.log('Removing IDX form element:', selector, element);
        element.remove();
      });
    });

    // Remove forms with specific actions
    const actionForms = document.querySelectorAll('form[action*="contact"], form[action*="request"], form[action*="lead"]');
    actionForms.forEach(form => {
      console.log('Removing IDX action form:', form);
      form.remove();
    });

    // Remove forms that contain typical lead capture fields
    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => {
      const hasEmail = form.querySelector('input[name*="email"], input[placeholder*="email"], input[placeholder*="Email"]');
      const hasPhone = form.querySelector('input[name*="phone"], input[placeholder*="phone"], input[placeholder*="Phone"]');
      
      if (hasEmail && hasPhone) {
        console.log('Removing lead capture form:', form);
        form.remove();
      }
    });
  };

  const interceptButton = (button: Element) => {
    if (interceptedButtonsRef.current.has(button)) {
      return; // Already intercepted
    }

    const buttonText = button.textContent?.toLowerCase() || '';
    const buttonType = button.getAttribute('data-action') || '';
    
    // Determine action based on button text or attributes
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
        
        const propertyData = extractPropertyData();
        console.log('IDX button intercepted:', action, propertyData);
        
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
      interceptedButtonsRef.current.add(button);
      
      // Add visual indicator that button is enhanced
      button.setAttribute('data-enhanced', 'true');
      console.log(`Enhanced IDX button: ${buttonText} -> ${action}`);
    }
  };

  const scanForButtons = () => {
    // Common IDX button selectors
    const buttonSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      'a[href*="contact"]',
      'a[href*="tour"]',
      'a[href*="info"]',
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
        
        if (hasRelevantText && !interceptedButtonsRef.current.has(button)) {
          interceptButton(button);
        }
      });
    });

    // Remove IDX forms after scanning for buttons
    removeIDXForms();
  };

  useEffect(() => {
    // Initial scan
    const initialScanTimer = setTimeout(() => {
      scanForButtons();
    }, 1000);

    // Set up mutation observer to watch for new buttons and forms
    observerRef.current = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shouldScan = true;
            }
          });
        }
      });

      if (shouldScan) {
        // Debounce scanning
        setTimeout(() => {
          scanForButtons();
        }, 500);
      }
    });

    // Start observing
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(initialScanTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Clean up event listeners
      interceptedButtonsRef.current.forEach(button => {
        button.removeAttribute('data-enhanced');
      });
      interceptedButtonsRef.current.clear();
    };
  }, [onScheduleTour, onMakeOffer, onFavorite, onRequestInfo]);

  return {
    scanForButtons,
    interceptedCount: interceptedButtonsRef.current.size
  };
};
