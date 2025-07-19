// UPDATED iHomeFinder Property Extractor - Replace your current script with this
(function(){
  console.log('🚀 Starting UPDATED iHomeFinder property extractor...');
  
  var hasExtracted = false;
  var maxAttempts = 20;
  var currentAttempt = 0;
  
  var extractPropertyData = function() {
    if (hasExtracted) return true;
    
    currentAttempt++;
    console.log(`🔍 Extraction attempt ${currentAttempt}/${maxAttempts}`);
    
    try {
      // Comprehensive selectors that should work with most iHomeFinder themes
      var selectors = {
        address: [
          'h1', 'h2', '.property-title', '.listing-title', '.ihf-listing-address',
          '.address', '.property-address', '.listing-address',
          '[class*="address"]', '[class*="title"]'
        ],
        price: [
          '.price', '.listing-price', '.property-price', '.ihf-price',
          '[class*="price"]', '[data-price]'
        ],
        beds: [
          '.beds', '.bedrooms', '.ihf-beds', '[class*="bed"]',
          '[data-beds]', 'span:contains("bed")', 'div:contains("bed")'
        ],
        baths: [
          '.baths', '.bathrooms', '.ihf-baths', '[class*="bath"]',
          '[data-baths]', 'span:contains("bath")', 'div:contains("bath")'
        ],
        sqft: [
          '.sqft', '.square-feet', '.ihf-sqft', '[class*="sqft"]',
          '[class*="square"]', '[data-sqft]'
        ],
        mlsId: [
          '.mls', '.mls-number', '.ihf-mls', '[class*="mls"]',
          '[data-mls]', '.listing-number'
        ]
      };
      
      var extractedData = {
        extractedAt: new Date().toISOString(),
        pageUrl: window.location.href
      };
      
      // Get MLS ID from URL first
      var urlMatch = window.location.href.match(/(?:id=|listing[\/=]|property[\/=])([^&\/\?]+)/i);
      if (urlMatch) {
        extractedData.mlsId = urlMatch[1];
        console.log('📍 Found MLS ID in URL:', extractedData.mlsId);
      }
      
      // Extract data using selectors
      for (var field in selectors) {
        var found = false;
        for (var i = 0; i < selectors[field].length && !found; i++) {
          var elements = document.querySelectorAll(selectors[field][i]);
          
          for (var j = 0; j < elements.length; j++) {
            var text = elements[j].textContent?.trim();
            if (!text || text.length < 1) continue;
            
            // Field-specific validation
            if (field === 'address' && text.length > 10 && !text.match(/^(welcome|hello|sign|login)/i)) {
              extractedData[field] = text;
              console.log(`✅ Found ${field}:`, text);
              found = true;
              break;
            }
            else if (field === 'price' && text.match(/\$[\d,]+/)) {
              extractedData[field] = text.replace(/[^\d]/g, '');
              console.log(`✅ Found ${field}:`, extractedData[field]);
              found = true;
              break;
            }
            else if (field === 'beds' && text.match(/\d+/)) {
              extractedData[field] = text.match(/\d+/)[0];
              console.log(`✅ Found ${field}:`, extractedData[field]);
              found = true;
              break;
            }
            else if (field === 'baths' && text.match(/\d+\.?\d*/)) {
              extractedData[field] = text.match(/\d+\.?\d*/)[0];
              console.log(`✅ Found ${field}:`, extractedData[field]);
              found = true;
              break;
            }
            else if (field === 'sqft' && text.match(/[\d,]+/)) {
              extractedData[field] = text.replace(/[^\d]/g, '');
              console.log(`✅ Found ${field}:`, extractedData[field]);
              found = true;
              break;
            }
            else if (field === 'mlsId' && text.match(/[\w\d_-]+/) && text.length > 3) {
              extractedData[field] = text;
              console.log(`✅ Found ${field}:`, extractedData[field]);
              found = true;
              break;
            }
          }
        }
      }
      
      // Try to get address from page title if not found
      if (!extractedData.address && document.title) {
        var title = document.title.trim();
        if (title.length > 10 && !title.match(/^(home|property|listing|search|welcome)/i)) {
          extractedData.address = title;
          console.log('📄 Using page title as address:', title);
        }
      }
      
      // Extract images
      var images = [];
      var imgElements = document.querySelectorAll('img');
      imgElements.forEach(function(img) {
        var src = img.src;
        if (src && 
            !src.includes('data:') && 
            !src.includes('logo') && 
            !src.includes('icon') &&
            (src.includes('listing') || src.includes('property') || 
             img.alt?.toLowerCase().includes('property') ||
             img.closest('.gallery, .slideshow, .photos, [class*="image"]'))) {
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      });
      extractedData.images = images.slice(0, 8);
      
      console.log('🏠 Complete extracted data:', extractedData);
      
      // Check if we have meaningful data
      var hasValidData = extractedData.address || extractedData.price || extractedData.mlsId || extractedData.beds;
      
      if (hasValidData) {
        // Store the data
        window.ihfPropertyData = extractedData;
        sessionStorage.setItem('ihfPropertyData', JSON.stringify(extractedData));
        
        // Dispatch events
        window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
          detail: extractedData
        }));
        
        // Send to parent frame if in iframe
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'ihfPropertyData',
            data: extractedData
          }, '*');
        }
        
        console.log('🎉 ✅ PROPERTY DATA EXTRACTION SUCCESSFUL!');
        hasExtracted = true;
        return true;
      } else {
        console.log('❌ No valid property data found, will retry...');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Extraction error:', error);
      return false;
    }
  };
  
  // Retry mechanism
  var attemptExtraction = function() {
    if (extractPropertyData()) {
      return; // Success
    }
    
    if (currentAttempt < maxAttempts) {
      setTimeout(attemptExtraction, 2000); // Try every 2 seconds
    } else {
      console.log('⚠️ Extraction failed after', maxAttempts, 'attempts');
    }
  };
  
  // Start extraction
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(attemptExtraction, 1000);
    });
  } else {
    setTimeout(attemptExtraction, 1000);
  }
  
  // Watch for dynamic content changes
  var observer = new MutationObserver(function(mutations) {
    if (!hasExtracted && mutations.some(m => m.addedNodes.length > 0)) {
      setTimeout(extractPropertyData, 1000);
    }
  });
  
  setTimeout(function() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }, 2000);
  
  console.log('🔧 UPDATED iHomeFinder extractor initialized');
})();