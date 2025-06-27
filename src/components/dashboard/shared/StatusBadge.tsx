
import { Badge } from "@/components/ui/badge";
import { getStatusInfo } from "@/utils/showingStatus";
import type { ShowingStatus } from "@/utils/showingStatus";

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

const StatusBadge = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  animated = false 
}: StatusBadgeProps) => {
  const statusInfo = getStatusInfo(status as ShowingStatus);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={`
        ${statusInfo.bgColor} ${statusInfo.color} border-0 font-medium shadow-sm
        ${sizeClasses[size]}
        ${animated ? 'transition-all duration-200 hover:scale-105' : ''}
      `}
    >
      {showIcon && <span className="mr-2">{statusInfo.icon}</span>}
      {statusInfo.label}
    </Badge>
  );
};

export default StatusBadge;
