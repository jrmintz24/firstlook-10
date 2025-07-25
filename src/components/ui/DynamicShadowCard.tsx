import React, { useRef, useState, useEffect } from 'react';

interface DynamicShadowCardProps {
  children: React.ReactNode;
  className?: string;
  shadowIntensity?: number;
  shadowColor?: string;
}

const DynamicShadowCard = ({
  children,
  className = '',
  shadowIntensity = 0.15,
  shadowColor = 'rgba(0, 0, 0, 0.1)'
}: DynamicShadowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shadowStyle, setShadowStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Disable dynamic shadows on touch devices for better performance
    if ('ontouchstart' in window) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const deltaX = (e.clientX - centerX) * shadowIntensity;
    const deltaY = (e.clientY - centerY) * shadowIntensity;
    
    // Create dynamic shadow based on cursor position
    const shadowX = Math.max(-20, Math.min(20, deltaX));
    const shadowY = Math.max(-20, Math.min(20, deltaY));
    const blur = 15 + Math.abs(shadowX + shadowY) * 0.5;
    
    setShadowStyle({
      boxShadow: `${shadowX}px ${shadowY}px ${blur}px ${shadowColor}, 
                  0 4px 20px rgba(0, 0, 0, 0.1)`,
      transform: `translateZ(0)` // Force hardware acceleration
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShadowStyle({
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      transform: 'translateZ(0)'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`
        transition-all duration-300 ease-out
        transform-gpu
        ${className}
      `}
      style={{
        ...shadowStyle,
        transitionProperty: isHovered ? 'box-shadow' : 'box-shadow, transform'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default DynamicShadowCard;