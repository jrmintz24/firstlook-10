
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, AlertCircle, XCircle, FileText, Zap, UserCheck } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const StatusBadge = ({ status, size = "sm", animated = false, className = "" }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          icon: Clock,
          className: 'bg-white border-gray-300 text-gray-800 shadow-sm',
          iconColor: 'text-gray-600'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          icon: Clock,
          className: 'bg-white border-gray-300 text-gray-800 shadow-sm',
          iconColor: 'text-gray-600'
        };
      case 'pending':
        return {
          label: 'Pending Assignment',
          icon: Clock,
          className: 'bg-white border-gray-300 text-gray-800 shadow-sm',
          iconColor: 'text-gray-600'
        };
      case 'agent_assigned':
        return {
          label: 'Agent Assigned',
          icon: Zap,
          className: 'bg-black text-white shadow-sm',
          iconColor: 'text-white'
        };
      case 'agent_requested':
        return {
          label: 'Requested by Agent',
          icon: UserCheck,
          className: 'bg-blue-600 text-white shadow-sm',
          iconColor: 'text-white'
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          icon: CheckCircle,
          className: 'bg-green-600 text-white shadow-sm',
          iconColor: 'text-white'
        };
      case 'agent_confirmed':
        return {
          label: 'Agent Confirmed',
          icon: CheckCircle,
          className: 'bg-green-600 text-white shadow-sm',
          iconColor: 'text-white'
        };
      case 'awaiting_agreement':
        return {
          label: 'Agreement Required',
          icon: FileText,
          className: 'bg-orange-500 text-white shadow-sm animate-pulse',
          iconColor: 'text-white'
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          icon: Calendar,
          className: 'bg-black text-white shadow-sm',
          iconColor: 'text-white'
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          className: 'bg-gray-100 border-gray-300 text-gray-600 shadow-sm',
          iconColor: 'text-gray-500'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className: 'bg-red-50 border-red-200 text-red-700 shadow-sm',
          iconColor: 'text-red-600'
        };
      default:
        return {
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: Clock,
          className: 'bg-white border-gray-300 text-gray-800 shadow-sm',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2.5 py-1 text-xs font-medium";
      case "md":
        return "px-3 py-1.5 text-sm font-semibold";
      case "lg":
        return "px-4 py-2 text-base font-semibold";
      default:
        return "px-2.5 py-1 text-xs font-medium";
    }
  };

  return (
    <Badge
      className={`
        ${config.className}
        ${getSizeClasses()}
        ${animated ? 'transition-all duration-300 hover:scale-105' : ''}
        ${className}
        border rounded-lg flex items-center gap-2 font-medium
      `}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
