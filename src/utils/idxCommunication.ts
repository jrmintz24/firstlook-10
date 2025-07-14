
// IDX communication utilities with URL normalization
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// URL normalization function to fix double slashes
export const normalizeUrl = (url: string): string => {
  if (!url) return url;
  // Remove double slashes except after protocol (http:// or https://)
  return url.replace(/([^:]\/)\/+/g, '$1');
};

// Monitor and fix IDX URLs if needed
export const monitorIDXUrls = (container: HTMLElement) => {
  if (!container) return;
  
  // Set up mutation observer to catch new links
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const links = element.querySelectorAll('a[href]');
            
            links.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.includes('//listing')) {
                const normalizedHref = normalizeUrl(href);
                if (href !== normalizedHref) {
                  console.log('Fixing double slash URL:', href, '->', normalizedHref);
                  link.setAttribute('href', normalizedHref);
                }
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(container, {
    childList: true,
    subtree: true
  });
  
  return observer;
};

// Helper to extract property data from current page
export const extractPropertyData = (): PropertyData => {
  const urlParams = new URLSearchParams(window.location.search);
  const mlsId = urlParams.get('id');
  
  return {
    address: document.title || 'Property Details',
    mlsId: mlsId || undefined
  };
};

// Check if current page is a property detail page
export const isPropertyDetailPage = (): boolean => {
  return window.location.pathname === '/listing' && window.location.search.includes('id=');
};
