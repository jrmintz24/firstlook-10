// Simplified IDX communication - just the essentials
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Simplified CSS - only styling, no navigation interference
export const IDX_STYLING_CSS = `
/* IDX Styling - No Navigation Interference */
.ihf-results-container,
.ihf-listing-container,
.ihf-search-results {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* Property cards styling */
.ihf-grid-result,
.ihf-listing-item {
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  transition: all 0.2s ease !important;
  background: white !important;
}

.ihf-grid-result:hover,
.ihf-listing-item:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
  transform: translateY(-2px) !important;
}

/* Typography improvements */
.ihf-grid-result-price,
.ihf-listing-price {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

.ihf-grid-result-address,
.ihf-listing-address {
  color: #6b7280 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

/* Property details styling */
.ihf-grid-result-details,
.ihf-listing-details {
  display: flex !important;
  gap: 1rem !important;
  margin-top: 0.5rem !important;
  font-size: 0.875rem !important;
  color: #6b7280 !important;
}

/* Form and search styling */
.ihf-search-form input,
.ihf-quick-search input {
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
}

.ihf-search-form select,
.ihf-quick-search select {
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  padding: 0.75rem 1rem !important;
}

/* Button styling */
.ihf-search-form button,
.ihf-quick-search button,
.ihf-btn {
  background: #111827 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.ihf-search-form button:hover,
.ihf-quick-search button:hover,
.ihf-btn:hover {
  background: #000000 !important;
  transform: scale(1.02) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .ihf-grid-result,
  .ihf-listing-item {
    margin-bottom: 1rem !important;
  }
  
  .ihf-search-form,
  .ihf-quick-search {
    flex-direction: column !important;
    gap: 0.75rem !important;
  }
  
  .ihf-search-form input,
  .ihf-search-form select,
  .ihf-search-form button {
    width: 100% !important;
  }
}
`;

// Detect what type of IDX page we're currently on
export const detectIdxPageContext = (): 'search' | 'property-detail' | 'unknown' => {
  console.log('Detecting IDX page context...');
  
  // Check URL patterns first
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  // Check for common property detail URL patterns
  if (url.includes('/property/') || url.includes('/listing/') || url.includes('/detail/')) {
    console.log('URL indicates property detail page');
    return 'property-detail';
  }
  
  // Check page title patterns
  const title = document.title.toLowerCase();
  if (title.includes('property search') || title.includes('search results') || title.includes('listings')) {
    console.log('Title indicates search results page');
    return 'search';
  }
  
  // Check for IDX-specific elements that indicate page type
  const hasSearchResults = document.querySelector('.ihf-results-container, .ihf-search-results, .ihf-grid-results, .ihf-list-results');
  const hasPropertyDetail = document.querySelector('.ihf-property-details, .ihf-detail-container, .ihf-listing-detail');
  
  if (hasPropertyDetail) {
    console.log('DOM indicates property detail page');
    return 'property-detail';
  }
  
  if (hasSearchResults) {
    console.log('DOM indicates search results page');
    return 'search';
  }
  
  // Check for specific property detail indicators
  const hasDetailSelectors = document.querySelector('.ihf-detail-address, .ihf-detail-price, .ihf-detail-beds, .ihf-detail-baths');
  if (hasDetailSelectors) {
    console.log('Property detail selectors found');
    return 'property-detail';
  }
  
  // Default based on pathname
  if (pathname === '/listings' || pathname === '/idx') {
    console.log('Default to search based on pathname');
    return 'search';
  }
  
  console.log('Unable to determine page context');
  return 'unknown';
};

// Extract property data from IDX DOM - only on property detail pages
export const extractPropertyData = (): PropertyData => {
  console.log('Starting property data extraction...');
  
  // First check if we should even attempt extraction
  const pageContext = detectIdxPageContext();
  if (pageContext === 'search') {
    console.log('On search results page - skipping property data extraction');
    return {
      address: '',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
  }
  
  if (pageContext === 'unknown') {
    console.log('Unknown page context - skipping property data extraction');
    return {
      address: '',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
  }
  
  console.log('On property detail page - proceeding with extraction');
  
  const data: PropertyData = {
    address: '',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  // Address extraction - try multiple approaches
  const addressSelectors = [
    '.ihf-listing-address',
    '.ihf-detail-address',
    '.ihf-grid-result-address',
    '.property-address',
    '.listing-address',
    '[data-address]',
    '.address',
    'h1', // Sometimes address is in main heading
    'h2',
    '[class*="address"]'
  ];
  
  console.log('Trying to extract address...');
  for (const selector of addressSelectors) {
    const elements = document.querySelectorAll(selector);
    console.log(`Address selector "${selector}": found ${elements.length} elements`);
    
    for (const element of elements) {
      const text = element.textContent?.trim() || element.getAttribute('data-address') || '';
      console.log(`  - Text: "${text}"`);
      
      // Look for patterns that suggest this is an address
      if (text && (
        text.length > 10 && 
        (text.includes(',') || /\d+/.test(text)) && 
        !text.toLowerCase().includes('email') &&
        !text.toLowerCase().includes('phone')
      )) {
        data.address = text;
        console.log(`✅ Found address: "${text}"`);
        break;
      }
    }
    if (data.address) break;
  }

  // Price extraction
  const priceSelectors = [
    '.ihf-listing-price',
    '.ihf-detail-price',
    '.price',
    '.listing-price',
    '.property-price',
    '[data-price]',
    '[class*="price"]'
  ];
  
  console.log('Trying to extract price...');
  for (const selector of priceSelectors) {
    const elements = document.querySelectorAll(selector);
    console.log(`Price selector "${selector}": found ${elements.length} elements`);
    
    for (const element of elements) {
      const text = element.textContent?.trim() || element.getAttribute('data-price') || '';
      console.log(`  - Text: "${text}"`);
      
      if (text && (text.includes('$') || text.match(/[\d,]+/))) {
        data.price = text;
        console.log(`✅ Found price: "${text}"`);
        break;
      }
    }
    if (data.price) break;
  }

  // Beds extraction
  const bedsSelectors = [
    '.ihf-detail-beds', 
    '.beds', 
    '.bed',
    '.bedroom',
    '.bedrooms',
    '[class*="bed"]',
    '[data-beds]'
  ];
  
  console.log('Trying to extract beds...');
  for (const selector of bedsSelectors) {
    const elements = document.querySelectorAll(selector);
    console.log(`Beds selector "${selector}": found ${elements.length} elements`);
    
    for (const element of elements) {
      const text = element.textContent?.trim() || element.getAttribute('data-beds') || '';
      console.log(`  - Text: "${text}"`);
      
      const bedMatch = text.match(/(\d+)/);
      if (bedMatch) {
        data.beds = bedMatch[1];
        console.log(`✅ Found beds: "${bedMatch[1]}"`);
        break;
      }
    }
    if (data.beds) break;
  }

  // Baths extraction
  const bathsSelectors = [
    '.ihf-detail-baths', 
    '.baths', 
    '.bath',
    '.bathroom',
    '.bathrooms',
    '[class*="bath"]',
    '[data-baths]'
  ];
  
  console.log('Trying to extract baths...');
  for (const selector of bathsSelectors) {
    const elements = document.querySelectorAll(selector);
    console.log(`Baths selector "${selector}": found ${elements.length} elements`);
    
    for (const element of elements) {
      const text = element.textContent?.trim() || element.getAttribute('data-baths') || '';
      console.log(`  - Text: "${text}"`);
      
      const bathMatch = text.match(/(\d+(?:\.\d+)?)/);
      if (bathMatch) {
        data.baths = bathMatch[1];
        console.log(`✅ Found baths: "${bathMatch[1]}"`);
        break;
      }
    }
    if (data.baths) break;
  }

  // MLS ID extraction
  const mlsSelectors = [
    '.ihf-detail-mls-number', 
    '.mls-number', 
    '.mls-id',
    '.mls',
    '[class*="mls"]',
    '[data-mls]'
  ];
  
  console.log('Trying to extract MLS ID...');
  for (const selector of mlsSelectors) {
    const elements = document.querySelectorAll(selector);
    console.log(`MLS selector "${selector}": found ${elements.length} elements`);
    
    for (const element of elements) {
      const text = element.textContent?.trim() || element.getAttribute('data-mls') || '';
      console.log(`  - Text: "${text}"`);
      
      const mlsMatch = text.match(/(\d{6,})/);
      if (mlsMatch) {
        data.mlsId = mlsMatch[1];
        console.log(`✅ Found MLS ID: "${mlsMatch[1]}"`);
        break;
      }
    }
    if (data.mlsId) break;
  }

  // Fallback: try to extract from page title or meta tags
  if (!data.address) {
    const title = document.title;
    console.log(`Trying to extract address from title: "${title}"`);
    if (title && title.length > 10 && title.includes(',')) {
      data.address = title.split('|')[0].trim(); // Common pattern: "Address | Site Name"
      console.log(`✅ Found address from title: "${data.address}"`);
    }
  }

  console.log('Final extracted data:', data);
  return data;
};
