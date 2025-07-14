import { useEffect, useRef } from 'react';
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
  const interceptedButtonsRef = useRef<Set<Element>>(new Set());
  const interceptedLinksRef = useRef<Set<Element>>(new Set());

  const extractPropertyData = (): PropertyData => {
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

    for (const selector of bedsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        beds = element.textContent.trim();
        break;
      }
    }

    for (const selector of bathsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        baths = element.textContent.trim();
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
  };

  const removeIDXForms = () => {
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

    const actionForms = document.querySelectorAll('form[action*="contact"], form[action*="request"], form[action*="lead"]');
    actionForms.forEach(form => {
      console.log('Removing IDX action form:', form);
      form.remove();
    });

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

  const extractPropertyIdFromUrl = (url: string): string | null => {
    const patterns = [
      /\/listing\/([^\/\?]+)/i,
      /\/property\/([^\/\?]+)/i,
      /\/details\/([^\/\?]+)/i,
      /mls[_-]?id[=:]([^&\?]+)/i,
      /id[=:]([^&\?]+)/i,
      /\/([0-9]+)(?:[\/\?]|$)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const interceptPropertyLink = (link: Element) => {
    if (interceptedLinksRef.current.has(link)) {
      return; // Already intercepted
    }

    const href = link.getAttribute('href');
    if (!href) return;

    const isPropertyLink = /\/(listing|property|details)\/|mls[_-]?id/i.test(href) ||
                          link.closest('.property-item, .listing-item, .property-card, .listing-card, [class*="property"], [class*="listing"]');

    if (isPropertyLink) {
      const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('IDX property link intercepted:', href);
        
        const propertyId = extractPropertyIdFromUrl(href);
        
        if (propertyId) {
          navigate(`/listing/${propertyId}`);
        } else {
          const linkText = link.textContent?.trim();
          const dataId = link.getAttribute('data-id') || link.getAttribute('data-mls-id');
          const fallbackId = dataId || linkText || 'unknown';
          navigate(`/listing/${fallbackId}`);
        }
      };

      link.removeAttribute('target');
      
      link.addEventListener('click', handleClick, true);
      interceptedLinksRef.current.add(link);
      
      link.setAttribute('data-enhanced-link', 'true');
      console.log(`Enhanced IDX property link: ${href}`);
    }
  };

  const interceptButton = (button: Element) => {
    if (interceptedButtonsRef.current.has(button)) {
      return; // Already intercepted
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
      
      button.setAttribute('data-enhanced', 'true');
      console.log(`Enhanced IDX button: ${buttonText} -> ${action}`);
    }
  };

  const scanForButtonsAndLinks = () => {
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

    const linkSelectors = [
      'a[href*="/listing/"]',
      'a[href*="/property/"]',
      'a[href*="/details/"]',
      'a[href*="mls"]',
      '.property-item a',
      '.listing-item a',
      '.property-card a',
      '.listing-card a',
      '[class*="property"] a',
      '[class*="listing"] a'
    ];

    linkSelectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        if (!interceptedLinksRef.current.has(link)) {
          interceptPropertyLink(link);
        }
      });
    });

    removeIDXForms();
  };

  useEffect(() => {
    const initialScanTimer = setTimeout(() => {
      scanForButtonsAndLinks();
    }, 1000);

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
        setTimeout(() => {
          scanForButtonsAndLinks();
        }, 500);
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(initialScanTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      interceptedButtonsRef.current.forEach(button => {
        button.removeAttribute('data-enhanced');
      });
      interceptedLinksRef.current.forEach(link => {
        link.removeAttribute('data-enhanced-link');
      });
      interceptedButtonsRef.current.clear();
      interceptedLinksRef.current.clear();
    };
  }, [onScheduleTour, onMakeOffer, onFavorite, onRequestInfo, navigate]);

  return {
    scanForButtons: scanForButtonsAndLinks,
    interceptedCount: interceptedButtonsRef.current.size + interceptedLinksRef.current.size
  };
};
