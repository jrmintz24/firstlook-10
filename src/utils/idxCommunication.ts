
// Simplified IDX communication - just the essentials
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Safe CSS styling to enhance IDX appearance without hiding essential elements
export const IDX_STYLING_CSS = `
/* Enhanced IDX Widget Styling - Safe approach */
.ihf-container,
.ihf-widget,
.ihf-main-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
  line-height: 1.6 !important;
}

/* Improve typography */
.ihf-container h1,
.ihf-container h2,
.ihf-container h3 {
  font-weight: 600 !important;
  line-height: 1.2 !important;
  margin-bottom: 1rem !important;
}

/* Enhanced form styling */
.ihf-container input[type="text"],
.ihf-container input[type="email"],
.ihf-container input[type="tel"],
.ihf-container select,
.ihf-container textarea {
  border: 1px solid #e5e7eb !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
  background: white !important;
}

.ihf-container input:focus,
.ihf-container select:focus,
.ihf-container textarea:focus {
  outline: none !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

/* Improve button styling */
.ihf-container button,
.ihf-container input[type="submit"] {
  background: #1f2937 !important;
  color: white !important;
  border: none !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.ihf-container button:hover,
.ihf-container input[type="submit"]:hover {
  background: #111827 !important;
  transform: translateY(-1px) !important;
}

/* Card styling for property listings */
.ihf-container .ihf-grid-result,
.ihf-container .ihf-list-result {
  background: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  padding: 1.5rem !important;
  margin-bottom: 1.5rem !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
}

.ihf-container .ihf-grid-result:hover,
.ihf-container .ihf-list-result:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) !important;
}

/* Property images */
.ihf-container img {
  border-radius: 0.5rem !important;
  max-width: 100% !important;
  height: auto !important;
}

/* Price styling */
.ihf-container [class*="price"],
.ihf-container .ihf-listing-price,
.ihf-container .ihf-detail-price {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #1f2937 !important;
  margin-bottom: 0.5rem !important;
}

/* Address styling */
.ihf-container [class*="address"],
.ihf-container .ihf-listing-address,
.ihf-container .ihf-detail-address {
  font-size: 1.1rem !important;
  color: #6b7280 !important;
  margin-bottom: 1rem !important;
}

/* Property details (beds/baths) */
.ihf-container [class*="bed"],
.ihf-container [class*="bath"] {
  color: #4b5563 !important;
  font-weight: 500 !important;
}

/* Pagination styling */
.ihf-container .ihf-pagination {
  margin: 2rem 0 !important;
  text-align: center !important;
}

.ihf-container .ihf-pagination a,
.ihf-container .ihf-pagination span {
  display: inline-block !important;
  padding: 0.5rem 1rem !important;
  margin: 0 0.25rem !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.375rem !important;
  text-decoration: none !important;
  color: #374151 !important;
  transition: all 0.2s ease !important;
}

.ihf-container .ihf-pagination a:hover {
  background: #f3f4f6 !important;
  border-color: #d1d5db !important;
}

/* Search form enhancements */
.ihf-container .ihf-search-form {
  background: white !important;
  padding: 2rem !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 2rem !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .ihf-container .ihf-grid-result,
  .ihf-container .ihf-list-result {
    padding: 1rem !important;
    margin-bottom: 1rem !important;
  }
  
  .ihf-container [class*="price"] {
    font-size: 1.25rem !important;
  }
  
  .ihf-container input,
  .ihf-container select,
  .ihf-container button {
    width: 100% !important;
    margin-bottom: 0.75rem !important;
  }
}

/* Remove any excessive margins or padding */
.ihf-container * {
  box-sizing: border-box !important;
}

/* Ensure content is visible */
.ihf-container {
  min-height: 400px !important;
}
`;

// Extract property data from IDX DOM
export const extractPropertyData = (): PropertyData => {
  console.log('Starting property data extraction...');
  
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
