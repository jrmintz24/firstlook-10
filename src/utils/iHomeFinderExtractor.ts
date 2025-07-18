// Enhanced iHomeFinder property extractor
export interface IHomeFinderPropertyData {
  mlsId: string;
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  images?: string[];
  propertyType?: string;
  description?: string;
}

export const extractIHomeFinderPropertyData = (): IHomeFinderPropertyData | null => {
  console.log('🏠 [iHomeFinder] Starting property data extraction...');
  console.log('🏠 [iHomeFinder] Current URL:', window.location.href);
  console.log('🏠 [iHomeFinder] Page title:', document.title);

  // Step 1: Extract MLS ID from URL
  const mlsId = extractMLSIdFromURL();
  if (!mlsId) {
    console.log('❌ [iHomeFinder] No MLS ID found in URL');
    return null;
  }

  console.log('✅ [iHomeFinder] Found MLS ID:', mlsId);

  // Step 2: Wait for page to load and extract property data
  const propertyData = extractPropertyFromPage(mlsId);
  
  if (!propertyData) {
    console.log('❌ [iHomeFinder] Could not extract property data');
    return null;
  }

  console.log('✅ [iHomeFinder] Successfully extracted property data:', propertyData);
  return propertyData;
};

const extractMLSIdFromURL = (): string | null => {
  // Extract from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || urlParams.get('mlsId') || urlParams.get('listingId');
};

const extractPropertyFromPage = (mlsId: string): IHomeFinderPropertyData | null => {
  try {
    console.log('🔍 [iHomeFinder] Analyzing page structure...');
    
    // Log page structure for debugging
    console.log('🔍 [iHomeFinder] Page HTML sample:', document.body.innerHTML.substring(0, 2000));
    
    // Check for iHomeFinder specific elements
    const ihfElements = document.querySelectorAll('[class*="ihf"], [id*="ihf"]');
    console.log('🔍 [iHomeFinder] Found iHomeFinder elements:', ihfElements.length);
    
    // Look for property data in various formats
    const propertyData = {
      mlsId,
      address: extractAddress(),
      price: extractPrice(),
      beds: extractBeds(),
      baths: extractBaths(),
      sqft: extractSqft(),
      images: extractImages(),
      propertyType: extractPropertyType(),
      description: extractDescription()
    };

    console.log('🔍 [iHomeFinder] Extracted property data:', propertyData);
    return propertyData;

  } catch (error) {
    console.error('❌ [iHomeFinder] Error extracting property data:', error);
    return null;
  }
};

const extractAddress = (): string => {
  console.log('🔍 [iHomeFinder] Extracting address...');
  
  // Try multiple selectors for address
  const addressSelectors = [
    'h1',
    '.property-address',
    '.listing-address',
    '.address',
    '[class*="address"]',
    '.ihf-address',
    '.property-title',
    '.listing-title'
  ];

  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      console.log(`✅ [iHomeFinder] Found address with selector "${selector}":`, text);
      
      // If it's just a city/state, skip it
      if (text.length > 20 && !text.toLowerCase().includes('search')) {
        return text;
      }
    }
  }

  // Fallback: try to extract from page title
  if (document.title && document.title !== 'Property Listing') {
    const title = document.title.trim();
    console.log('✅ [iHomeFinder] Using page title as address:', title);
    return title;
  }

  console.log('❌ [iHomeFinder] No address found');
  return 'Property Address Not Found';
};

const extractPrice = (): string => {
  console.log('🔍 [iHomeFinder] Extracting price...');
  
  const priceSelectors = [
    '.price',
    '.listing-price',
    '.property-price',
    '[class*="price"]',
    '.ihf-price'
  ];

  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      console.log(`✅ [iHomeFinder] Found price with selector "${selector}":`, text);
      
      // Look for dollar amounts
      if (text.includes('$') || /\d{3,}/.test(text)) {
        return text;
      }
    }
  }

  // Look for any text containing dollar signs
  const allText = document.body.innerText;
  const priceMatches = allText.match(/\$[\d,]+/g);
  if (priceMatches && priceMatches.length > 0) {
    console.log('✅ [iHomeFinder] Found price in body text:', priceMatches[0]);
    return priceMatches[0];
  }

  console.log('❌ [iHomeFinder] No price found');
  return '';
};

const extractBeds = (): string => {
  console.log('🔍 [iHomeFinder] Extracting beds...');
  
  const bedSelectors = [
    '.beds',
    '.bedrooms',
    '.bed-count',
    '[class*="bed"]',
    '.ihf-beds'
  ];

  for (const selector of bedSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      console.log(`✅ [iHomeFinder] Found beds with selector "${selector}":`, text);
      
      // Extract number from text
      const match = text.match(/\d+/);
      if (match) {
        return match[0];
      }
    }
  }

  // Look for patterns like "3 bed" or "3 bedroom" in body text
  const allText = document.body.innerText.toLowerCase();
  const bedMatches = allText.match(/(\d+)\s*(bed|bedroom)/);
  if (bedMatches) {
    console.log('✅ [iHomeFinder] Found beds in body text:', bedMatches[1]);
    return bedMatches[1];
  }

  console.log('❌ [iHomeFinder] No beds found');
  return '';
};

const extractBaths = (): string => {
  console.log('🔍 [iHomeFinder] Extracting baths...');
  
  const bathSelectors = [
    '.baths',
    '.bathrooms',
    '.bath-count',
    '[class*="bath"]',
    '.ihf-baths'
  ];

  for (const selector of bathSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      console.log(`✅ [iHomeFinder] Found baths with selector "${selector}":`, text);
      
      // Extract number (including decimals) from text
      const match = text.match(/\d+\.?\d*/);
      if (match) {
        return match[0];
      }
    }
  }

  // Look for patterns like "2.5 bath" or "3 bathroom" in body text
  const allText = document.body.innerText.toLowerCase();
  const bathMatches = allText.match(/(\d+\.?\d*)\s*(bath|bathroom)/);
  if (bathMatches) {
    console.log('✅ [iHomeFinder] Found baths in body text:', bathMatches[1]);
    return bathMatches[1];
  }

  console.log('❌ [iHomeFinder] No baths found');
  return '';
};

const extractSqft = (): string => {
  console.log('🔍 [iHomeFinder] Extracting sqft...');
  
  const sqftSelectors = [
    '.sqft',
    '.square-feet',
    '.sq-ft',
    '[class*="sqft"]',
    '[class*="square"]',
    '.ihf-sqft'
  ];

  for (const selector of sqftSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      console.log(`✅ [iHomeFinder] Found sqft with selector "${selector}":`, text);
      
      // Extract number from text
      const match = text.match(/[\d,]+/);
      if (match) {
        return match[0];
      }
    }
  }

  // Look for patterns like "2,400 sq ft" or "1800 sqft" in body text
  const allText = document.body.innerText.toLowerCase();
  const sqftMatches = allText.match(/([\d,]+)\s*(sq|square|sqft)/);
  if (sqftMatches) {
    console.log('✅ [iHomeFinder] Found sqft in body text:', sqftMatches[1]);
    return sqftMatches[1];
  }

  console.log('❌ [iHomeFinder] No sqft found');
  return '';
};

const extractImages = (): string[] => {
  console.log('🔍 [iHomeFinder] Extracting images...');
  
  const images: string[] = [];
  
  // Look for all images on the page
  const imgElements = document.querySelectorAll('img');
  
  imgElements.forEach(img => {
    const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    if (src && !src.includes('logo') && !src.includes('icon') && src.includes('http')) {
      // Filter out small images (likely icons/logos)
      if (img.naturalWidth > 200 || img.width > 200) {
        images.push(src);
      }
    }
  });

  console.log('✅ [iHomeFinder] Found images:', images.length);
  return images.slice(0, 5); // Limit to first 5 images
};

const extractPropertyType = (): string => {
  // Look for property type in body text
  const allText = document.body.innerText.toLowerCase();
  
  if (allText.includes('single family')) return 'Single Family Residential';
  if (allText.includes('condo')) return 'Condominium';
  if (allText.includes('townhouse')) return 'Townhouse';
  if (allText.includes('apartment')) return 'Apartment';
  
  return 'Single Family Residential'; // Default
};

const extractDescription = (): string => {
  // Look for description in common selectors
  const descSelectors = [
    '.description',
    '.property-description',
    '.listing-description',
    '.remarks',
    '.property-remarks'
  ];

  for (const selector of descSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      if (text.length > 50) {
        return text.substring(0, 500); // Limit length
      }
    }
  }

  return 'Beautiful property in desirable location';
};

// Auto-run extraction when this module loads
if (typeof window !== 'undefined') {
  // Only run on property pages
  if (window.location.search.includes('id=')) {
    console.log('🏠 [iHomeFinder] Auto-running extraction on property page');
    
    // Run extraction after a delay to ensure page is loaded
    setTimeout(() => {
      const propertyData = extractIHomeFinderPropertyData();
      if (propertyData) {
        // Store in window for other components to access
        (window as any).extractedPropertyData = propertyData;
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('ihfPropertyDataExtracted', {
          detail: propertyData
        }));
      }
    }, 2000);
  }
}