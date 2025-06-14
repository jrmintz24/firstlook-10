
import { useEffect, useRef } from "react";

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
            
            // Log analytics event (in production, send to your analytics service)
            console.log('Section engagement:', {
              section: sectionId,
              timeSpent: Math.round(timeSpent / 1000), // seconds
              completed: true
            });
          }
        }
      });

      // Log scroll depth milestones
      if (scrollDepth >= 25 && !trackedSections.current.has('25%')) {
        trackedSections.current.add('25%');
        console.log('Scroll depth: 25%');
      }
      if (scrollDepth >= 50 && !trackedSections.current.has('50%')) {
        trackedSections.current.add('50%');
        console.log('Scroll depth: 50%');
      }
      if (scrollDepth >= 75 && !trackedSections.current.has('75%')) {
        trackedSections.current.add('75%');
        console.log('Scroll depth: 75%');
      }
      if (scrollDepth >= 90 && !trackedSections.current.has('90%')) {
        trackedSections.current.add('90%');
        console.log('Scroll depth: 90%');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Track page entry
    console.log('Guide page viewed');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // Track exit engagement
      Object.entries(startTimes.current).forEach(([sectionId, startTime]) => {
        if (!trackedSections.current.has(sectionId)) {
          const timeSpent = Date.now() - startTime;
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
