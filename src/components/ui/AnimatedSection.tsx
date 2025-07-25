import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-up' | 'scale-in';
  delay?: number;
  reducedMotion?: boolean;
}

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0,
  reducedMotion = false
}: AnimatedSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation();
  
  // Respect user's reduced motion preferences
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const shouldAnimate = !reducedMotion && !prefersReducedMotion;

  const getAnimationClasses = () => {
    if (!shouldAnimate) {
      return 'opacity-100'; // No animations if reduced motion is preferred
    }
    
    const baseClasses = 'transition-all duration-1000 ease-out';
    
    switch (animation) {
      case 'fade-up':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`;
      case 'fade-in':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`;
      case 'slide-up':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`;
      case 'scale-in':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`;
      default:
        return baseClasses;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: shouldAnimate ? `${delay}ms` : '0ms'
      }}
      aria-hidden={!shouldAnimate && !isVisible ? 'true' : 'false'}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;