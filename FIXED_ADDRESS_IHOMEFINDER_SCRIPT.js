// FIXED ADDRESS iHomeFinder Property Extractor - Full Address Extraction
(function(){
  console.log('🚀 [FIXED ADDRESS iHomeFinder] Starting comprehensive property extractor...');
  
  var hasExtracted = false;
  var maxAttempts = 50;
  var currentAttempt = 0;
  
  var extractPropertyData = function() {
    if (hasExtracted) return true;
    
    currentAttempt++;
    console.log(`🔍 [FIXED ADDRESS iHomeFinder] Extraction attempt ${currentAttempt}/${maxAttempts}`);
    
    try {
      var extractedData = {
        extractedAt: new Date().toISOString(),
        pageUrl: window.location.href
      };
      
      // 1. Extract IDX ID from URL with multiple patterns
      var urlPatterns = [
        /\/listing\?id=([^&]+)/i,
        /\/property\/([^\/\?]+)/i,
        /[\?&]id=([^&]+)/i,
        /[\?&]listing_id=([^&]+)/i,
        /[\?&]property_id=([^&]+)/i,
        /[\?&]idx_id=([^&]+)/i,
        /property[\/=]([^\/\?&]+)/i
      ];
      
      for (var p = 0; p < urlPatterns.length; p++) {
        var match = window.location.href.match(urlPatterns[p]);
        if (match && match[1]) {
          extractedData.idxId = match[1];
          extractedData.mlsId = match[1]; // Keep for compatibility
          console.log('📍 [FIXED ADDRESS iHomeFinder] Found ID in URL:', extractedData.idxId);
          break;
        }
      }
      
      // 2. Get all text content from the page for analysis
      var pageText = document.body.innerText || document.body.textContent || '';
      console.log('📄 [FIXED ADDRESS iHomeFinder] Page text length:', pageText.length);
      
      // 3. Extract price with comprehensive patterns
      var pricePatterns = [
        /\$[\d,]+(?:\.\d{2})?/g,
        /Price[:\s]*\$?[\d,]+/gi,
        /List[ing]*\s*Price[:\s]*\$?[\d,]+/gi,
        /[\d,]+\s*dollars?/gi
      ];
      
      var foundPrices = [];
      for (var pp = 0; pp < pricePatterns.length; pp++) {
        var matches = pageText.match(pricePatterns[pp]);
        if (matches) {
          for (var m = 0; m < matches.length; m++) {
            var priceStr = matches[m].replace(/[^\d]/g, '');
            var priceNum = parseInt(priceStr);
            if (priceNum >= 50000 && priceNum <= 50000000) { // Reasonable price range
              foundPrices.push({price: priceStr, original: matches[m]});
            }
          }
        }
      }
      
      if (foundPrices.length > 0) {
        // Take the highest price (usually the listing price)
        var maxPrice = foundPrices.reduce((max, curr) => 
          parseInt(curr.price) > parseInt(max.price) ? curr : max
        );
        extractedData.price = maxPrice.price;
        console.log('✅ [FIXED ADDRESS iHomeFinder] Found price:', extractedData.price, 'from:', maxPrice.original);
      }
      
      // 4. Extract bedrooms
      var bedPatterns = [
        /(\d+)\s*bed(?:room)?s?/gi,
        /bed(?:room)?s?[:\s]*(\d+)/gi,
        /(\d+)\s*br/gi,
        /(\d+)\s*bdr/gi
      ];
      
      for (var bp = 0; bp < bedPatterns.length; bp++) {
        var bedMatch = pageText.match(bedPatterns[bp]);
        if (bedMatch && !extractedData.beds) {
          for (var bm = 0; bm < bedMatch.length; bm++) {
            var bedNum = bedMatch[bm].match(/\d+/);
            if (bedNum && parseInt(bedNum[0]) > 0 && parseInt(bedNum[0]) <= 20) {
              extractedData.beds = bedNum[0];
              console.log('✅ [FIXED ADDRESS iHomeFinder] Found beds:', extractedData.beds, 'from:', bedMatch[bm]);
              break;
            }
          }
        }
      }
      
      // 5. Extract bathrooms
      var bathPatterns = [
        /(\d+(?:\.\d+)?)\s*bath(?:room)?s?/gi,
        /bath(?:room)?s?[:\s]*(\d+(?:\.\d+)?)/gi,
        /(\d+(?:\.\d+)?)\s*ba/gi,
        /(\d+(?:\.\d+)?)\s*full\s*bath/gi
      ];
      
      for (var bap = 0; bap < bathPatterns.length; bap++) {
        var bathMatch = pageText.match(bathPatterns[bap]);
        if (bathMatch && !extractedData.baths) {
          for (var bam = 0; bam < bathMatch.length; bam++) {
            var bathNum = bathMatch[bam].match(/\d+(?:\.\d+)?/);
            if (bathNum && parseFloat(bathNum[0]) > 0 && parseFloat(bathNum[0]) <= 20) {
              extractedData.baths = bathNum[0];
              console.log('✅ [FIXED ADDRESS iHomeFinder] Found baths:', extractedData.baths, 'from:', bathMatch[bam]);
              break;
            }
          }
        }
      }
      
      // 6. Extract square footage
      var sqftPatterns = [
        /([\d,]+)\s*sq\.?\s*ft/gi,
        /([\d,]+)\s*sqft/gi,
        /([\d,]+)\s*square\s*f(?:ee)?t/gi,
        /sq\.?\s*ft[:\s]*([\d,]+)/gi,
        /square\s*f(?:ee)?t[:\s]*([\d,]+)/gi
      ];
      
      for (var sp = 0; sp < sqftPatterns.length; sp++) {
        var sqftMatch = pageText.match(sqftPatterns[sp]);
        if (sqftMatch && !extractedData.sqft) {
          for (var sm = 0; sm < sqftMatch.length; sm++) {
            var sqftNum = sqftMatch[sm].match(/[\d,]+/);
            if (sqftNum) {
              var sqftClean = sqftNum[0].replace(/,/g, '');
              if (parseInt(sqftClean) >= 200 && parseInt(sqftClean) <= 50000) {
                extractedData.sqft = sqftClean;
                console.log('✅ [FIXED ADDRESS iHomeFinder] Found sqft:', extractedData.sqft, 'from:', sqftMatch[sm]);
                break;
              }
            }
          }
        }
      }
      
      // 7. IMPROVED ADDRESS EXTRACTION - Always use full address from title
      var addressFound = false;
      
      console.log('🔍 [FIXED ADDRESS iHomeFinder] Starting address extraction...');
      console.log('📄 [FIXED ADDRESS iHomeFinder] Page title:', document.title);
      
      // First: Check if title contains a full address (most reliable for property pages)
      if (document.title && !addressFound) {
        var title = document.title.trim();
        console.log('🔍 [FIXED ADDRESS iHomeFinder] Analyzing title:', title);
        
        // Check if title looks like a property address (has numbers and common address words)
        if (/\d+/.test(title) && 
            (title.toLowerCase().includes('way') || 
             title.toLowerCase().includes('street') ||
             title.toLowerCase().includes('ave') ||
             title.toLowerCase().includes('rd') ||
             title.toLowerCase().includes('dr') ||
             title.toLowerCase().includes('ln') ||
             title.toLowerCase().includes('ct') ||
             title.toLowerCase().includes('pl') ||
             title.toLowerCase().includes('blvd') ||
             /\b[A-Z]{2}\s*\d{5}/.test(title))) { // Has state and zip pattern
          
          // Use the entire title as the address since it's a property page
          extractedData.address = title;
          console.log('✅ [FIXED ADDRESS iHomeFinder] Using FULL page title as address:', extractedData.address);
          addressFound = true;
        }
      }
      
      // Fallback: Try to extract structured address patterns from title
      if (!addressFound && document.title) {
        var titleAddressPatterns = [
          // Full address with city, state, zip
          /\d+[^,]*,\s*[a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}/,
          // Address with city and state
          /\d+.*?[a-zA-Z\s]+,\s*[A-Z]{2}/,
          // Basic street address
          /\d+.*?(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|ct|court|pl|place|way|blvd|boulevard)/i
        ];
        
        for (var tap = 0; tap < titleAddressPatterns.length; tap++) {
          var titleMatch = document.title.match(titleAddressPatterns[tap]);
          if (titleMatch) {
            extractedData.address = titleMatch[0].trim();
            console.log('✅ [FIXED ADDRESS iHomeFinder] Found structured address in title:', extractedData.address);
            addressFound = true;
            break;
          }
        }
      }
      
      // Last resort: Try page text
      if (!addressFound) {
        var textAddressPatterns = [
          /\d+[^,]*,\s*[a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}/g,
          /Address[:\s]+(.+?)(?:\n|$)/gi
        ];
        
        for (var tap = 0; tap < textAddressPatterns.length; tap++) {
          var textMatches = pageText.match(textAddressPatterns[tap]);
          if (textMatches) {
            for (var tam = 0; tam < textMatches.length; tam++) {
              var addr = textMatches[tam].trim();
              if (addr.length > 10 && addr.length < 200) {
                extractedData.address = addr;
                console.log('✅ [FIXED ADDRESS iHomeFinder] Found address in text:', extractedData.address);
                addressFound = true;
                break;
              }
            }
          }
          if (addressFound) break;
        }
      }
      
      // Final fallback: Use page title even if it doesn't match patterns
      if (!addressFound && document.title) {
        var cleanTitle = document.title.trim();
        if (cleanTitle.length > 5 && !/^(home|property|listing|search|welcome|ihome)/i.test(cleanTitle)) {
          extractedData.address = cleanTitle;
          console.log('📄 [FIXED ADDRESS iHomeFinder] Using page title as fallback address:', extractedData.address);
        }
      }
      
      // 8. Extract images from page
      var images = [];
      var allImages = document.querySelectorAll('img');
      
      for (var i = 0; i < allImages.length; i++) {
        var img = allImages[i];
        var src = img.src;
        
        if (src && 
            !src.includes('data:') && 
            !src.includes('logo') && 
            !src.includes('icon') &&
            !src.includes('avatar') &&
            !src.includes('spacer') &&
            (src.includes('listing') || 
             src.includes('property') || 
             src.includes('photo') ||
             src.includes('image') ||
             img.alt?.toLowerCase().includes('property') ||
             img.width > 100 || 
             img.height > 100)) {
          
          if (images.indexOf(src) === -1) {
            images.push(src);
          }
        }
      }
      
      extractedData.images = images.slice(0, 15);
      console.log('📸 [FIXED ADDRESS iHomeFinder] Found', extractedData.images.length, 'images');
      
      // 9. Comprehensive debug logging
      console.log('🏠 [FIXED ADDRESS iHomeFinder] Extraction Summary:');
      console.log('- URL:', window.location.href);
      console.log('- IDX ID:', extractedData.idxId || 'NOT FOUND');
      console.log('- Address:', extractedData.address || 'NOT FOUND');
      console.log('- Price:', extractedData.price || 'NOT FOUND');
      console.log('- Beds:', extractedData.beds || 'NOT FOUND');
      console.log('- Baths:', extractedData.baths || 'NOT FOUND');
      console.log('- SqFt:', extractedData.sqft || 'NOT FOUND');
      console.log('- Images:', extractedData.images.length);
      console.log('- Complete Data:', extractedData);
      
      // 10. Check if we have meaningful data
      var hasValidData = extractedData.idxId || 
                        extractedData.address || 
                        extractedData.price || 
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
        
        console.log('🎉 [FIXED ADDRESS iHomeFinder] ✅ PROPERTY DATA EXTRACTION SUCCESSFUL!');
        console.log('📊 [FIXED ADDRESS iHomeFinder] Extracted fields:', Object.keys(extractedData).filter(function(k) { return extractedData[k]; }));
        hasExtracted = true;
        return true;
      } else {
        console.log('❌ [FIXED ADDRESS iHomeFinder] No valid property data found, will retry...');
        
        // Debug info on failure
        console.log('🔍 [FIXED ADDRESS iHomeFinder] Debug info:');
        console.log('- Page title:', document.title);
        console.log('- Body text length:', pageText.length);
        console.log('- Total elements:', document.querySelectorAll('*').length);
        console.log('- Total images:', document.querySelectorAll('img').length);
        console.log('- Found prices:', foundPrices);
        
        return false;
      }
      
    } catch (error) {
      console.error('❌ [FIXED ADDRESS iHomeFinder] Extraction error:', error);
      return false;
    }
  };
  
  // Enhanced retry mechanism
  var attemptExtraction = function() {
    if (extractPropertyData()) {
      return; // Success!
    }
    
    if (currentAttempt < maxAttempts) {
      var delay = Math.min(1000 + (currentAttempt * 300), 8000); // 1s to 8s delay
      setTimeout(attemptExtraction, delay);
    } else {
      console.log('⚠️ [FIXED ADDRESS iHomeFinder] Extraction failed after', maxAttempts, 'attempts');
      console.log('📋 [FIXED ADDRESS iHomeFinder] Final page analysis:');
      console.log('- URL:', window.location.href);
      console.log('- Title:', document.title);
      console.log('- Body text preview:', (document.body.innerText || '').substring(0, 500));
    }
  };
  
  // Initialize extraction with multiple triggers
  var initExtraction = function() {
    setTimeout(attemptExtraction, 500);   // Quick start
    setTimeout(attemptExtraction, 2000);  // After initial load
    setTimeout(attemptExtraction, 5000);  // After dynamic content
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtraction);
  } else {
    initExtraction();
  }
  
  // Watch for dynamic content changes
  var observer = new MutationObserver(function(mutations) {
    if (!hasExtracted && mutations.some(function(m) { return m.addedNodes.length > 0; })) {
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
  
  console.log('🔧 [FIXED ADDRESS iHomeFinder] Comprehensive extractor initialized');
})();