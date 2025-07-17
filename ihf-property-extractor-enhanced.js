// Enhanced ihf-property-extractor.js for iHomeFinder control panel
(function(){
  var extractData = function() {
    try {
      console.log('Starting enhanced property data extraction...');
      
      // Enhanced selectors for comprehensive data extraction
      var extractors = {
        address: [
          '.ihf-address', '.ihf-listing-address', '.property-address', '.address', 
          '[itemprop="streetAddress"]', '.listing-address', '.property-street-address',
          '.ihf-detail-address', '.detail-address', 'h1', 'h2'
        ],
        price: [
          '.ihf-price', '.ihf-listing-price', '.property-price', '.price', 
          '[itemprop="price"]', '.listing-price', '.price-value', '.current-price',
          '.ihf-detail-price', '.detail-price'
        ],
        beds: [
          '.ihf-beds', '.bedrooms', '.beds', '[data-beds]', '.bed-count',
          '.ihf-detail-beds', '.detail-beds', '.bedroom-count'
        ],
        baths: [
          '.ihf-baths', '.bathrooms', '.baths', '[data-baths]', '.bath-count',
          '.ihf-detail-baths', '.detail-baths', '.bathroom-count'
        ],
        sqft: [
          '.ihf-sqft', '.square-feet', '.sqft', '[data-sqft]', '.sq-ft',
          '.ihf-detail-sqft', '.detail-sqft', '.square-footage'
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
      
      // Extract text data
      var data = {};
      for (var key in extractors) {
        if (key !== 'images') {
          for (var i = 0; i < extractors[key].length; i++) {
            var el = document.querySelector(extractors[key][i]);
            if (el) {
              data[key] = el.textContent.trim();
              break;
            }
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
        
        console.log('Extracted property data:', window.ihfPropertyData);
        
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
  
  // Multiple extraction attempts for reliability
  setTimeout(extractData, 1000);
  setTimeout(extractData, 3000);
  setTimeout(extractData, 5000);
  
  console.log('Enhanced property extractor initialized');
})();