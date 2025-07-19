// IMPROVED iHomeFinder Property Extractor - Advanced HTML Structure Detection
(function(){
  console.log('🚀 [iHomeFinder] Starting IMPROVED property extractor...');
  
  var hasExtracted = false;
  var maxAttempts = 30;
  var currentAttempt = 0;
  
  var extractPropertyData = function() {
    if (hasExtracted) return true;
    
    currentAttempt++;
    console.log(`🔍 [iHomeFinder] Extraction attempt ${currentAttempt}/${maxAttempts}`);
    
    try {
      var extractedData = {
        extractedAt: new Date().toISOString(),
        pageUrl: window.location.href
      };
      
      // Get IDX ID from URL first (more reliable than MLS ID)
      var urlPatterns = [
        /\/property\/([^\/\?]+)/i,
        /\/listing\/([^\/\?]+)/i,
        /[\?&]id=([^&]+)/i,
        /[\?&]listing_id=([^&]+)/i,
        /[\?&]property_id=([^&]+)/i,
        /[\?&]idx_id=([^&]+)/i
      ];
      
      for (var p = 0; p < urlPatterns.length; p++) {
        var match = window.location.href.match(urlPatterns[p]);
        if (match && match[1]) {
          extractedData.idxId = match[1];
          extractedData.mlsId = match[1]; // Keep for compatibility
          console.log('📍 [iHomeFinder] Found ID in URL:', extractedData.idxId);
          break;
        }
      }
      
      // Smart text extraction - look for patterns in all visible text
      var allTextElements = document.querySelectorAll('*');
      var textContent = [];
      
      for (var i = 0; i < allTextElements.length; i++) {
        var el = allTextElements[i];
        if (el.children.length === 0) { // Text nodes only
          var text = el.textContent?.trim();
          if (text && text.length > 0 && text.length < 200) {
            textContent.push({
              text: text,
              element: el,
              classes: el.className || '',
              tag: el.tagName?.toLowerCase() || ''
            });
          }
        }
      }
      
      console.log(`📝 [iHomeFinder] Found ${textContent.length} text elements to analyze`);
      
      // Extract price using pattern matching
      var pricePatterns = [
        /\$[\d,]+/g,
        /[\d,]+\s*dollars?/gi,
        /price[\s:]*\$?[\d,]+/gi
      ];
      
      for (var t = 0; t < textContent.length; t++) {
        var text = textContent[t].text;
        for (var pp = 0; pp < pricePatterns.length; pp++) {
          var priceMatch = text.match(pricePatterns[pp]);
          if (priceMatch && !extractedData.price) {
            var priceStr = priceMatch[0].replace(/[^\d]/g, '');
            var priceNum = parseInt(priceStr);
            if (priceNum > 50000 && priceNum < 10000000) { // Reasonable price range
              extractedData.price = priceStr;
              console.log('✅ [iHomeFinder] Found price:', extractedData.price, 'from text:', text);
              break;
            }
          }
        }
      }
      
      // Extract beds using pattern matching
      var bedPatterns = [
        /(\d+)\s*bed/gi,
        /bed[s]?[\s:]*(\d+)/gi,
        /(\d+)\s*br/gi,
        /(\d+)\s*bedroom/gi
      ];
      
      for (var t = 0; t < textContent.length; t++) {
        var text = textContent[t].text;
        for (var bp = 0; bp < bedPatterns.length; bp++) {
          var bedMatch = text.match(bedPatterns[bp]);
          if (bedMatch && !extractedData.beds) {
            var beds = bedMatch[1] || text.match(/\d+/)?.[0];
            if (beds && parseInt(beds) > 0 && parseInt(beds) < 20) {
              extractedData.beds = beds;
              console.log('✅ [iHomeFinder] Found beds:', extractedData.beds, 'from text:', text);
              break;
            }
          }
        }
      }
      
      // Extract baths using pattern matching
      var bathPatterns = [
        /(\d+\.?\d*)\s*bath/gi,
        /bath[s]?[\s:]*(\d+\.?\d*)/gi,
        /(\d+\.?\d*)\s*ba/gi,
        /(\d+\.?\d*)\s*bathroom/gi
      ];
      
      for (var t = 0; t < textContent.length; t++) {
        var text = textContent[t].text;
        for (var bap = 0; bap < bathPatterns.length; bap++) {
          var bathMatch = text.match(bathPatterns[bap]);
          if (bathMatch && !extractedData.baths) {
            var baths = bathMatch[1] || text.match(/\d+\.?\d*/)?.[0];
            if (baths && parseFloat(baths) > 0 && parseFloat(baths) < 20) {
              extractedData.baths = baths;
              console.log('✅ [iHomeFinder] Found baths:', extractedData.baths, 'from text:', text);
              break;
            }
          }
        }
      }
      
      // Extract square footage using pattern matching
      var sqftPatterns = [
        /([\d,]+)\s*sq\.?\s*ft/gi,
        /([\d,]+)\s*sqft/gi,
        /([\d,]+)\s*square\s*feet/gi,
        /sq\.?\s*ft[\s:]*[\d,]+/gi,
        /sqft[\s:]*[\d,]+/gi
      ];
      
      for (var t = 0; t < textContent.length; t++) {
        var text = textContent[t].text;
        for (var sp = 0; sp < sqftPatterns.length; sp++) {
          var sqftMatch = text.match(sqftPatterns[sp]);
          if (sqftMatch && !extractedData.sqft) {
            var sqft = text.match(/[\d,]+/)?.[0]?.replace(/,/g, '');
            if (sqft && parseInt(sqft) > 200 && parseInt(sqft) < 50000) {
              extractedData.sqft = sqft;
              console.log('✅ [iHomeFinder] Found sqft:', extractedData.sqft, 'from text:', text);
              break;
            }
          }
        }
      }
      
      // Extract address - look for address-like patterns
      var addressPatterns = [
        /\d+.*?(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|ct|court|pl|place|way|blvd|boulevard|cir|circle),?\s*[a-z\s]+,?\s*[a-z]{2}\s*\d{5}/gi,
        /\d+[^,]*,\s*[a-z\s]+,\s*[a-z]{2}\s*\d{5}/gi
      ];
      
      // First check page title
      if (document.title) {
        for (var ap = 0; ap < addressPatterns.length; ap++) {
          var titleMatch = document.title.match(addressPatterns[ap]);
          if (titleMatch && !extractedData.address) {
            extractedData.address = titleMatch[0].trim();
            console.log('✅ [iHomeFinder] Found address in title:', extractedData.address);
            break;
          }
        }
      }
      
      // Then check text content if not found in title
      if (!extractedData.address) {
        for (var t = 0; t < textContent.length && !extractedData.address; t++) {
          var text = textContent[t].text;
          for (var ap = 0; ap < addressPatterns.length; ap++) {
            var addrMatch = text.match(addressPatterns[ap]);
            if (addrMatch) {
              extractedData.address = addrMatch[0].trim();
              console.log('✅ [iHomeFinder] Found address:', extractedData.address, 'from text:', text);
              break;
            }
          }
        }
      }
      
      // Fallback: use page title if it looks like an address
      if (!extractedData.address && document.title) {
        var title = document.title.trim();
        if (title.length > 10 && /\d/.test(title) && !/^(home|property|listing|search|welcome)/i.test(title)) {
          extractedData.address = title;
          console.log('📄 [iHomeFinder] Using page title as address:', title);
        }
      }
      
      // Extract images - look for property photos
      var images = [];
      var imgElements = document.querySelectorAll('img');
      
      for (var img = 0; img < imgElements.length; img++) {
        var imgEl = imgElements[img];
        var src = imgEl.src;
        if (src && 
            !src.includes('data:') && 
            !src.includes('logo') && 
            !src.includes('icon') &&
            !src.includes('avatar') &&
            (src.includes('listing') || 
             src.includes('property') || 
             src.includes('photo') ||
             imgEl.alt?.toLowerCase().includes('property') ||
             imgEl.closest('.gallery, .slideshow, .photos, [class*="image"], [class*="photo"]') ||
             imgEl.width > 100 || imgEl.height > 100)) {
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      }
      extractedData.images = images.slice(0, 10);
      console.log('📸 [iHomeFinder] Found', extractedData.images.length, 'images');
      
      // Log complete extraction results
      console.log('🏠 [iHomeFinder] Complete extracted data:', extractedData);
      
      // Check if we have meaningful data
      var hasValidData = extractedData.address || 
                        extractedData.price || 
                        extractedData.idxId || 
                        extractedData.beds ||
                        (extractedData.images && extractedData.images.length > 0);
      
      if (hasValidData) {
        // Store the data globally
        window.ihfPropertyData = extractedData;
        sessionStorage.setItem('ihfPropertyData', JSON.stringify(extractedData));
        
        // Dispatch events for the application to consume
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
        
        console.log('🎉 [iHomeFinder] ✅ PROPERTY DATA EXTRACTION SUCCESSFUL!');
        console.log('📊 [iHomeFinder] Extracted fields:', Object.keys(extractedData).filter(k => extractedData[k]));
        hasExtracted = true;
        return true;
      } else {
        console.log('❌ [iHomeFinder] No valid property data found, will retry...');
        return false;
      }
      
    } catch (error) {
      console.error('❌ [iHomeFinder] Extraction error:', error);
      return false;
    }
  };
  
  // Enhanced retry mechanism with exponential backoff
  var attemptExtraction = function() {
    if (extractPropertyData()) {
      return; // Success!
    }
    
    if (currentAttempt < maxAttempts) {
      var delay = Math.min(1000 + (currentAttempt * 500), 5000); // 1s to 5s delay
      setTimeout(attemptExtraction, delay);
    } else {
      console.log('⚠️ [iHomeFinder] Extraction failed after', maxAttempts, 'attempts');
      
      // Final attempt with debug info
      console.log('🔍 [iHomeFinder] Page debug info:');
      console.log('- URL:', window.location.href);
      console.log('- Title:', document.title);
      console.log('- Body classes:', document.body?.className);
      console.log('- Total elements:', document.querySelectorAll('*').length);
      console.log('- Images:', document.querySelectorAll('img').length);
    }
  };
  
  // Initialize extraction
  var initExtraction = function() {
    setTimeout(attemptExtraction, 1000);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtraction);
  } else {
    initExtraction();
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
  
  console.log('🔧 [iHomeFinder] IMPROVED extractor initialized');
})();