
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, AlertCircle, XCircle, FileText, Zap } from "lucide-react";

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
          className: 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800 shadow-md',
          iconColor: 'text-blue-600'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          icon: Clock,
          className: 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200 text-yellow-800 shadow-md',
          iconColor: 'text-yellow-600'
        };
      case 'pending':
        return {
          label: 'Pending Assignment',
          icon: Clock,
          className: 'bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200 text-orange-800 shadow-md',
          iconColor: 'text-orange-600'
        };
      case 'agent_assigned':
        return {
          label: 'Agent Assigned',
          icon: Zap,
          className: 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-800 shadow-md',
          iconColor: 'text-purple-600'
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          icon: CheckCircle,
          className: 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800 shadow-md',
          iconColor: 'text-green-600'
        };
      case 'agent_confirmed':
        return {
          label: 'Agent Confirmed',
          icon: CheckCircle,
          className: 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800 shadow-md',
          iconColor: 'text-green-600'
        };
      case 'awaiting_agreement':
        return {
          label: 'Agreement Required',
          icon: FileText,
          className: 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-200 text-orange-800 shadow-md animate-pulse',
          iconColor: 'text-orange-600'
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          icon: Calendar,
          className: 'bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-200 text-teal-800 shadow-md',
          iconColor: 'text-teal-600'
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          className: 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-200 text-emerald-800 shadow-md',
          iconColor: 'text-emerald-600'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className: 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200 text-red-800 shadow-md',
          iconColor: 'text-red-600'
        };
      default:
        return {
          label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: Clock,
          className: 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-200 text-gray-800 shadow-md',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1 text-xs font-semibold";
      case "md":
        return "px-4 py-2 text-sm font-bold";
      case "lg":
        return "px-6 py-3 text-base font-bold";
      default:
        return "px-3 py-1 text-xs font-semibold";
    }
  };

  return (
    <Badge
      className={`
        ${config.className}
        ${getSizeClasses()}
        ${animated ? 'transition-all duration-300 hover:scale-105' : ''}
        ${className}
        border-2 rounded-xl flex items-center gap-2 font-bold tracking-wide
      `}
    >
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
