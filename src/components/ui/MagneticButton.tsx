import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magneticStrength?: number;
}

const MagneticButton = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'lg',
  magneticStrength = 0.3
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${isHovered ? 1.05 : 1})`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  const baseClasses = variant === 'default' 
    ? 'bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-2xl'
    : variant === 'outline'
    ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-lg'
    : '';

  const enhancedClassName = `
    ${baseClasses}
    px-10 py-5 text-base font-medium 
    transition-all duration-300 ease-out
    rounded-xl min-w-[280px] h-[56px]
    transform-gpu
    ${className}
  `.trim();

  return (
    <Button
      ref={buttonRef}
      size={size}
      variant={variant}
      className={enhancedClassName}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Button>
  );
};

export default MagneticButton;