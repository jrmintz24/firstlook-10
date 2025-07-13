
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

// Simple function to detect if we're on a property detail page vs search results
export const isPropertyDetailPage = (): boolean => {
  // Check for property-specific elements that only appear on detail pages
  const detailIndicators = [
    '.ihf-detail-address',
    '.ihf-listing-address', 
    '.ihf-detail-price',
    '.property-details',
    '[class*="detail"]'
  ];
  
  return detailIndicators.some(selector => document.querySelector(selector) !== null);
};

// Simplified property data extraction - only runs on detail pages
export const extractPropertyData = (): PropertyData => {
  const data: PropertyData = {
    address: '',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  // Only extract if we're on a detail page
  if (!isPropertyDetailPage()) {
    return data;
  }

  // Address extraction - try the most common selectors
  const addressSelectors = [
    '.ihf-listing-address',
    '.ihf-detail-address',
    '.property-address',
    'h1', 
    'h2'
  ];
  
  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent?.trim() || '';
      if (text && text.length > 10 && (text.includes(',') || /\d+/.test(text))) {
        data.address = text;
        break;
      }
    }
  }

  // Price extraction
  const priceSelectors = ['.ihf-listing-price', '.ihf-detail-price', '.price'];
  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent?.trim() || '';
      if (text && (text.includes('$') || text.match(/[\d,]+/))) {
        data.price = text;
        break;
      }
    }
  }

  // Beds extraction
  const bedsSelectors = ['.ihf-detail-beds', '.beds', '.bed'];
  for (const selector of bedsSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const bedMatch = element.textContent?.match(/(\d+)/);
      if (bedMatch) {
        data.beds = bedMatch[1];
        break;
      }
    }
  }

  // Baths extraction
  const bathsSelectors = ['.ihf-detail-baths', '.baths', '.bath'];
  for (const selector of bathsSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const bathMatch = element.textContent?.match(/(\d+(?:\.\d+)?)/);
      if (bathMatch) {
        data.baths = bathMatch[1];
        break;
      }
    }
  }

  // MLS ID extraction
  const mlsSelectors = ['.ihf-detail-mls-number', '.mls-number', '.mls-id'];
  for (const selector of mlsSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const mlsMatch = element.textContent?.match(/(\d{6,})/);
      if (mlsMatch) {
        data.mlsId = mlsMatch[1];
        break;
      }
    }
  }

  // Fallback: try to extract from page title
  if (!data.address) {
    const title = document.title;
    if (title && title.length > 10 && title.includes(',')) {
      data.address = title.split('|')[0].trim();
    }
  }

  return data;
};
