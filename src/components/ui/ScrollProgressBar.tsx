import React, { useState, useEffect } from 'react';

interface ScrollProgressBarProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
}

const ScrollProgressBar = ({
  color = '#3b82f6',
  height = 3,
  position = 'top',
  showPercentage = false
}: ScrollProgressBarProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
      
      setScrollProgress(scrollPercent);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Initialize progress
    updateScrollProgress();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const progressBarStyle = {
    position: 'fixed' as const,
    [position]: 0,
    left: 0,
    width: `${scrollProgress}%`,
    height: `${height}px`,
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
    transition: 'width 0.1s ease-out',
    zIndex: 9999,
    borderRadius: position === 'bottom' ? '2px 2px 0 0' : '0 0 2px 2px',
    boxShadow: `0 0 10px ${color}33`
  };

  const containerStyle = {
    position: 'fixed' as const,
    [position]: 0,
    left: 0,
    width: '100%',
    height: `${height}px`,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 9998,
    backdropFilter: 'blur(10px)'
  };

  return (
    <>
      <div style={containerStyle} />
      <div style={progressBarStyle} />
      {showPercentage && (
        <div
          style={{
            position: 'fixed',
            [position]: height + 10,
            right: 20,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </>
  );
};

export default ScrollProgressBar;