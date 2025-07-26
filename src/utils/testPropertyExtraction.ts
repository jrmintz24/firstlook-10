// Property Extraction Test Utility
// Use this in browser console to debug extraction issues

export const testPropertyExtraction = () => {
  console.log('🧪 Testing Property Extraction...');
  console.log('📍 Current URL:', window.location.href);
  console.log('📄 Page Title:', document.title);
  
  // Test common selectors
  const selectors = {
    address: [
      '.ihf-detail-address', '.ihf-listing-address', '.ihf-address',
      '.listing-address', '.property-address', '.detail-address',
      'h1[class*="address"]', 'h2[class*="address"]'
    ],
    price: [
      '.ihf-detail-price', '.ihf-listing-price', '.ihf-price',
      '.listing-price', '.property-price', '.detail-price'
    ],
    beds: [
      '.ihf-detail-beds', '.ihf-beds', '.bedrooms', '.beds',
      '.bed-count', '.bedroom-count'
    ],
    baths: [
      '.ihf-detail-baths', '.ihf-baths', '.bathrooms', '.baths',
      '.bath-count', '.bathroom-count'
    ],
    sqft: [
      '.ihf-detail-sqft', '.ihf-sqft', '.square-feet', '.sqft',
      '.sq-ft', '.square-footage'
    ]
  };
  
  const results: any = {};
  
  // Test each field
  Object.keys(selectors).forEach(field => {
    console.log(`\n🔍 Testing ${field}:`);
    const fieldSelectors = selectors[field as keyof typeof selectors];
    
    fieldSelectors.forEach(selector => {
      try {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
          console.log(`  ✅ "${selector}": "${element.textContent.trim()}"`);
          if (!results[field]) {
            results[field] = element.textContent.trim();
          }
        } else {
          console.log(`  ❌ "${selector}": not found`);
        }
      } catch (e) {
        console.log(`  ⚠️ "${selector}": error -`, e.message);
      }
    });
  });
  
  // Test text-based extraction
  console.log('\n🔍 Testing text-based extraction:');
  const bodyText = document.body.innerText || '';
  
  const patterns = {
    price: /\$[\d,]+/g,
    beds: /(\d+)\s*bed/gi,
    baths: /(\d+\.?\d*)\s*bath/gi,
    sqft: /([\d,]+)\s*(?:sq\s*ft|sqft|square\s*feet)/gi
  };
  
  Object.keys(patterns).forEach(field => {
    const pattern = patterns[field as keyof typeof patterns];
    const matches = bodyText.match(pattern);
    if (matches) {
      console.log(`  ✅ ${field} in text:`, matches.slice(0, 3));
      if (!results[field]) {
        results[field] = matches[0];
      }
    } else {
      console.log(`  ❌ ${field} not found in text`);
    }
  });
  
  // Check for iHomeFinder elements
  console.log('\n🔍 iHomeFinder elements found:');
  const ihfElements = document.querySelectorAll('[class*="ihf"], [id*="ihf"]');
  console.log(`  Found ${ihfElements.length} iHomeFinder elements`);
  
  if (ihfElements.length > 0) {
    console.log('  Sample elements:');
    Array.from(ihfElements).slice(0, 5).forEach((el, i) => {
      console.log(`    ${i + 1}. ${el.tagName}.${el.className} - "${el.textContent?.trim().substring(0, 50)}..."`);
    });
  }
  
  // Check URL parameters
  console.log('\n🔍 URL Parameters:');
  const params = new URLSearchParams(window.location.search);
  const mlsId = params.get('id') || params.get('mlsId') || params.get('listingId');
  console.log(`  MLS ID: ${mlsId || 'not found'}`);
  
  // Final results
  console.log('\n🎯 Final Extraction Results:');
  console.table(results);
  
  // Test backend connectivity
  console.log('\n📡 Testing backend connectivity...');
  if (Object.keys(results).length > 0) {
    const testData = {
      idxId: mlsId || 'test-' + Date.now(),
      mlsId: mlsId || 'test-' + Date.now(),
      address: results.address || 'Test Address',
      ...results,
      extractedAt: new Date().toISOString(),
      pageUrl: window.location.href
    };
    
    console.log('📤 Test data to send:', testData);
    
    // Note: Actual backend call would need proper API key
    console.log('ℹ️ To test backend, update API key in the improved extractor script');
  }
  
  return results;
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testPropertyExtraction = testPropertyExtraction;
}