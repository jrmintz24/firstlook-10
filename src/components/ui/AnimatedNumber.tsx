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
}

const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1200,
  formatNumber = true
}: AnimatedNumberProps) => {
  const { isVisible } = useScrollAnimation({ threshold: 0.3 });
  const { count } = useCountingAnimation(value, {
    duration,
    enableAnimation: isVisible
  });

  const formatValue = (num: number) => {
    return formatNumber ? num.toLocaleString() : num.toString();
  };

  return (
    <span className={className}>
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
};

export default AnimatedNumber;