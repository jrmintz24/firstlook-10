<!-- iHomeFinder Property Extractor - Copy and paste this entire block -->
<script type="text/javascript">
(function(){
  console.log('🏠 [IHF Extractor] Starting property extraction...');
  
  var extractData = function() {
    try {
      var data = {
        address: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        mlsId: ''
      };
      
      // Get MLS ID from URL
      var urlParams = new URLSearchParams(window.location.search);
      data.mlsId = urlParams.get('id') || urlParams.get('mlsId') || urlParams.get('listingId') || 'unknown';
      
      // Extract address
      var addressSelectors = ['.ihf-detail-address', '.ihf-listing-address', '.listing-address', '.property-address'];
      for (var i = 0; i < addressSelectors.length; i++) {
        var addressEl = document.querySelector(addressSelectors[i]);
        if (addressEl && addressEl.textContent) {
          data.address = addressEl.textContent.trim();
          break;
        }
      }
      
      // Extract price
      var priceSelectors = ['.ihf-detail-price', '.ihf-listing-price', '.listing-price', '.property-price'];
      for (var i = 0; i < priceSelectors.length; i++) {
        var priceEl = document.querySelector(priceSelectors[i]);
        if (priceEl && priceEl.textContent) {
          data.price = priceEl.textContent.trim();
          break;
        }
      }
      
      // Extract beds
      var bedSelectors = ['.ihf-detail-beds', '.ihf-beds', '.bedrooms', '.beds'];
      for (var i = 0; i < bedSelectors.length; i++) {
        var bedEl = document.querySelector(bedSelectors[i]);
        if (bedEl && bedEl.textContent) {
          data.beds = bedEl.textContent.trim();
          break;
        }
      }
      
      // Extract baths
      var bathSelectors = ['.ihf-detail-baths', '.ihf-baths', '.bathrooms', '.baths'];
      for (var i = 0; i < bathSelectors.length; i++) {
        var bathEl = document.querySelector(bathSelectors[i]);
        if (bathEl && bathEl.textContent) {
          data.baths = bathEl.textContent.trim();
          break;
        }
      }
      
      // Extract sqft
      var sqftSelectors = ['.ihf-detail-sqft', '.ihf-sqft', '.square-feet', '.sqft'];
      for (var i = 0; i < sqftSelectors.length; i++) {
        var sqftEl = document.querySelector(sqftSelectors[i]);
        if (sqftEl && sqftEl.textContent) {
          data.sqft = sqftEl.textContent.trim();
          break;
        }
      }
      
      // Fallback text extraction
      if (!data.price || !data.beds || !data.baths || !data.sqft) {
        var bodyText = document.body.innerText || document.body.textContent || '';
        
        if (!data.price) {
          var priceMatch = bodyText.match(/\$[\d,]+/);
          if (priceMatch) data.price = priceMatch[0];
        }
        
        if (!data.beds) {
          var bedMatch = bodyText.match(/(\d+)\s*bed/i);
          if (bedMatch) data.beds = bedMatch[1];
        }
        
        if (!data.baths) {
          var bathMatch = bodyText.match(/(\d+\.?\d*)\s*bath/i);
          if (bathMatch) data.baths = bathMatch[1];
        }
        
        if (!data.sqft) {
          var sqftMatch = bodyText.match(/([\d,]+)\s*(?:sq\s*ft|sqft|square\s*feet)/i);
          if (sqftMatch) data.sqft = sqftMatch[1];
        }
      }
      
      console.log('🎯 [IHF Extractor] Extracted data:', data);
      
      // Only proceed if we have meaningful data
      if (data.address || data.price || data.beds || data.baths || data.sqft) {
        sendToBackend(data);
      } else {
        console.log('❌ [IHF Extractor] No meaningful data found');
      }
      
    } catch(e) {
      console.error('❌ [IHF Extractor] Error:', e);
    }
  };
  
  var sendToBackend = function(data) {
    try {
      var propertyData = {
        idxId: data.mlsId,
        mlsId: data.mlsId,
        address: data.address,
        price: data.price,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft,
        property_type: 'Single Family',
        status: 'active',
        extractedAt: new Date().toISOString(),
        pageUrl: window.location.href,
        extractorVersion: '2.2-simple'
      };
      
      console.log('📤 [IHF Extractor] Sending to backend...');
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://uugchegukcccuqpcsqhl.supabase.co/functions/v1/upsert-idx-property');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Z2NoZWd1a2NjY3VxcGNzcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTU4NzQsImV4cCI6MjA2NDI5MTg3NH0.4r_GivJvzSZGgFizHGKoGdGnxa7hbZJr2FhgnAUeGdE');
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('✅ [IHF Extractor] Success!');
          } else {
            console.error('❌ [IHF Extractor] Backend error:', xhr.status);
          }
        }
      };
      
      xhr.send(JSON.stringify({ property: propertyData }));
      
    } catch(e) {
      console.error('❌ [IHF Extractor] Send error:', e);
    }
  };
  
  // Initialize extraction
  console.log('🚀 [IHF Extractor] Starting...');
  
  if (document.readyState === 'complete') {
    setTimeout(extractData, 500);
  } else {
    window.addEventListener ? 
      window.addEventListener('load', function() { setTimeout(extractData, 1000); }) :
      window.attachEvent('onload', function() { setTimeout(extractData, 1000); });
  }
  
  // Try again after 3 seconds for dynamic content
  setTimeout(extractData, 3000);
  
  console.log('✅ [IHF Extractor] Initialized');
})();
</script>