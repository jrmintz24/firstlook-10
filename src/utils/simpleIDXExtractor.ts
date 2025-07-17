export function initSimpleIDXExtractor() {
  console.log('[Simple IDX] Initializing basic property extractor');
  
  // Simple extraction function focused on essential fields only
  const extractPropertyData = () => {
    try {
      // Check if we're on a property page
      const isPropertyPage = window.location.href.includes('listing') || 
                           window.location.href.includes('property');
      
      if (!isPropertyPage) {
        console.log('[Simple IDX] Not on property page, skipping');
        return;
      }
      
      // Get MLS ID from URL first (most reliable)
      const urlParams = new URLSearchParams(window.location.search);
      const mlsId = urlParams.get('id') || urlParams.get('mlsId') || '';
      
      if (!mlsId) {
        console.log('[Simple IDX] No MLS ID found in URL');
        return;
      }
      
      // Simple selector function - try a few key patterns
      const getText = (selectors: string[]) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent && element.textContent.trim()) {
            return element.textContent.trim();
          }
        }
        return '';
      };
      
      // Extract only the essential 11 fields
      const propertyData = {
        mlsId,
        address: getText([
          '.listing-address-1', 
          '.ui-typography.listing-address-1',
          'h1', 
          '.ihf-address'
        ]),
        price: getText([
          '.listing-price-1',
          '.ui-typography.listing-price-1', 
          '.ihf-price'
        ]),
        beds: getText([
          '.listing-beds-1',
          '.ui-typography.listing-beds-1',
          '.ihf-beds'
        ]),
        baths: getText([
          '.listing-baths-1', 
          '.ui-typography.listing-baths-1',
          '.ihf-baths'
        ]),
        sqft: getText([
          '.listing-sqft-1',
          '.ui-typography.listing-sqft-1',
          '.ihf-sqft'
        ]),
        images: Array.from(document.querySelectorAll('img[src*="listing"], img[src*="property"]'))
          .map(img => (img as HTMLImageElement).src)
          .filter(src => src && !src.includes('data:'))
          .slice(0, 10), // Limit to 10 images
        property_type: getText(['.ihf-property-type', '.property-type']),
        status: getText(['.ihf-status', '.listing-status']) || 'active',
        city: getText(['.ihf-city']),
        state: getText(['.ihf-state']),
        pageUrl: window.location.href,
        extractedAt: new Date().toISOString()
      };
      
      // Only proceed if we have the minimum required data
      if (propertyData.address && propertyData.mlsId) {
        console.log('[Simple IDX] Extracted property data:', propertyData);
        
        // Store globally and in session storage
        window.ihfPropertyData = propertyData;
        sessionStorage.setItem('ihfPropertyData', JSON.stringify(propertyData));
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
          detail: propertyData
        }));
        
        console.log('[Simple IDX] Property data extraction completed');
      } else {
        console.log('[Simple IDX] Missing required data:', {
          hasAddress: !!propertyData.address,
          hasMlsId: !!propertyData.mlsId,
          address: propertyData.address,
          mlsId: propertyData.mlsId
        });
      }
    } catch (error) {
      console.error('[Simple IDX] Extraction error:', error);
    }
  };
  
  // Simple initialization - try extraction on page load and after delays
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', extractPropertyData);
  } else {
    extractPropertyData();
  }
  
  // Try again after short delays for dynamic content
  setTimeout(extractPropertyData, 2000);
  setTimeout(extractPropertyData, 5000);
  
  // Watch for navigation changes (IDX often uses AJAX)
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      setTimeout(extractPropertyData, 1000);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('[Simple IDX] Basic property extractor initialized');
}