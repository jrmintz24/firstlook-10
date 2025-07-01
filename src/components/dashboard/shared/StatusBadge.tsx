
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge = ({ status, size = 'md', className }: StatusBadgeProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'agent_assigned':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'agent_confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'awaiting_agreement':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'scheduled':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'pending':
        return 'Pending';
      case 'agent_assigned':
        return 'Agent Assigned';
      case 'agent_confirmed':
        return 'Agent Confirmed';
      case 'awaiting_agreement':
        return 'Awaiting Agreement';
      case 'confirmed':
        return 'Confirmed';
      case 'scheduled':
        return 'Scheduled';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        getStatusStyle(status),
        sizeClasses[size],
        'font-medium border',
        className
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;
