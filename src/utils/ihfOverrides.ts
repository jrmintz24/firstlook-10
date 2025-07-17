export function initIhfOverrides() {
  console.log('[IHF Override] Starting enhanced initialization');
  
  // Inject enhanced property extractor script immediately
  injectEnhancedExtractor();
  
  document.addEventListener('DOMContentLoaded', () => {
    hideIhfForms();
    preserveExtractionElements();

    const observer = new MutationObserver(() => {
      const tourBtn = document.querySelector(
        'button.ihf-btn-tour'
      ) as HTMLButtonElement | null;
      const contactBtn = document.querySelector(
        'button.ihf-btn-contact'
      ) as HTMLButtonElement | null;

      let rewired = false;

      if (tourBtn && !tourBtn.getAttribute('data-rewired')) {
        rewired = true;
        tourBtn.textContent = 'Schedule Tour';
        tourBtn.setAttribute('data-rewired', 'true');
        tourBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const listingId = extractListingId();
          window.location.href = `/schedule-tour?listing=${listingId}`;
        });
      }

      if (contactBtn && !contactBtn.getAttribute('data-rewired')) {
        rewired = true;
        contactBtn.textContent = 'Make an Offer';
        contactBtn.setAttribute('data-rewired', 'true');
        contactBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const listingId = extractListingId();
          window.location.href = `/make-offer?listing=${listingId}`;
        });
      }

      if (rewired) {
        injectToolbar();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export function extractListingId(): string {
  const match = window.location.href.match(/id=([^&]+)/);
  return match ? match[1] : '';
}

function injectToolbar() {
  const detailContainer = document.querySelector('.ihf-detail');
  if (detailContainer && !document.getElementById('custom-toolbar')) {
    const bar = document.createElement('div');
    bar.id = 'custom-toolbar';
    bar.style.background = '#f9f9f9';
    bar.style.padding = '12px';
    bar.style.borderBottom = '1px solid #ccc';
    bar.style.textAlign = 'center';

    const tour = document.createElement('button');
    tour.textContent = 'Schedule Tour';
    tour.addEventListener('click', () => {
      const id = extractListingId();
      window.location.href = `/schedule-tour?listing=${id}`;
    });

    const offer = document.createElement('button');
    offer.textContent = 'Make an Offer';
    offer.addEventListener('click', () => {
      const id = extractListingId();
      window.location.href = `/make-offer?listing=${id}`;
    });

    bar.append(tour, offer);
    detailContainer.prepend(bar);
  }
}

function hideIhfForms() {
  // Add styles to ensure our elements are preserved while hiding IDX forms
  const style = document.createElement('style');
  style.textContent = `
    /* Hide IDX request forms but preserve elements needed for extraction */
    .ihf-request-form:not([data-preserve-for-extraction]), 
    .ihf-tour-request-form:not([data-preserve-for-extraction]) { 
      display: none !important; 
    }
    
    /* Ensure our custom toolbar and rewired buttons are always visible */
    .ihf-custom-toolbar {
      display: flex !important;
      visibility: visible !important;
    }
    
    button[data-rewired="true"] {
      display: inline-block !important;
      visibility: visible !important;
    }
    
    /* Preserve elements that might contain property data */
    [class*="property"]:not([class*="request"]):not([class*="contact"]),
    [class*="listing"]:not([class*="request"]):not([class*="contact"]),
    [class*="mls"]:not([class*="request"]):not([class*="contact"]),
    [data-preserve-for-extraction] {
      display: block !important;
      visibility: visible !important;
    }
  `;
  document.head.append(style);
}

function preserveExtractionElements() {
  // Mark elements that contain property data for preservation
  const selectors = [
    '.ihf-address', '.ihf-listing-address', '.property-address', '.address',
    '.ihf-price', '.ihf-listing-price', '.property-price', '.price',
    '.ihf-beds', '.bedrooms', '.beds', '.ihf-baths', '.bathrooms', '.baths',
    '.ihf-sqft', '.square-feet', '.sqft', '.ihf-mls-number', '.mls-number',
    '[itemprop="streetAddress"]', '[itemprop="price"]', '[data-beds]', '[data-baths]',
    '[data-sqft]', '[data-mls]', '.listing-address', '.listing-price',
    '.ihf-detail-address', '.ihf-detail-price', '.ihf-detail-beds', '.ihf-detail-baths'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.setAttribute('data-preserve-for-extraction', 'true');
    });
  });
  
  // Also preserve any parent containers that might be important
  const containers = document.querySelectorAll('.ihf-property-detail, .property-detail, .listing-detail');
  containers.forEach(container => {
    container.setAttribute('data-preserve-for-extraction', 'true');
  });
}

function injectEnhancedExtractor() {
  console.log('[IHF Override] Injecting enhanced property extractor');
  
  const script = document.createElement('script');
  script.textContent = `
    // Enhanced ihf-property-extractor.js for iHomeFinder control panel
    (function(){
      var extractData = function() {
        try {
          console.log('[Enhanced Extractor] Starting property data extraction...');
          
          // Check if we're on a property detail page
          const isPropertyPage = window.location.href.includes('listing') || 
                               window.location.href.includes('property') ||
                               document.querySelector('.ihf-property-detail') ||
                               document.querySelector('.property-detail');
                               
          if (!isPropertyPage) {
            console.log('[Enhanced Extractor] Not on property page, skipping extraction');
            return;
          }
          
          // Debug: Show what elements are available on the page
          console.log('🔍 [Enhanced Extractor] Available elements on page:');
          console.log('  - All divs with class containing "ihf":', document.querySelectorAll('div[class*="ihf"]'));
          console.log('  - All elements with class containing "price":', document.querySelectorAll('[class*="price"]'));
          console.log('  - All elements with class containing "address":', document.querySelectorAll('[class*="address"]'));
          console.log('  - All elements with class containing "bed":', document.querySelectorAll('[class*="bed"]'));
          console.log('  - All elements with class containing "bath":', document.querySelectorAll('[class*="bath"]'));
          console.log('  - All h1 elements:', document.querySelectorAll('h1'));
          console.log('  - All h2 elements:', document.querySelectorAll('h2'));
          console.log('  - All span elements:', document.querySelectorAll('span'));
          console.log('  - Page HTML preview:', document.body.outerHTML.substring(0, 1000));
          
          // Enhanced extraction function combining best selectors from both systems
          const extractText = (selectors) => {
            console.log('🔍 [extractText] Trying selectors:', selectors);
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              console.log('🔍 [extractText] Selector:', selector, 'Element:', element, 'Text:', element?.textContent?.trim());
              if (element && element.textContent && element.textContent.trim()) {
                console.log('✅ [extractText] Found match:', selector, '=', element.textContent.trim());
                return element.textContent.trim();
              }
            }
            console.log('❌ [extractText] No matches found for selectors:', selectors);
            return '';
          };
          
          // Comprehensive selectors combining both systems
          var extractors = {
            address: [
              '.listing-address-1', '.ui-typography.listing-address-1', 
              'p.listing-address-1', '.listing-address',
              '.ihf-address', '.ihf-listing-address', '.ihf-property-address',
              '.property-address', '.address', 
              '[itemprop="streetAddress"]', '.property-street-address',
              '.ihf-detail-address', '.detail-address', 
              'h1.property-title', 'h1.listing-title',
              '[data-testid="property-address"]', '.property-info .address',
              'h1', 'h2'
            ],
            price: [
              '.listing-price-1', '.ui-typography.listing-price-1', 
              'p.listing-price-1', '.listing-price',
              '.ihf-price', '.ihf-listing-price', '.ihf-property-price',
              '.property-price', '.price', 
              '[itemprop="price"]', '.price-value', '.current-price',
              '.ihf-detail-price', '.detail-price',
              '[data-testid="property-price"]', '.price-container .price'
            ],
            beds: [
              '.listing-beds-1', '.ui-typography.listing-beds-1', 
              'p.listing-beds-1', '.listing-beds',
              '.ihf-beds', '.ihf-bedrooms', '.bedrooms', '.beds',
              '[data-beds]', '.bed-count', '.property-beds',
              '.ihf-detail-beds', '.detail-beds', '.bedroom-count',
              '[data-testid="beds"]'
            ],
            baths: [
              '.listing-baths-1', '.ui-typography.listing-baths-1', 
              'p.listing-baths-1', '.listing-baths',
              '.ihf-baths', '.ihf-bathrooms', '.bathrooms', '.baths',
              '[data-baths]', '.bath-count', '.property-baths',
              '.ihf-detail-baths', '.detail-baths', '.bathroom-count',
              '[data-testid="baths"]'
            ],
            sqft: [
              '.listing-sqft-1', '.ui-typography.listing-sqft-1', 
              'p.listing-sqft-1', '.listing-sqft',
              '.ihf-sqft', '.ihf-square-feet', '.square-feet', '.sqft',
              '[data-sqft]', '.sq-ft', '.property-sqft',
              '.ihf-detail-sqft', '.detail-sqft', '.square-footage',
              '[data-testid="sqft"]'
            ],
            mlsId: [
              '.ihf-mls-number', '.mls-number', '[data-mls]', '.listing-mls',
              '.ihf-detail-mls', '.detail-mls', '.mls-id', '.listing-number'
            ],
            listingId: ['.ihf-listing-number', '[data-listing-id]'],
            status: ['.ihf-status', '.listing-status', '[data-status]'],
            propertyType: ['.ihf-property-type', '.property-type', '[data-property-type]'],
            yearBuilt: ['.ihf-year-built', '.year-built', '[data-year-built]'],
            lotSize: ['.ihf-lot-size', '.lot-size', '[data-lot-size]'],
            city: ['.ihf-city', '[itemprop="addressLocality"]'],
            state: ['.ihf-state', '[itemprop="addressRegion"]'],
            zip: ['.ihf-zip', '[itemprop="postalCode"]'],
            description: ['.ihf-description', '.property-description', '[itemprop="description"]'],
            agentName: ['.ihf-listing-agent-name', '.agent-name', '[itemprop="agent"]'],
            agentPhone: ['.ihf-listing-agent-phone', '.agent-phone'],
            agentEmail: ['.ihf-listing-agent-email', '.agent-email'],
            images: [] // Special handling below
          };
          
          // Extract text data using enhanced extraction
          var data = {};
          for (var key in extractors) {
            if (key !== 'images') {
              data[key] = extractText(extractors[key]);
            }
          }
          
          // Enhanced MLS ID extraction from URL if not found in page
          if (!data.mlsId) {
            const urlParams = new URLSearchParams(window.location.search);
            data.mlsId = urlParams.get('id') || urlParams.get('mlsId') || '';
            
            if (!data.mlsId) {
              const pathSegments = window.location.pathname.split('/');
              const listingIndex = pathSegments.findIndex(segment => segment === 'listing');
              if (listingIndex !== -1 && pathSegments[listingIndex + 1]) {
                data.mlsId = pathSegments[listingIndex + 1];
              }
            }
          }
          
          // Extract images with enhanced selectors
          var imageSelectors = [
            '.ihf-main-image img', '.ihf-slideshow img', '.property-photo img', 
            '.gallery img', '.listing-photos img', '.detail-photos img',
            '.carousel img', '.slider img', '.photo-gallery img',
            'img[src*="listing"]', 'img[src*="property"]'
          ];
          var images = [];
          imageSelectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(img) {
              if (img.src && img.src.indexOf('data:') !== 0 && !images.includes(img.src)) {
                images.push(img.src);
              }
            });
          });
          data.images = images.slice(0, 20); // Limit to 20 images
          
          // Extract features/amenities
          var features = [];
          var featureSelectors = ['.ihf-features li', '.property-features li', '.amenities li'];
          featureSelectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(li) {
              features.push(li.textContent.trim());
            });
          });
          data.features = features;
          
          // Extract virtual tour link
          var virtualTourSelectors = ['a[href*="matterport"]', 'a[href*="virtualtour"]', '.virtual-tour-link'];
          virtualTourSelectors.forEach(function(selector) {
            var tourLink = document.querySelector(selector);
            if (tourLink && tourLink.href) {
              data.virtualTourUrl = tourLink.href;
            }
          });
          
          // Extract coordinates if available
          var mapContainer = document.querySelector('.ihf-map-container, [data-latitude]');
          if (mapContainer) {
            data.latitude = mapContainer.getAttribute('data-latitude');
            data.longitude = mapContainer.getAttribute('data-longitude');
          }
          
          // Build comprehensive property object
          if (data.address || data.mlsId) {
            window.ihfPropertyData = {
              ...data,
              extractedAt: new Date().toISOString(),
              pageUrl: window.location.href
            };
            
            console.log('🔍 [Enhanced Extractor] Extracted property data:', window.ihfPropertyData);
            console.log('🔍 [Enhanced Extractor] Raw extraction data:', data);
            console.log('🔍 [Enhanced Extractor] Page URL:', window.location.href);
            
            // Store in sessionStorage for persistence
            sessionStorage.setItem('ihfPropertyData', JSON.stringify(window.ihfPropertyData));
            
            // Dispatch events
            window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
              detail: window.ihfPropertyData
            }));
            
            // Also dispatch to parent frame if in iframe
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ihfPropertyData',
                data: window.ihfPropertyData
              }, '*');
            }
            
            console.log('Property data extraction completed successfully');
          } else {
            console.log('No property data found to extract');
          }
        } catch(e) {
          console.error('Property data extraction error:', e);
        }
      };
      
      // Listen for AJAX completion (iHomeFinder loads data dynamically)
      var origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
          console.log('AJAX request completed, extracting data...');
          setTimeout(extractData, 500);
        });
        origOpen.apply(this, arguments);
      };
      
      // MutationObserver for dynamic content
      var observer = new MutationObserver(function(mutations) {
        var shouldExtract = mutations.some(function(mutation) {
          return mutation.addedNodes.length > 0;
        });
        if (shouldExtract) {
          console.log('DOM mutation detected, extracting data...');
          setTimeout(extractData, 100);
        }
      });
      
      // Start observing when DOM is ready
      function startObserving() {
        var targetNode = document.querySelector('.ihf-container, .ihf-listing-detail, body');
        if (targetNode) {
          observer.observe(targetNode, {
            childList: true,
            subtree: true
          });
          console.log('MutationObserver started');
        }
      }
      
      // Listen for trigger event from control panel coordinator
      window.addEventListener('ihfTriggerExtraction', function() {
        console.log('Received trigger event from control panel coordinator');
        extractData();
      });
      
      // Initialize
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          console.log('DOM loaded, starting extraction...');
          extractData();
          startObserving();
        });
      } else {
        console.log('DOM already loaded, starting extraction...');
        extractData();
        startObserving();
      }
      
      // Multiple extraction attempts for reliability with longer delays
      setTimeout(extractData, 1000);
      setTimeout(extractData, 3000);
      setTimeout(extractData, 5000);
      setTimeout(extractData, 10000);
      setTimeout(extractData, 15000);
      
      console.log('Enhanced property extractor initialized');
    })();
  `;
  
  document.head.appendChild(script);
}
