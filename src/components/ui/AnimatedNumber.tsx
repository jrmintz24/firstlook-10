import React from 'react';
import { useCountingAnimation } from '@/hooks/useCountingAnimation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  formatNumber?: boolean;
  glowColor?: string;
  enableGlow?: boolean;
}

const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1200,
  formatNumber = true,
  glowColor = 'rgba(34, 197, 94, 0.5)',
  enableGlow = false
}: AnimatedNumberProps) => {
  const { isVisible } = useScrollAnimation({ threshold: 0.3 });
  const { count } = useCountingAnimation(value, {
    duration,
    enableAnimation: isVisible
  });

  const formatValue = (num: number) => {
    return formatNumber ? num.toLocaleString() : num.toString();
  };

  const glowStyle = enableGlow && isVisible ? {
    textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
    animation: 'pulse 2s ease-in-out infinite'
  } : {};

  return (
    <>
      {enableGlow && (
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}</style>
      )}
      <span 
        className={`transition-all duration-500 ${className}`}
        style={glowStyle}
      >
        {prefix}{formatValue(count)}{suffix}
      </span>
    </>
  );
};

export default AnimatedNumber;