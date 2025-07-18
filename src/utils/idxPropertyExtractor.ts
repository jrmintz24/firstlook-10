// Enhanced IDX Property Extractor that prioritizes MLS IDs
export interface ExtractedPropertyData {
  mlsId: string;
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  images?: string[];
  description?: string;
  propertyType?: string;
  yearBuilt?: string;
}

export const extractIDXPropertyData = (): ExtractedPropertyData | null => {
  console.log('🔍 [IDX Extractor] Starting property data extraction...');
  console.log('🔍 [IDX Extractor] Current URL:', window.location.href);

  // Step 1: Extract MLS ID from URL (highest priority)
  const mlsId = extractMLSIdFromURL();
  if (!mlsId) {
    console.log('❌ [IDX Extractor] No MLS ID found in URL, skipping extraction');
    return null;
  }

  console.log('✅ [IDX Extractor] Found MLS ID:', mlsId);

  // Step 2: Extract property data from page
  const propertyData = extractPropertyDataFromDOM(mlsId);
  
  if (!propertyData) {
    console.log('❌ [IDX Extractor] Could not extract property data from DOM');
    return null;
  }

  console.log('✅ [IDX Extractor] Successfully extracted property data:', propertyData);
  return propertyData;
};

const extractMLSIdFromURL = (): string | null => {
  try {
    // Method 1: Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id') || urlParams.get('mlsId') || urlParams.get('listingId');
    
    if (idParam) {
      console.log('✅ [IDX Extractor] Found MLS ID in URL params:', idParam);
      return idParam;
    }

    // Method 2: Check URL path segments
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const listingIndex = pathSegments.findIndex(segment => 
      segment.toLowerCase().includes('listing') || 
      segment.toLowerCase().includes('property') ||
      segment.toLowerCase().includes('detail')
    );
    
    if (listingIndex !== -1 && pathSegments[listingIndex + 1]) {
      const pathId = pathSegments[listingIndex + 1];
      console.log('✅ [IDX Extractor] Found MLS ID in URL path:', pathId);
      return pathId;
    }

    // Method 3: Check hash fragments
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const hashId = hashParams.get('id') || hashParams.get('listing');
      if (hashId) {
        console.log('✅ [IDX Extractor] Found MLS ID in hash:', hashId);
        return hashId;
      }
    }

    // Method 4: Extract from page meta tags
    const metaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="listing"], meta[name^="property"]');
    for (const meta of metaTags) {
      const content = meta.getAttribute('content');
      if (content && /^[A-Z0-9\-]+$/i.test(content) && content.length > 4) {
        console.log('✅ [IDX Extractor] Found potential MLS ID in meta tag:', content);
        return content;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting MLS ID from URL:', error);
    return null;
  }
};

const extractPropertyDataFromDOM = (mlsId: string): ExtractedPropertyData | null => {
  try {
    console.log('🔍 [IDX Extractor] Extracting property data from DOM for MLS ID:', mlsId);

    // Enhanced selectors based on common IDX provider patterns
    const addressSelectors = [
      '.ihf-address', '.ihf-listing-address', '.ihf-property-address',
      '.property-address', '.listing-address', '.address', 
      '[data-testid="property-address"]', '.property-info .address',
      'h1[class*="address"]', '[class*="property"][class*="address"]',
      '.listing-details .address', '.property-title', '.listing-title',
      '.property-street-address', '.full-address',
      'h1', 'h2' // Fallback to headers
    ];
    
    const priceSelectors = [
      '.ihf-price', '.ihf-listing-price', '.ihf-property-price',
      '.property-price', '.listing-price', '.price', 
      '[data-testid="property-price"]', '.price-container .price',
      '[class*="price"]', '.listing-details .price',
      '.property-price-value', '.listing-price-value'
    ];
    
    const bedsSelectors = [
      '.ihf-beds', '.ihf-bedrooms', '.ihf-bed-count',
      '.property-beds', '.beds', '.bedrooms', '.bed-count',
      '[data-testid="beds"]', '[class*="bed"]', '.listing-details .beds',
      '.property-beds-value', '.bedroom-count'
    ];
    
    const bathsSelectors = [
      '.ihf-baths', '.ihf-bathrooms', '.ihf-bath-count',
      '.property-baths', '.baths', '.bathrooms', '.bath-count',
      '[data-testid="baths"]', '[class*="bath"]', '.listing-details .baths',
      '.property-baths-value', '.bathroom-count'
    ];
    
    const sqftSelectors = [
      '.ihf-sqft', '.ihf-square-feet', '.ihf-sq-ft',
      '.property-sqft', '.sqft', '.square-feet', '.sq-ft',
      '[data-testid="sqft"]', '[class*="sqft"]', '[class*="square"]',
      '.listing-details .sqft', '.property-sqft-value', '.square-footage'
    ];

    const imageSelectors = [
      '.ihf-gallery img', '.property-gallery img', '.listing-gallery img',
      '.property-photos img', '.listing-photos img', '.photo-gallery img',
      '.property-image img', '.listing-image img', '.main-photo img',
      '.hero-image img', '.featured-image img'
    ];

    const extractTextFromSelectors = (selectors: string[], fieldName: string): string => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) {
          const text = element.textContent.trim();
          console.log(`✅ [IDX Extractor] Found ${fieldName} using selector "${selector}":`, text);
          return text;
        }
      }
      console.log(`❌ [IDX Extractor] No ${fieldName} found with any selector`);
      return '';
    };

    const extractImagesFromSelectors = (selectors: string[]): string[] => {
      const images: string[] = [];
      for (const selector of selectors) {
        const imageElements = document.querySelectorAll(selector);
        imageElements.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && !images.includes(src)) {
            images.push(src);
          }
        });
        if (images.length > 0) {
          console.log(`✅ [IDX Extractor] Found ${images.length} images using selector "${selector}"`);
          break;
        }
      }
      return images.slice(0, 5); // Limit to first 5 images
    };

    let address = extractTextFromSelectors(addressSelectors, 'address');
    
    // Fallback: Extract address from page title
    if (!address && document.title) {
      const titleText = document.title.trim();
      if (titleText && titleText !== 'Property Listing' && titleText !== 'Home') {
        console.log('✅ [IDX Extractor] Using page title as address:', titleText);
        address = titleText;
      }
    }

    if (!address) {
      console.log('❌ [IDX Extractor] No address found');
      return null;
    }

    const price = extractTextFromSelectors(priceSelectors, 'price');
    const beds = extractTextFromSelectors(bedsSelectors, 'beds');
    const baths = extractTextFromSelectors(bathsSelectors, 'baths');
    const sqft = extractTextFromSelectors(sqftSelectors, 'sqft');
    const images = extractImagesFromSelectors(imageSelectors);

    // Clean up extracted data
    const cleanPrice = price ? price.replace(/[^\d,]/g, '') : '';
    const cleanBeds = beds ? beds.replace(/[^\d]/g, '') : '';
    const cleanBaths = baths ? baths.replace(/[^\d.]/g, '') : '';
    const cleanSqft = sqft ? sqft.replace(/[^\d,]/g, '') : '';

    const propertyData: ExtractedPropertyData = {
      mlsId,
      address,
      price: cleanPrice,
      beds: cleanBeds,
      baths: cleanBaths,
      sqft: cleanSqft,
      images,
      description: 'Property details extracted from IDX listing',
      propertyType: 'Single Family Residential'
    };

    console.log('✅ [IDX Extractor] Final extracted property data:', propertyData);
    return propertyData;

  } catch (error) {
    console.error('Error extracting property data from DOM:', error);
    return null;
  }
};

// Function to save extracted property data to database
export const saveExtractedPropertyData = async (propertyData: ExtractedPropertyData) => {
  try {
    console.log('💾 [IDX Extractor] Saving property data to database:', propertyData);
    
    // This would typically call your Supabase function
    // For now, we'll store it in window object for the tour scheduler to access
    (window as any).extractedPropertyData = propertyData;
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('idxPropertyExtracted', { 
      detail: propertyData 
    }));
    
    console.log('✅ [IDX Extractor] Property data saved and event dispatched');
    
  } catch (error) {
    console.error('Error saving property data:', error);
  }
};

// Auto-run extraction when on IDX property page
export const autoExtractOnPropertyPage = () => {
  // Check if we're on a property detail page
  const isPropertyPage = 
    window.location.search.includes('id=') ||
    window.location.pathname.includes('/listing/') ||
    window.location.pathname.includes('/property/') ||
    document.querySelector('.ihf-property-detail') ||
    document.querySelector('.property-detail');

  if (isPropertyPage) {
    console.log('🏠 [IDX Extractor] Detected property page, starting extraction...');
    
    // Wait for page to load completely
    setTimeout(() => {
      const propertyData = extractIDXPropertyData();
      if (propertyData) {
        saveExtractedPropertyData(propertyData);
      }
    }, 2000);
  }
};

// Initialize auto-extraction when this module loads
if (typeof window !== 'undefined') {
  // Run immediately
  autoExtractOnPropertyPage();
  
  // Also run after DOM changes (for SPA navigation)
  const observer = new MutationObserver(() => {
    autoExtractOnPropertyPage();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}