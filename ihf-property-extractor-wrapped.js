<script type="text/javascript">
(function(){
  console.log('🏠 [Enhanced IHF] Starting improved property extractor...');
  
  var extractData = function() {
    try {
      console.log('🔍 [Enhanced IHF] Extracting property data...');
      
      // Wait for dynamic content to load
      var maxAttempts = 10;
      var currentAttempt = 0;
      
      function tryExtraction() {
        currentAttempt++;
        console.log('🔄 [Enhanced IHF] Extraction attempt ' + currentAttempt + '/' + maxAttempts);
        
        // Enhanced selectors based on common iHomeFinder structures
        var data = {
          address: extractBySelectors([
            '.ihf-detail-address', '.ihf-listing-address', '.ihf-address',
            '.listing-address', '.property-address', '.detail-address',
            'h1[class*="address"]', 'h2[class*="address"]', '.address-line',
            '[data-address]', '.listing-detail-address'
          ]),
          
          price: extractBySelectors([
            '.ihf-detail-price', '.ihf-listing-price', '.ihf-price',
            '.listing-price', '.property-price', '.detail-price',
            '.price-display', '.current-price', '[data-price]',
            '.listing-detail-price', 'span[class*="price"]'
          ]),
          
          beds: extractBySelectors([
            '.ihf-detail-beds', '.ihf-beds', '.bedrooms', '.beds',
            '.bed-count', '.bedroom-count', '[data-beds]',
            '.listing-detail-beds', 'span[class*="bed"]'
          ]),
          
          baths: extractBySelectors([
            '.ihf-detail-baths', '.ihf-baths', '.bathrooms', '.baths',
            '.bath-count', '.bathroom-count', '[data-baths]',
            '.listing-detail-baths', 'span[class*="bath"]'
          ]),
          
          sqft: extractBySelectors([
            '.ihf-detail-sqft', '.ihf-sqft', '.square-feet', '.sqft',
            '.sq-ft', '.square-footage', '[data-sqft]',
            '.listing-detail-sqft', 'span[class*="sqft"]', 'span[class*="square"]'
          ]),
          
          mlsId: extractMLSId()
        };
        
        // Text-based extraction as fallback
        if (!data.price) data.price = extractFromText(/\$[\d,]+/, 'price');
        if (!data.beds) data.beds = extractFromText(/(\d+)\s*bed/i, 'beds');
        if (!data.baths) data.baths = extractFromText(/(\d+\.?\d*)\s*bath/i, 'baths');
        if (!data.sqft) data.sqft = extractFromText(/([\d,]+)\s*(?:sq\s*ft|sqft|square\s*feet)/i, 'sqft');
        
        // Check if we have meaningful data
        var hasData = data.address || data.price || data.beds || data.baths || data.sqft;
        
        console.log('🔍 [Enhanced IHF] Extracted data:', data);
        console.log('🔍 [Enhanced IHF] Has meaningful data:', hasData);
        
        if (hasData || currentAttempt >= maxAttempts) {
          finalizeExtraction(data);
        } else {
          console.log('⏰ [Enhanced IHF] No data found, retrying in 1 second...');
          setTimeout(tryExtraction, 1000);
        }
      }
      
      tryExtraction();
      
    } catch(e) {
      console.error('❌ [Enhanced IHF] Extraction error:', e);
    }
  };
  
  // Enhanced selector-based extraction
  function extractBySelectors(selectors) {
    for (var i = 0; i < selectors.length; i++) {
      try {
        var element = document.querySelector(selectors[i]);
        if (element && element.textContent && element.textContent.trim()) {
          var text = element.textContent.trim();
          console.log('✅ [Enhanced IHF] Found with selector "' + selectors[i] + '":', text);
          return cleanText(text);
        }
      } catch(e) {
        // Skip invalid selectors
      }
    }
    return '';
  }
  
  // Extract MLS ID from multiple sources
  function extractMLSId() {
    // Try URL parameters first
    var urlParams = new URLSearchParams(window.location.search);
    var mlsFromUrl = urlParams.get('id') || urlParams.get('mlsId') || urlParams.get('listingId');
    if (mlsFromUrl) {
      console.log('✅ [Enhanced IHF] MLS ID from URL:', mlsFromUrl);
      return mlsFromUrl;
    }
    
    // Try page elements
    var mlsSelectors = [
      '.ihf-mls-number', '.mls-number', '[data-mls]', 
      '.listing-mls', '.listing-number', '.mls-id'
    ];
    
    return extractBySelectors(mlsSelectors) || 'unknown';
  }
  
  // Text-based extraction from page content
  function extractFromText(pattern, type) {
    try {
      var bodyText = document.body.innerText || document.body.textContent || '';
      var matches = bodyText.match(pattern);
      if (matches && matches.length > 0) {
        var value = matches[1] || matches[0];
        console.log('✅ [Enhanced IHF] Found ' + type + ' in text:', value);
        return cleanText(value);
      }
    } catch(e) {
      console.log('❌ [Enhanced IHF] Error extracting ' + type + ' from text:', e);
    }
    return '';
  }
  
  // Clean extracted text
  function cleanText(text) {
    if (!text) return '';
    return text.replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  // Finalize and save extraction
  function finalizeExtraction(data) {
    console.log('🎯 [Enhanced IHF] Finalizing extraction with data:', data);
    
    // Ensure we have at least an address or MLS ID
    if (!data.address && !data.mlsId) {
      console.log('❌ [Enhanced IHF] No address or MLS ID found, aborting');
      return;
    }
    
    // Build comprehensive property object
    var propertyData = {
      idxId: data.mlsId,
      mlsId: data.mlsId,
      address: data.address,
      price: data.price,
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      property_type: extractPropertyType(),
      status: 'active',
      images: extractImages(),
      extractedAt: new Date().toISOString(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      extractorVersion: '2.3'
    };
    
    console.log('✅ [Enhanced IHF] Final property data:', propertyData);
    
    // Store globally
    window.ihfPropertyData = propertyData;
    
    // Store in sessionStorage
    try {
      sessionStorage.setItem('ihfPropertyData', JSON.stringify(propertyData));
    } catch(e) {
      console.log('⚠️ [Enhanced IHF] Could not store in sessionStorage:', e);
    }
    
    // Send to your backend
    sendToBackend(propertyData);
    
    // Dispatch events
    try {
      window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
        detail: propertyData
      }));
      
      // Also dispatch to parent if in iframe
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ihfPropertyData',
          data: propertyData
        }, '*');
      }
    } catch(e) {
      console.log('⚠️ [Enhanced IHF] Could not dispatch events:', e);
    }
    
    console.log('🎉 [Enhanced IHF] Property extraction completed successfully!');
  }
  
  // Extract property type
  function extractPropertyType() {
    var bodyText = (document.body.innerText || '').toLowerCase();
    if (bodyText.indexOf('single family') !== -1) return 'Single Family';
    if (bodyText.indexOf('condominium') !== -1 || bodyText.indexOf('condo') !== -1) return 'Condo';
    if (bodyText.indexOf('townhouse') !== -1) return 'Townhouse';
    if (bodyText.indexOf('multi-family') !== -1) return 'Multi-Family';
    return 'Single Family';
  }
  
  // Extract images
  function extractImages() {
    var images = [];
    var imgElements = document.querySelectorAll('img');
    
    for (var i = 0; i < imgElements.length && images.length < 10; i++) {
      var img = imgElements[i];
      var src = img.src || img.getAttribute('data-src');
      
      if (src && 
          src.indexOf('http') === 0 && 
          src.indexOf('logo') === -1 && 
          src.indexOf('icon') === -1 &&
          (img.width > 200 || img.naturalWidth > 200)) {
        images.push(src);
      }
    }
    
    console.log('✅ [Enhanced IHF] Found ' + images.length + ' images');
    return images;
  }
  
  // Send data to your backend
  function sendToBackend(propertyData) {
    try {
      console.log('📤 [Enhanced IHF] Sending data to backend...');
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/upsert-idx-property');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE');
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('✅ [Enhanced IHF] Successfully sent to backend');
            try {
              var result = JSON.parse(xhr.responseText);
              console.log('✅ [Enhanced IHF] Backend result:', result);
            } catch(e) {
              console.log('✅ [Enhanced IHF] Backend responded successfully');
            }
          } else {
            console.error('❌ [Enhanced IHF] Backend error:', xhr.status, xhr.statusText);
          }
        }
      };
      
      xhr.send(JSON.stringify({ property: propertyData }));
      
    } catch(e) {
      console.error('❌ [Enhanced IHF] Send to backend error:', e);
    }
  }
  
  // Initialize with multiple triggers
  console.log('🚀 [Enhanced IHF] Initializing extraction triggers...');
  
  // Immediate extraction
  if (document.readyState === 'complete') {
    setTimeout(extractData, 100);
  } else {
    if (window.addEventListener) {
      window.addEventListener('load', function() {
        setTimeout(extractData, 500);
      });
    } else {
      window.attachEvent('onload', function() {
        setTimeout(extractData, 500);
      });
    }
  }
  
  // DOM mutation observer for dynamic content
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      var significantChange = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          significantChange = true;
          break;
        }
      }
      
      if (significantChange) {
        console.log('🔄 [Enhanced IHF] DOM changed, re-extracting...');
        setTimeout(extractData, 200);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }
  
  // Periodic extraction attempts for reliability
  setTimeout(extractData, 1000);
  setTimeout(extractData, 3000);
  setTimeout(extractData, 5000);
  
  // URL change detection (for single-page apps)
  var currentUrl = window.location.href;
  setInterval(function() {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      console.log('🔄 [Enhanced IHF] URL changed, re-extracting...');
      setTimeout(extractData, 1000);
    }
  }, 2000);
  
  console.log('✅ [Enhanced IHF] Enhanced property extractor initialized successfully!');
})();
</script>