import React from 'react';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  delay?: number;
  duration?: number;
}

const FloatingCard = ({
  children,
  className = '',
  intensity = 'subtle',
  delay = 0,
  duration = 4000
}: FloatingCardProps) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'subtle':
        return 'hover:scale-[1.02]';
      case 'medium':
        return 'hover:scale-[1.03]';
      case 'strong':
        return 'hover:scale-[1.05]';
      default:
        return 'hover:scale-[1.02]';
    }
  };

  const breathingKeyframes = `
    @keyframes breathing-${intensity} {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(${intensity === 'subtle' ? '1.015' : intensity === 'medium' ? '1.025' : '1.035'}); }
    }
  `;

  return (
    <>
      <style>{breathingKeyframes}</style>
      <div
        className={`
          ${getIntensityClasses()}
          transition-all duration-500 ease-out
          transform-gpu
          ${className}
        `}
        style={{
          animation: `breathing-${intensity} ${duration}ms ease-in-out infinite`,
          animationDelay: `${delay}ms`
        }}
      >
        {children}
      </div>
    </>
  );
};

export default FloatingCard;