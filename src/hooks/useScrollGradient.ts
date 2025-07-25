import { useEffect, useState } from 'react';

interface ScrollGradientOptions {
  startHue?: number;
  endHue?: number;
  saturation?: number;
  lightness?: number;
  opacity?: number;
}

export const useScrollGradient = (options: ScrollGradientOptions = {}) => {
  const {
    startHue = 220, // Blue
    endHue = 280,   // Purple
    saturation = 20,
    lightness = 95,
    opacity = 0.8
  } = options;

  const [scrollGradient, setScrollGradient] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateGradient = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);
      
      // Interpolate hue based on scroll position
      const currentHue = startHue + (endHue - startHue) * scrollPercent;
      
      // Create gradient that shifts based on scroll
      const gradient = `linear-gradient(135deg, 
        hsla(${currentHue}, ${saturation}%, ${lightness}%, ${opacity}) 0%, 
        hsla(${currentHue + 20}, ${saturation - 5}%, ${lightness + 2}%, ${opacity - 0.1}) 100%)`;
      
      setScrollGradient(gradient);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateGradient);
        ticking = true;
      }
    };

    // Initialize gradient
    updateGradient();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [startHue, endHue, saturation, lightness, opacity]);

  return scrollGradient;
};