import { useEffect, useRef } from 'react';

interface AnalyticsEvent {
  event: string;
  section?: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

// Simple analytics interface - can be extended to work with GA4, Mixpanel, etc.
class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private scrollDepthReached: Set<number> = new Set();
  private sectionTimeTrackers: Map<string, number> = new Map();

  private constructor() {
    this.initScrollTracking();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: AnalyticsEvent) {
    this.events.push({
      ...event,
      timestamp: Date.now()
    });
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
    
    // Here you would send to your analytics service
    // Example for GA4:
    // gtag('event', event.event, {
    //   event_category: event.section,
    //   event_label: event.label,
    //   value: event.value,
    //   ...event.properties
    // });
  }

  trackButtonClick(buttonText: string, section: string = 'unknown') {
    this.track({
      event: 'button_click',
      section,
      action: 'click',
      label: buttonText
    });
  }

  trackSectionView(sectionName: string) {
    this.track({
      event: 'section_view',
      section: sectionName,
      action: 'view'
    });
    
    // Start time tracking for this section
    this.sectionTimeTrackers.set(sectionName, Date.now());
  }

  trackSectionExit(sectionName: string) {
    const startTime = this.sectionTimeTrackers.get(sectionName);
    if (startTime) {
      const timeSpent = Date.now() - startTime;
      this.track({
        event: 'section_time',
        section: sectionName,
        action: 'time_spent',
        value: Math.round(timeSpent / 1000) // seconds
      });
      this.sectionTimeTrackers.delete(sectionName);
    }
  }

  trackScrollDepth(percentage: number) {
    const roundedPercentage = Math.round(percentage / 25) * 25; // Track in 25% increments
    
    if (!this.scrollDepthReached.has(roundedPercentage) && roundedPercentage > 0) {
      this.scrollDepthReached.add(roundedPercentage);
      this.track({
        event: 'scroll_depth',
        action: 'scroll',
        label: `${roundedPercentage}%`,
        value: roundedPercentage
      });
    }
  }

  trackCalculatorInteraction(homePrice: number, savings: number) {
    this.track({
      event: 'calculator_interaction',
      section: 'savings_calculator',
      action: 'price_adjusted',
      properties: {
        home_price: homePrice,
        estimated_savings: savings
      }
    });
  }

  private initScrollTracking() {
    if (typeof window === 'undefined') return;

    let ticking = false;
    
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      this.trackScrollDepth(scrollPercent);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Track initial page load
    this.track({
      event: 'page_view',
      action: 'load',
      properties: {
        url: window.location.pathname,
        referrer: document.referrer
      }
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

export const useAnalytics = () => {
  const analytics = Analytics.getInstance();
  
  return {
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackSectionView: analytics.trackSectionView.bind(analytics),
    trackSectionExit: analytics.trackSectionExit.bind(analytics),
    trackCalculatorInteraction: analytics.trackCalculatorInteraction.bind(analytics),
    track: analytics.track.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics)
  };
};

// Hook for tracking section visibility
export const useSectionTracking = (sectionName: string) => {
  const { trackSectionView, trackSectionExit } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackSectionView(sectionName);
          hasTracked.current = true;
        } else if (!entry.isIntersecting && hasTracked.current) {
          trackSectionExit(sectionName);
        }
      },
      { threshold: 0.5 } // Track when 50% of section is visible
    );

    const element = document.getElementById(sectionName.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      // Track exit on unmount
      if (hasTracked.current) {
        trackSectionExit(sectionName);
      }
    };
  }, [sectionName, trackSectionView, trackSectionExit]);
};