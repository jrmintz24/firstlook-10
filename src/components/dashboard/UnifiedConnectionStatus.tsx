
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface UnifiedConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  onRetry?: () => void;
}

const UnifiedConnectionStatus = ({ status, onRetry }: UnifiedConnectionStatusProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          text: "Live Updates Active"
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          color: "bg-blue-100 text-blue-800", 
          text: "Connecting..."
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: "bg-yellow-100 text-yellow-800",
          text: "Connection Issues"
        };
      default:
        return {
          icon: WifiOff,
          color: "bg-gray-100 text-gray-800",
          text: "Manual Refresh Mode"
        };
    }
  };

  const { icon: Icon, color, text } = getStatusInfo();

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${color} flex items-center gap-1 text-xs`}>
        <Icon className={`w-3 h-3 ${status === 'connecting' ? 'animate-spin' : ''}`} />
        {text}
      </Badge>
      {(status === 'error' || status === 'disconnected') && onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default UnifiedConnectionStatus;
