
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
a[title*="contact" i] {
  display: none !important;
}
`;

// Extract property data from IDX DOM
export const extractPropertyData = (): PropertyData => {
  const data: PropertyData = {
    address: '',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  // Address extraction
  const addressSelectors = [
    '.ihf-listing-address',
    '.ihf-detail-address',
    '.ihf-grid-result-address',
    '.property-address',
    '[data-address]'
  ];
  
  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent?.trim() || element.getAttribute('data-address') || '';
      if (text && text.length > 10) {
        data.address = text;
        break;
      }
    }
  }

  // Price extraction
  const priceSelectors = [
    '.ihf-listing-price',
    '.ihf-detail-price',
    '.price',
    '[data-price]'
  ];
  
  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent?.trim() || element.getAttribute('data-price') || '';
      if (text && (text.includes('$') || text.match(/\d{4,}/))) {
        data.price = text;
        break;
      }
    }
  }

  // Beds/Baths extraction
  const bedsElement = document.querySelector('.ihf-detail-beds, .beds, [class*="bed"]');
  if (bedsElement) {
    const bedMatch = bedsElement.textContent?.match(/(\d+)/);
    if (bedMatch) data.beds = bedMatch[1];
  }

  const bathsElement = document.querySelector('.ihf-detail-baths, .baths, [class*="bath"]');
  if (bathsElement) {
    const bathMatch = bathsElement.textContent?.match(/(\d+(?:\.\d+)?)/);
    if (bathMatch) data.baths = bathMatch[1];
  }

  // MLS ID extraction
  const mlsElement = document.querySelector('.ihf-detail-mls-number, .mls-number, [class*="mls"]');
  if (mlsElement) {
    const mlsMatch = mlsElement.textContent?.match(/(\d{6,})/);
    if (mlsMatch) data.mlsId = mlsMatch[1];
  }

  return data;
};
