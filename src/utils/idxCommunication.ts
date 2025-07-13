
// Simplified IDX communication - just the essentials
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Simple CSS to hide iHomeFinder's default buttons
export const IDX_BUTTON_HIDING_CSS = `
/* Hide iHomeFinder's default buttons */
.ihf-contact-buttons,
.ihf-schedule-button,
.ihf-request-info-button,
.ihf-make-offer-button,
.ihf-schedule-tour,
.ihf-contact-agent,
.ihf-request-info,
button[title*="tour" i],
button[title*="schedule" i],
button[title*="contact" i],
a[title*="tour" i],
a[title*="schedule" i],
a[title*="contact" i],
input[value*="tour" i],
input[value*="schedule" i],
input[value*="contact" i] {
  display: none !important;
}

/* Hide common form elements that might be contact forms */
.ihf-contact-form,
.contact-form,
[class*="contact-form"],
form[action*="contact"],
form[class*="contact"] {
  display: none !important;
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
