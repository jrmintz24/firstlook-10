
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
  const interceptedButtonsRef = useRef<Set<Element>>(new Set());
  const interceptedLinksRef = useRef<Set<Element>>(new Set());
  const isInterceptingRef = useRef<boolean>(false);
  const scanCountRef = useRef<number>(0);

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

    for (const selector of addressSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        address = element.textContent.trim();
        debugLog('Found address via selector', { selector, address });
        break;
      }
    }

    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        price = element.textContent.trim();
        debugLog('Found price via selector', { selector, price });
        break;
      }
    }

    for (const selector of bedsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const text = element.textContent.trim();
        if (text.includes('bed') || text.includes('BR')) {
          beds = text;
          debugLog('Found beds via selector', { selector, beds });
          break;
        }
      }
    }

    for (const selector of bathsSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const text = element.textContent.trim();
        if (text.includes('bath') || text.includes('BA')) {
          baths = text;
          debugLog('Found baths via selector', { selector, baths });
          break;
        }
      }
    }

    if (!address) {
      address = window.location.pathname.includes('/listing/') 
        ? `Property ${window.location.pathname.split('/').pop()}` 
        : 'Selected Property';
    }

    const result = {
      address,
      price,
      beds,
      baths,
      mlsId: window.location.pathname.split('/').pop() || ''
    };

    debugLog('Extracted property data', result);
    return result;
  }, [debugLog]);

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

    let removedCount = 0;
    formSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        debugLog('Removing IDX form element', { selector, element: element.tagName });
        element.remove();
        removedCount++;
      });
    });

    const actionForms = document.querySelectorAll('form[action*="contact"], form[action*="request"], form[action*="lead"]');
    actionForms.forEach(form => {
      debugLog('Removing IDX action form', form);
      form.remove();
      removedCount++;
    });

    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => {
      const hasEmail = form.querySelector('input[name*="email"], input[placeholder*="email"], input[placeholder*="Email"]');
      const hasPhone = form.querySelector('input[name*="phone"], input[placeholder*="phone"], input[placeholder*="Phone"]');
      
      if (hasEmail && hasPhone) {
        debugLog('Removing lead capture form', form);
        form.remove();
        removedCount++;
      }
    });

    if (removedCount > 0) {
      debugLog(`Removed ${removedCount} IDX forms`);
    }
  }, [debugLog]);

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

    debugLog('Extracting property ID from URL', url);

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        debugLog('Property ID extracted', { pattern: pattern.source, id: match[1] });
        return match[1];
      }
    }

    debugLog('No property ID found in URL');
    return null;
  }, [debugLog]);

  const blockPopupNavigation = useCallback(() => {
    const originalWindowOpen = window.open;
    window.open = function(...args) {
      if (isInterceptingRef.current) {
        debugLog('Blocking window.open during property navigation', args);
        return null;
      }
      return originalWindowOpen.apply(window, args);
    };

    // Block other popup methods
    const originalShowModal = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function() {
      if (isInterceptingRef.current) {
        debugLog('Blocking dialog.showModal during property navigation');
        return;
      }
      return originalShowModal.apply(this);
    };
  }, [debugLog]);

  const interceptPropertyLink = useCallback((link: Element) => {
    if (interceptedLinksRef.current.has(link)) {
      return;
    }

    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');
    const parentContainer = link.closest('.property-item, .listing-item, .property-card, .listing-card, [class*="property"], [class*="listing"], .ihf-grid-result-container, .ihf-grid-result, .ihf-result-item');
    
    debugLog('Checking link for interception', { 
      href, 
      onclick: !!onclick, 
      hasParentContainer: !!parentContainer,
      tagName: link.tagName,
      className: link.className 
    });

    if (!href && !onclick && !parentContainer) return;

    const isPropertyLink = href && (
      /\/(listing|property|details|detail)\/|mls[_-]?id|listing[_-]?id|property[_-]?id/i.test(href) ||
      parentContainer
    ) || onclick && /property|listing|detail/i.test(onclick) || parentContainer;

    if (isPropertyLink) {
      debugLog('Property link detected, intercepting', { href, element: link.tagName });

      const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        isInterceptingRef.current = true;
        
        debugLog('Property link clicked and intercepted', { href, onclick });
        
        let propertyId = null;
        
        if (href) {
          propertyId = extractPropertyIdFromUrl(href);
        }
        
        // Try to extract from data attributes
        if (!propertyId) {
          const dataId = link.getAttribute('data-id') || 
                       link.getAttribute('data-mls-id') || 
                       link.getAttribute('data-listing-id') ||
                       link.getAttribute('data-property-id');
          if (dataId) {
            propertyId = dataId;
            debugLog('Property ID from data attributes', propertyId);
          }
        }
        
        // Try to extract from parent elements
        if (!propertyId && parentContainer) {
          const parentId = parentContainer.getAttribute('data-id') || 
                          parentContainer.getAttribute('data-mls-id') || 
                          parentContainer.getAttribute('data-listing-id') ||
                          parentContainer.getAttribute('data-property-id');
          if (parentId) {
            propertyId = parentId;
            debugLog('Property ID from parent container', propertyId);
          }
        }
        
        // Enhanced fallback: try to extract from any nearby text content
        if (!propertyId) {
          const linkText = link.textContent?.trim();
          const siblingText = link.parentElement?.textContent?.trim();
          
          // Look for MLS-style IDs in link text
          const textToSearch = `${linkText} ${siblingText}`;
          const numbersMatch = textToSearch.match(/[A-Z]{2,}[0-9]{4,}|[0-9]{6,}|[A-Z0-9]{6,}/);
          if (numbersMatch) {
            propertyId = numbersMatch[0];
            debugLog('Property ID from text content', propertyId);
          } else {
            // If still no ID, generate one from current URL if it looks like a property page
            const currentUrl = window.location.href;
            const urlMatch = extractPropertyIdFromUrl(currentUrl);
            if (urlMatch) {
              propertyId = urlMatch;
              debugLog('Property ID from current URL', propertyId);
            } else {
              propertyId = 'property-' + Date.now();
              debugLog('Using timestamped fallback property ID', propertyId);
            }
          }
        }
        
        debugLog('Navigating to property page', { propertyId, path: `/listing/${propertyId}` });
        
        // Use window.location.href for reliable navigation, avoiding React Router issues
        try {
          window.location.href = `/listing/${propertyId}`;
        } catch (navigationError) {
          debugLog('Direct navigation failed, trying React Router', navigationError);
          navigate(`/listing/${propertyId}`);
        }
        
        setTimeout(() => {
          isInterceptingRef.current = false;
        }, 1000);
      };

      // Remove problematic attributes that might cause external navigation or IDX conflicts
      link.removeAttribute('target');
      link.removeAttribute('onclick');
      link.removeAttribute('data-ihf-click');
      if (link.tagName === 'A') {
        (link as HTMLAnchorElement).target = '_self';
        // Clear any IDX-specific href patterns that might cause domain errors
        const originalHref = link.getAttribute('href');
        if (originalHref && originalHref.includes('ihf') && !originalHref.startsWith('/')) {
          link.setAttribute('data-original-href', originalHref);
          link.setAttribute('href', '#');
        }
      }
      
      // Add multiple event listeners with high priority to ensure capture before IDX
      link.addEventListener('click', handleClick, { capture: true, passive: false });
      link.addEventListener('mousedown', handleClick, { capture: true, passive: false });
      link.addEventListener('touchstart', handleClick, { capture: true, passive: false });
      
      interceptedLinksRef.current.add(link);
      link.setAttribute('data-enhanced-link', 'true');
      
      debugLog('Enhanced property link', { href, propertyId: href ? extractPropertyIdFromUrl(href) : 'unknown' });
    }
  }, [debugLog, extractPropertyIdFromUrl, navigate]);

  const interceptButton = useCallback((button: Element) => {
    if (interceptedButtonsRef.current.has(button)) {
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
      debugLog('Action button detected', { text: buttonText, action });

      const handleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        const propertyData = extractPropertyData();
        debugLog('Action button clicked', { action, propertyData });
        
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
      button.addEventListener('mousedown', handleClick, true);
      interceptedButtonsRef.current.add(button);
      
      button.setAttribute('data-enhanced', 'true');
      debugLog('Enhanced action button', { text: buttonText, action });
    }
  }, [debugLog, extractPropertyData, onScheduleTour, onMakeOffer, onFavorite, onRequestInfo]);

  const scanForButtonsAndLinks = useCallback(() => {
    scanCountRef.current++;
    debugLog(`Starting scan #${scanCountRef.current}`);

    // Enhanced button selectors
    const buttonSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]',
      'a[href*="contact"]',
      'a[href*="tour"]',
      'a[href*="info"]',
      '.btn',
      '.button',
      '[role="button"]',
      '.ihf-btn',
      '.ihf-button',
      '.property-actions button',
      '.listing-actions button'
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
        const text = button.textContent?.toLowerCase() || '';
        const hasRelevantText = relevantKeywords.some(keyword => text.includes(keyword));
        
        if (hasRelevantText && !interceptedButtonsRef.current.has(button)) {
          interceptButton(button);
          buttonCount++;
        }
      });
    });

    // Enhanced link selectors with more comprehensive coverage
    const linkSelectors = [
      'a[href*="/listing/"]',
      'a[href*="/property/"]',
      'a[href*="/details/"]',
      'a[href*="/detail/"]',
      'a[href*="mls"]',
      'a[href*="listing"]',
      '.property-item a',
      '.listing-item a',
      '.property-card a',
      '.listing-card a',
      '[class*="property"] a',
      '[class*="listing"] a',
      '.ihf-grid-result-container a',
      '.ihf-grid-result a',
      '.ihf-grid-result-title a',
      '.ihf-grid-result-photo a',
      '.ihf-grid-result-basic-info a',
      '.ihf-result-item a',
      '.ihf-detail-gallery a',
      // Clickable containers that might not be links
      '.property-item[onclick]',
      '.listing-item[onclick]',
      '.property-card[onclick]',
      '.listing-card[onclick]',
      '.ihf-grid-result-container[onclick]',
      '.ihf-grid-result[onclick]',
      '.ihf-result-item[onclick]'
    ];

    let linkCount = 0;
    linkSelectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        if (!interceptedLinksRef.current.has(link)) {
          interceptPropertyLink(link);
          linkCount++;
        }
      });
    });

    // Global click interceptor as fallback
    const allClickableElements = document.querySelectorAll('a, button, [onclick], [role="button"], .clickable');
    let fallbackCount = 0;
    allClickableElements.forEach(element => {
      if (!interceptedLinksRef.current.has(element) && !interceptedButtonsRef.current.has(element)) {
        const href = element.getAttribute('href');
        const onclick = element.getAttribute('onclick');
        const text = element.textContent?.toLowerCase() || '';
        
        if ((href && /property|listing|detail/i.test(href)) || 
            (onclick && /property|listing|detail/i.test(onclick)) ||
            (text && /(view|see) (property|listing|detail)/i.test(text))) {
          interceptPropertyLink(element);
          fallbackCount++;
        }
      }
    });

    removeIDXForms();

    debugLog(`Scan #${scanCountRef.current} complete`, {
      newButtons: buttonCount,
      newLinks: linkCount,
      fallbackInterceptions: fallbackCount,
      totalIntercepted: interceptedButtonsRef.current.size + interceptedLinksRef.current.size
    });
  }, [debugLog, interceptButton, interceptPropertyLink, removeIDXForms]);

  useEffect(() => {
    debugLog('Initializing IDX button interception');
    blockPopupNavigation();

    // Multiple scan attempts with increasing delays to catch all IDX content
    const scanTimers = [
      setTimeout(() => scanForButtonsAndLinks(), 100),
      setTimeout(() => scanForButtonsAndLinks(), 500),
      setTimeout(() => scanForButtonsAndLinks(), 1000),
      setTimeout(() => scanForButtonsAndLinks(), 2000),
      setTimeout(() => scanForButtonsAndLinks(), 3000),
      setTimeout(() => scanForButtonsAndLinks(), 5000),
      setTimeout(() => scanForButtonsAndLinks(), 8000),
      setTimeout(() => scanForButtonsAndLinks(), 12000)
    ];

    // Enhanced mutation observer with more specific targeting
    observerRef.current = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if this is IDX content or contains property-related elements
              if (element.matches && (
                element.matches('.ihf-container, .ihf-grid, .ihf-results, .ihf-result, [class*="ihf-"], .property-item, .listing-item, .property-card, .listing-card, [class*="property"], [class*="listing"]') ||
                element.querySelector('.ihf-container, .ihf-grid, .ihf-results, .ihf-result, [class*="ihf-"], .property-item, .listing-item, .property-card, .listing-card, [class*="property"], [class*="listing"]')
              )) {
                debugLog('IDX content detected via mutation observer', element.className);
                shouldScan = true;
              }
            }
          });
        }
      });

      if (shouldScan) {
        debugLog('Scheduling scan due to DOM mutations');
        setTimeout(() => {
          scanForButtonsAndLinks();
        }, 300);
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Global click event listener as absolute fallback
    const globalClickHandler = (event: Event) => {
      const target = event.target as Element;
      if (target && !interceptedLinksRef.current.has(target) && !interceptedButtonsRef.current.has(target)) {
        const href = target.getAttribute('href');
        if (href && /property|listing|detail/i.test(href)) {
          debugLog('Global click handler intercepted untracked property link', href);
          event.preventDefault();
          event.stopPropagation();
          const propertyId = extractPropertyIdFromUrl(href) || 'unknown';
          navigate(`/listing/${propertyId}`);
        }
      }
    };

    document.addEventListener('click', globalClickHandler, true);

    return () => {
      debugLog('Cleaning up IDX button interception');
      scanTimers.forEach(timer => clearTimeout(timer));
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.removeEventListener('click', globalClickHandler, true);
      
      interceptedButtonsRef.current.forEach(button => {
        button.removeAttribute('data-enhanced');
      });
      interceptedLinksRef.current.forEach(link => {
        link.removeAttribute('data-enhanced-link');
      });
      interceptedButtonsRef.current.clear();
      interceptedLinksRef.current.clear();
    };
  }, [debugLog, blockPopupNavigation, scanForButtonsAndLinks, extractPropertyIdFromUrl, navigate]);

  return {
    scanForButtons: scanForButtonsAndLinks,
    interceptedCount: interceptedButtonsRef.current.size + interceptedLinksRef.current.size
  };
};
