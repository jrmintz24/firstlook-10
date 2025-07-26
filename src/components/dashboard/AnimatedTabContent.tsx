import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTabContentProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

const AnimatedTabContent: React.FC<AnimatedTabContentProps> = ({ 
  children, 
  isActive,
  className 
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setMounted(true);
      // Small delay to ensure proper animation
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      // Keep mounted briefly for exit animation
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            visible && "animate-fade-in"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTabContent;