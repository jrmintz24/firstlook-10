import { useState, useEffect } from 'react';

interface MobileOptimizationOptions {
  disableAnimationsOnLowEnd?: boolean;
  reducedMotionFallback?: boolean;
}

export const useMobileOptimization = (options: MobileOptimizationOptions = {}) => {
  const { disableAnimationsOnLowEnd = true, reducedMotionFallback = true } = options;
  
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };

    // Detect low-end devices based on hardware capabilities
    const detectLowEndDevice = () => {
      // Check available CPU cores (if supported)
      const cores = (navigator as any).hardwareConcurrency || 4;
      
      // Check available memory (if supported)
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check connection speed (if supported)
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.effectiveType === '3g');

      // Consider device low-end if:
      // - Less than 4 CPU cores AND less than 4GB RAM, OR
      // - On a slow connection, OR
      // - User agent suggests older device
      const isLowEnd = (cores < 4 && memory < 4) || 
                       isSlowConnection || 
                       /Android [1-4]/.test(navigator.userAgent);
      
      setIsLowEndDevice(isLowEnd);
    };

    // Initial checks
    checkMobile();
    checkReducedMotion();
    detectLowEndDevice();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkReducedMotion);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', checkReducedMotion);
      }
    };
  }, []);

  // Determine if animations should be enabled
  const shouldEnableAnimations = !prefersReducedMotion && 
    !(disableAnimationsOnLowEnd && isLowEndDevice);

  // Determine animation intensity
  const getAnimationIntensity = (defaultIntensity: 'subtle' | 'medium' | 'strong' = 'medium') => {
    if (!shouldEnableAnimations) return 'none';
    if (isMobile || isLowEndDevice) return 'subtle';
    return defaultIntensity;
  };

  // Get optimized duration (slower on mobile/low-end)
  const getOptimizedDuration = (baseDuration: number) => {
    if (!shouldEnableAnimations) return 0;
    if (isMobile || isLowEndDevice) return baseDuration * 1.5;
    return baseDuration;
  };

  return {
    isMobile,
    isLowEndDevice,
    prefersReducedMotion,
    shouldEnableAnimations,
    getAnimationIntensity,
    getOptimizedDuration
  };
};