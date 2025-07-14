
// Simplified IDX communication - just the essentials
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Essential CSS to hide IDX's default buttons without interfering with navigation
export const IDX_BUTTON_HIDING_CSS = `
/* Hide iHomeFinder's default contact/tour buttons */
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

/* Hide contact forms */
.ihf-contact-form,
.contact-form,
[class*="contact-form"] {
  display: none !important;
}
`;

// Simple detection for property detail pages
export const isPropertyDetailPage = (): boolean => {
  // Check for specific property detail indicators
  const detailSelectors = [
    '.ihf-detail-address',
    '.ihf-listing-address',
    '.ihf-detail-price',
    '.ihf-property-details',
    '[class*="detail-"]'
  ];
  
  return detailSelectors.some(selector => document.querySelector(selector) !== null);
};

// Simple property data extraction
export const extractPropertyData = (): PropertyData => {
  const data: PropertyData = {
    address: '',
    price: '',
    beds: '',
    baths: '',
    mlsId: ''
  };

  // Only extract if on detail page
  if (!isPropertyDetailPage()) {
    return data;
  }

  // Extract address
  const addressSelectors = ['.ihf-listing-address', '.ihf-detail-address', 'h1', 'h2'];
  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      if (text.length > 10 && (text.includes(',') || /\d+/.test(text))) {
        data.address = text;
        break;
      }
    }
  }

  // Extract price
  const priceSelectors = ['.ihf-listing-price', '.ihf-detail-price', '.price'];
  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      const text = element.textContent.trim();
      if (text.includes('$')) {
        data.price = text;
        break;
      }
    }
  }

  // Extract beds and baths
  const bedsElement = document.querySelector('.ihf-detail-beds, .beds');
  if (bedsElement) {
    const bedMatch = bedsElement.textContent?.match(/(\d+)/);
    if (bedMatch) data.beds = bedMatch[1];
  }

  const bathsElement = document.querySelector('.ihf-detail-baths, .baths');
  if (bathsElement) {
    const bathMatch = bathsElement.textContent?.match(/(\d+(?:\.\d+)?)/);
    if (bathMatch) data.baths = bathMatch[1];
  }

  // Fallback to page title for address
  if (!data.address && document.title.includes(',')) {
    data.address = document.title.split('|')[0].trim();
  }

  return data;
};
