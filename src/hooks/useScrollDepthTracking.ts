
import { useEffect, useRef } from "react";
import { trackGuideInteraction } from "@/utils/analytics";

interface ScrollDepthEvent {
  section: string;
  depth: number;
  timeSpent: number;
}

export const useScrollDepthTracking = (sections: string[]) => {
  const startTimes = useRef<{ [key: string]: number }>({});
  const trackedSections = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Track overall page depth
      const scrollDepth = Math.round((scrollPosition / (documentHeight - windowHeight)) * 100);
      
      // Track section-specific engagement
      sections.forEach((sectionId) => {
        const element = document.querySelector(`[data-section="${sectionId}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < windowHeight && rect.bottom > 0;
          
          if (isVisible && !startTimes.current[sectionId]) {
            startTimes.current[sectionId] = Date.now();
          } else if (!isVisible && startTimes.current[sectionId] && !trackedSections.current.has(sectionId)) {
            const timeSpent = Date.now() - startTimes.current[sectionId];
            trackedSections.current.add(sectionId);
            
            // Track section engagement with Google Analytics
            trackGuideInteraction(sectionId, 'section_completed');
            
            // Log analytics event (in production, send to your analytics service)
            console.log('Section engagement:', {
              section: sectionId,
              timeSpent: Math.round(timeSpent / 1000), // seconds
              completed: true
            });
          }
        }
      });

      // Log scroll depth milestones with Google Analytics
      if (scrollDepth >= 25 && !trackedSections.current.has('25%')) {
        trackedSections.current.add('25%');
        trackGuideInteraction('guide', 'scroll_25_percent');
        console.log('Scroll depth: 25%');
      }
      if (scrollDepth >= 50 && !trackedSections.current.has('50%')) {
        trackedSections.current.add('50%');
        trackGuideInteraction('guide', 'scroll_50_percent');
        console.log('Scroll depth: 50%');
      }
      if (scrollDepth >= 75 && !trackedSections.current.has('75%')) {
        trackedSections.current.add('75%');
        trackGuideInteraction('guide', 'scroll_75_percent');
        console.log('Scroll depth: 75%');
      }
      if (scrollDepth >= 90 && !trackedSections.current.has('90%')) {
        trackedSections.current.add('90%');
        trackGuideInteraction('guide', 'scroll_90_percent');
        console.log('Scroll depth: 90%');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Track page entry
    trackGuideInteraction('guide', 'page_viewed');
    console.log('Guide page viewed');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Track exit engagement
      Object.entries(startTimes.current).forEach(([sectionId, startTime]) => {
        if (!trackedSections.current.has(sectionId)) {
          const timeSpent = Date.now() - startTime;
          trackGuideInteraction(sectionId, 'section_partial');
          console.log('Section partial engagement:', {
            section: sectionId,
            timeSpent: Math.round(timeSpent / 1000),
            completed: false
          });
        }
      });
    };
  }, [sections]);
};
