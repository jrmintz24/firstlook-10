import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magneticStrength?: number;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MagneticButton = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'lg',
  magneticStrength = 0.3,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { trackButtonClick } = useAnalytics();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    
    // Disable magnetic effect on touch devices for better mobile performance
    if ('ontouchstart' in window) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${isHovered ? 1.05 : 1})`;
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  const handleFocus = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleBlur = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
  };

  const handleClick = () => {
    // Extract button text for analytics
    const buttonText = typeof children === 'string' ? children : 
      buttonRef.current?.textContent || 'Unknown Button';
    
    trackButtonClick(buttonText, 'hero');
    
    if (onClick) {
      onClick();
    }
  };

  const baseClasses = variant === 'default' 
    ? 'bg-gray-900 hover:bg-black text-white shadow-lg hover:shadow-2xl'
    : variant === 'outline'
    ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-lg'
    : '';

  const enhancedClassName = `
    ${baseClasses}
    px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-medium 
    transition-all duration-300 ease-out
    rounded-xl min-w-[240px] sm:min-w-[280px] h-[48px] sm:h-[56px]
    transform-gpu
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-manipulation
    ${className}
  `.trim();

  return (
    <Button
      ref={buttonRef}
      size={size}
      variant={variant}
      className={enhancedClassName}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </Button>
  );
};

export default MagneticButton;