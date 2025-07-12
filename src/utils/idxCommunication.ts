// Global communication bridge between IDX widget and React app
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Custom event for IDX to React communication
export const IDX_SCHEDULE_TOUR_EVENT = 'idx-schedule-tour';

// Function for IDX widget to trigger tour scheduling
export const triggerTourScheduling = (propertyData: PropertyData) => {
  const event = new CustomEvent(IDX_SCHEDULE_TOUR_EVENT, {
    detail: propertyData
  });
  window.dispatchEvent(event);
};

// Make function available globally for IDX widget
declare global {
  interface Window {
    triggerTourScheduling: typeof triggerTourScheduling;
  }
}

// Expose function globally
if (typeof window !== 'undefined') {
  window.triggerTourScheduling = triggerTourScheduling;
}

// CSS to be added to IDX stylesheet
export const IDX_CUSTOM_CSS = `
/* Hide original IDX tour/contact buttons */
button[title*="tour" i],
button[title*="schedule" i],
a[title*="tour" i],
a[title*="schedule" i],
.schedule-tour,
.contact-agent,
.tour-button,
button:contains("Schedule"),
button:contains("Tour"),
a:contains("Schedule"),
a:contains("Tour") {
  display: none !important;
}

/* Custom tour button styling */
.custom-idx-tour-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-block;
  text-decoration: none;
}

.custom-idx-tour-button:hover {
  background-color: hsl(var(--primary) / 0.9);
  transform: translateY(-1px);
}

.custom-idx-tour-button:active {
  transform: translateY(0);
}

/* Ensure buttons are positioned properly */
.ihf-results-container .custom-idx-tour-button,
.ihf-detail-container .custom-idx-tour-button {
  margin: 8px 0;
  z-index: 1000;
  position: relative;
}
`;

// JavaScript to be added to IDX content
export const IDX_CUSTOM_JS = `
(function() {
  console.log('IDX Custom integration loaded');
  
  // Function to extract property data from current page/listing
  function extractPropertyData() {
    const data = {
      address: '',
      price: '',
      beds: '',
      baths: '',
      mlsId: ''
    };
    
    // Try to extract address
    const addressSelectors = [
      '.ihf-detail-address',
      '.ihf-listing-address',
      '.property-address',
      '[data-address]',
      '.address'
    ];
    
    for (const selector of addressSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.address = element.textContent?.trim() || element.getAttribute('data-address') || '';
        if (data.address) break;
      }
    }
    
    // Try to extract price
    const priceSelectors = [
      '.ihf-detail-price',
      '.ihf-listing-price',
      '.property-price',
      '[data-price]',
      '.price'
    ];
    
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.price = element.textContent?.trim() || element.getAttribute('data-price') || '';
        if (data.price) break;
      }
    }
    
    // Try to extract beds
    const bedsSelectors = [
      '.ihf-detail-beds',
      '.ihf-listing-beds',
      '[data-beds]',
      '.beds'
    ];
    
    for (const selector of bedsSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.beds = element.textContent?.trim() || element.getAttribute('data-beds') || '';
        if (data.beds) break;
      }
    }
    
    // Try to extract baths
    const bathsSelectors = [
      '.ihf-detail-baths',
      '.ihf-listing-baths',
      '[data-baths]',
      '.baths'
    ];
    
    for (const selector of bathsSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.baths = element.textContent?.trim() || element.getAttribute('data-baths') || '';
        if (data.baths) break;
      }
    }
    
    // Try to extract MLS ID
    const mlsSelectors = [
      '.ihf-detail-mls',
      '.ihf-listing-mls',
      '[data-mls]',
      '.mls-id'
    ];
    
    for (const selector of mlsSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        data.mlsId = element.textContent?.trim() || element.getAttribute('data-mls') || '';
        if (data.mlsId) break;
      }
    }
    
    console.log('Extracted property data:', data);
    return data;
  }
  
  // Function to create custom tour buttons
  function createCustomButtons() {
    // Find containers where we want to add buttons
    const containers = [
      '.ihf-detail-actions',
      '.ihf-listing-actions', 
      '.ihf-results-item',
      '.property-actions',
      '.listing-actions'
    ];
    
    containers.forEach(containerSelector => {
      const container = document.querySelector(containerSelector);
      if (container && !container.querySelector('.custom-idx-tour-button')) {
        const button = document.createElement('button');
        button.className = 'custom-idx-tour-button';
        button.textContent = 'Schedule Tour';
        button.onclick = function() {
          const propertyData = extractPropertyData();
          if (window.triggerTourScheduling) {
            window.triggerTourScheduling(propertyData);
          } else {
            console.error('Tour scheduling function not available');
          }
        };
        container.appendChild(button);
      }
    });
  }
  
  // Initialize when DOM is ready
  function init() {
    createCustomButtons();
    
    // Also create buttons when content changes (for AJAX-loaded content)
    const observer = new MutationObserver(function(mutations) {
      let shouldUpdate = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        setTimeout(createCustomButtons, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;