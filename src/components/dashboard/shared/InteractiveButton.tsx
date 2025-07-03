
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: LucideIcon;
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  className?: string;
  hapticFeedback?: boolean;
}

const InteractiveButton = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  icon: Icon,
  loading = false,
  success = false,
  disabled = false,
  className = "",
  hapticFeedback = true,
  ...props
}: InteractiveButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    // Haptic feedback (if supported)
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(5);
    }

    onClick?.(e as any);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  // Refined styling with subtle interactions
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200";
      case "ghost":
        return "bg-transparent text-gray-700 hover:bg-gray-100 transition-all duration-200";
      case "secondary":
        return "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 transition-all duration-200";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700 transition-all duration-200";
      default:
        return "bg-black text-white hover:bg-gray-800 transition-all duration-200";
    }
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden transition-all duration-200 rounded-lg font-medium
        ${isPressed ? 'scale-98' : 'scale-100'}
        ${success ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${getVariantStyles()}
        ${className}
      `}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/15 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
            width: 16,
            height: 16,
          }}
        />
      ))}
      
      {/* Button content */}
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : Icon ? (
          <Icon className="w-4 h-4" />
        ) : null}
        {children}
      </div>
    </Button>
  );
};

export default InteractiveButton;
