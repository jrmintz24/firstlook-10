
// Global communication bridge between IDX widget and React app
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Custom events for IDX to React communication
export const IDX_SCHEDULE_TOUR_EVENT = 'idx-schedule-tour';
export const IDX_MAKE_OFFER_EVENT = 'idx-make-offer';
export const IDX_FAVORITE_EVENT = 'idx-favorite';

// Functions for IDX widget to trigger actions
export const triggerTourScheduling = (propertyData: PropertyData) => {
  const event = new CustomEvent(IDX_SCHEDULE_TOUR_EVENT, {
    detail: propertyData
  });
  window.dispatchEvent(event);
};

export const triggerMakeOffer = (propertyData: PropertyData) => {
  const event = new CustomEvent(IDX_MAKE_OFFER_EVENT, {
    detail: propertyData
  });
  window.dispatchEvent(event);
};

export const triggerFavorite = (propertyData: PropertyData) => {
  const event = new CustomEvent(IDX_FAVORITE_EVENT, {
    detail: propertyData
  });
  window.dispatchEvent(event);
};

// Make functions available globally for IDX widget
declare global {
  interface Window {
    triggerTourScheduling: typeof triggerTourScheduling;
    triggerMakeOffer: typeof triggerMakeOffer;
    triggerFavorite: typeof triggerFavorite;
  }
}

// Expose functions globally
if (typeof window !== 'undefined') {
  window.triggerTourScheduling = triggerTourScheduling;
  window.triggerMakeOffer = triggerMakeOffer;
  window.triggerFavorite = triggerFavorite;
}

// Enhanced CSS to hide original IDX buttons and style custom ones
export const IDX_CUSTOM_CSS = `
/* Hide original IDX tour/contact buttons */
button[title*="tour" i],
button[title*="schedule" i],
button[title*="contact" i],
a[title*="tour" i],
a[title*="schedule" i],
a[title*="contact" i],
.schedule-tour,
.contact-agent,
.tour-button,
button:contains("Schedule"),
button:contains("Tour"),
button:contains("Contact"),
a:contains("Schedule"),
a:contains("Tour"),
a:contains("Contact") {
  display: none !important;
}

/* Custom action buttons container */
.custom-idx-actions {
  display: flex;
  gap: 8px;
  margin: 8px 0;
  flex-wrap: wrap;
}

/* Custom tour button styling */
.custom-idx-tour-button {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex: 1;
  min-width: 120px;
}

.custom-idx-tour-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

/* Custom offer button styling */
.custom-idx-offer-button {
  background-color: white;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex: 1;
  min-width: 120px;
}

.custom-idx-offer-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

/* Custom favorite button styling */
.custom-idx-favorite-button {
  background-color: white;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex: 1;
  min-width: 120px;
}

.custom-idx-favorite-button:hover {
  background-color: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
  transform: translateY(-1px);
}

.custom-idx-favorite-button.favorited {
  background-color: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

/* Ensure buttons are positioned properly */
.ihf-results-container .custom-idx-actions,
.ihf-detail-container .custom-idx-actions {
  z-index: 1000;
  position: relative;
}

/* Icon styling */
.button-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
`;

// Enhanced JavaScript to be added to IDX content with all three buttons
export const IDX_CUSTOM_JS = `
(function() {
  console.log('IDX Custom integration loaded with all actions');
  
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
  
  // Function to create custom action buttons
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
      if (container && !container.querySelector('.custom-idx-actions')) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'custom-idx-actions';
        
        // Schedule Tour Button
        const tourButton = document.createElement('button');
        tourButton.className = 'custom-idx-tour-button';
        tourButton.innerHTML = '<span class="button-icon">📅</span>Schedule Tour';
        tourButton.onclick = function() {
          const propertyData = extractPropertyData();
          if (window.triggerTourScheduling) {
            window.triggerTourScheduling(propertyData);
          } else {
            console.error('Tour scheduling function not available');
          }
        };
        
        // Make Offer Button
        const offerButton = document.createElement('button');
        offerButton.className = 'custom-idx-offer-button';
        offerButton.innerHTML = '<span class="button-icon">💰</span>Make Offer';
        offerButton.onclick = function() {
          const propertyData = extractPropertyData();
          if (window.triggerMakeOffer) {
            window.triggerMakeOffer(propertyData);
          } else {
            console.error('Make offer function not available');
          }
        };
        
        // Favorite Button
        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'custom-idx-favorite-button';
        favoriteButton.innerHTML = '<span class="button-icon">❤️</span>Favorite';
        favoriteButton.onclick = function() {
          const propertyData = extractPropertyData();
          if (window.triggerFavorite) {
            window.triggerFavorite(propertyData);
          } else {
            console.error('Favorite function not available');
          }
        };
        
        actionsDiv.appendChild(tourButton);
        actionsDiv.appendChild(offerButton);
        actionsDiv.appendChild(favoriteButton);
        container.appendChild(actionsDiv);
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
