// iHomeFinder Property Data Extraction Script
// This script should be added to the iHomeFinder control panel in the "Widget Settings" or "Custom Code" section

<script>
(function() {
  console.log('[iHomeFinder] Property extraction script loaded');
  
  function extractPropertyData() {
    try {
      console.log('[iHomeFinder] Starting property data extraction...');
      
      // Check if we're on a property detail page
      const isPropertyPage = window.location.href.includes('listing') || 
                           window.location.href.includes('property') ||
                           document.querySelector('.ihf-property-detail') ||
                           document.querySelector('.property-detail');
                           
      if (!isPropertyPage) {
        console.log('[iHomeFinder] Not on property page, skipping extraction');
        return;
      }
      
      // Extract property data using various selectors
      const extractText = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent && element.textContent.trim()) {
            return element.textContent.trim();
          }
        }
        return '';
      };
      
      // Address selectors
      const address = extractText([
        '.ihf-address',
        '.ihf-listing-address', 
        '.ihf-property-address',
        '.property-address',
        '.listing-address',
        'h1.property-title',
        'h1.listing-title',
        '[data-testid="property-address"]',
        '.property-info .address'
      ]);
      
      // Price selectors
      const price = extractText([
        '.ihf-price',
        '.ihf-listing-price',
        '.ihf-property-price', 
        '.property-price',
        '.listing-price',
        '[data-testid="property-price"]',
        '.price-container .price'
      ]);
      
      // Beds selectors
      const beds = extractText([
        '.ihf-beds',
        '.ihf-bedrooms',
        '.property-beds',
        '.beds',
        '.bedrooms',
        '[data-testid="beds"]'
      ]);
      
      // Baths selectors  
      const baths = extractText([
        '.ihf-baths',
        '.ihf-bathrooms',
        '.property-baths', 
        '.baths',
        '.bathrooms',
        '[data-testid="baths"]'
      ]);
      
      // Square feet selectors
      const sqft = extractText([
        '.ihf-sqft',
        '.ihf-square-feet',
        '.property-sqft',
        '.sqft',
        '.square-feet',
        '[data-testid="sqft"]'
      ]);
      
      // MLS ID from URL or page
      let mlsId = '';
      const urlParams = new URLSearchParams(window.location.search);
      mlsId = urlParams.get('id') || urlParams.get('mlsId') || '';
      
      if (!mlsId) {
        const pathSegments = window.location.pathname.split('/');
        const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
        if (listingIndex !== -1 && pathSegments[listingIndex + 1]) {
          mlsId = pathSegments[listingIndex + 1];
        }
      }
      
      // Create property data object
      const propertyData = {
        address: address || '',
        price: price || '', 
        beds: beds || '',
        baths: baths || '',
        sqft: sqft || '',
        mlsId: mlsId || '',
        extractedAt: new Date().toISOString()
      };
      
      console.log('[iHomeFinder] Extracted property data:', propertyData);
      
      // Store in global variable
      window.ihfPropertyData = propertyData;
      
      // Dispatch custom event
      const event = new CustomEvent('ihfPropertyDataReady', { 
        detail: propertyData 
      });
      window.dispatchEvent(event);
      
      console.log('[iHomeFinder] Property data extraction completed and event dispatched');
      
    } catch (error) {
      console.error('[iHomeFinder] Error extracting property data:', error);
    }
  }
  
  // Run extraction when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', extractPropertyData);
  } else {
    extractPropertyData();
  }
  
  // Also run when page content changes (for SPA navigation)
  const observer = new MutationObserver(function(mutations) {
    const hasSignificantChanges = mutations.some(mutation => 
      mutation.type === 'childList' && mutation.addedNodes.length > 0
    );
    
    if (hasSignificantChanges) {
      setTimeout(extractPropertyData, 1000);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('[iHomeFinder] Property extraction script initialized');
})();
</script>