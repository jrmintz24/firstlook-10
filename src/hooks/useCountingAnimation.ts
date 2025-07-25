import { useEffect, useState, useRef } from 'react';

interface UseCountingAnimationOptions {
  start?: number;
  duration?: number;
  enableAnimation?: boolean;
}

export const useCountingAnimation = (
  end: number,
  options: UseCountingAnimationOptions = {}
) => {
  const {
    start = 0,
    duration = 1000,
    enableAnimation = true
  } = options;

  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!enableAnimation) {
      setCount(end);
      return;
    }

    if (end === count) return;

    setIsAnimating(true);
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = start + (end - start) * easeOut;
      setCount(Math.round(currentCount));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        startTimeRef.current = undefined;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = undefined;
      setIsAnimating(false);
    };
  }, [end, start, duration, enableAnimation]);

  return { count, isAnimating };
};