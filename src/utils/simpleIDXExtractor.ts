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
      
      // First check for globally injected iHomeFinder data
      if (window.ihfPropertyData) {
        console.log('[Simple IDX] Found global iHomeFinder data:', window.ihfPropertyData);
        const globalData = {
          mlsId: window.ihfPropertyData.mlsId || '',
          address: window.ihfPropertyData.address || '',
          price: window.ihfPropertyData.price || '',
          beds: window.ihfPropertyData.beds || '',
          baths: window.ihfPropertyData.baths || '',
          sqft: window.ihfPropertyData.sqft || '',
          images: [],
          property_type: '',
          status: 'active',
          city: '',
          state: '',
          pageUrl: window.location.href,
          extractedAt: new Date().toISOString()
        };
        
        // Only proceed if we have the minimum required data
        if (globalData.address && globalData.mlsId) {
          console.log('[Simple IDX] Using global property data:', globalData);
          
          // Store globally and in session storage
          window.ihfPropertyData = globalData;
          sessionStorage.setItem('ihfPropertyData', JSON.stringify(globalData));
          
          // Dispatch event
          window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
            detail: globalData
          }));
          
          console.log('[Simple IDX] Property data extraction completed');
          return;
        }
      }
      
      // Get MLS ID from URL first (most reliable)
      const urlParams = new URLSearchParams(window.location.search);
      const mlsId = urlParams.get('id') || urlParams.get('mlsId') || '';
      
      if (!mlsId) {
        console.log('[Simple IDX] No MLS ID found in URL');
        return;
      }
      
      // Enhanced DOM extraction using same logic as working extractor
      const extractFromDOM = () => {
        console.log('[Simple IDX] Starting DOM extraction...');
        
        const getTextContent = (selectors: string[]) => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.trim()) {
              return element.textContent.trim();
            }
          }
          return '';
        };
        
        // Enhanced selectors based on working extractor
        const address = getTextContent([
          '.ihf-address',
          '.ihf-listing-address', 
          '.listing-address',
          '.property-address',
          '.address',
          'h1',
          '.ihf-property-title'
        ]);
        
        const price = getTextContent([
          '.ihf-price',
          '.ihf-listing-price',
          '.listing-price',
          '.property-price', 
          '.price'
        ]);
        
        const beds = getTextContent([
          '.ihf-beds',
          '.ihf-bedrooms',
          '.bedrooms',
          '.beds'
        ]);
        
        const baths = getTextContent([
          '.ihf-baths',
          '.ihf-bathrooms', 
          '.bathrooms',
          '.baths'
        ]);
        
        const sqft = getTextContent([
          '.ihf-sqft',
          '.ihf-square-feet',
          '.square-feet',
          '.sqft'
        ]);
        
        return {
          mlsId,
          address,
          price,
          beds,
          baths,
          sqft,
          images: Array.from(document.querySelectorAll('img[src*="listing"], img[src*="property"]'))
            .map(img => (img as HTMLImageElement).src)
            .filter(src => src && !src.includes('data:'))
            .slice(0, 10),
          property_type: getTextContent(['.ihf-property-type', '.property-type']),
          status: getTextContent(['.ihf-status', '.listing-status']) || 'active',
          city: getTextContent(['.ihf-city']),
          state: getTextContent(['.ihf-state']),
          pageUrl: window.location.href,
          extractedAt: new Date().toISOString()
        };
      };
      
      const propertyData = extractFromDOM();
      
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