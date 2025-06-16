// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = 'G-0C8K5ZT5MJ'; // Your actual GA4 tracking ID

// Initialize Google Analytics
export const initGA = () => {
  // Create script elements
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(gtagScript);

  const configScript = document.createElement('script');
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;
  document.head.appendChild(configScript);
};

// Track page views
export const trackPageView = (page_path: string, page_title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path,
      page_title: page_title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user signup
export const trackSignup = (method: string, userType: string) => {
  trackEvent('sign_up', 'engagement', `${method}_${userType}`);
};

// Track property request
export const trackPropertyRequest = (address: string, userType: string) => {
  trackEvent('property_request', 'conversion', userType);
};

// Track showing booking
export const trackShowingBooking = (status: string) => {
  trackEvent('showing_booking', 'conversion', status);
};

// Track subscription events
export const trackSubscription = (action: 'start' | 'complete' | 'cancel', plan?: string) => {
  trackEvent(`subscription_${action}`, 'conversion', plan);
};

// Track guide interactions
export const trackGuideInteraction = (section: string, action: string) => {
  trackEvent(action, 'guide_engagement', section);
};

// Track navigation
export const trackNavigation = (destination: string, source: string) => {
  trackEvent('navigation', 'engagement', `${source}_to_${destination}`);
};
