
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  onRetry?: () => void;
  showDetails?: boolean;
}

const UnifiedConnectionStatus = ({ status, onRetry, showDetails = false }: ConnectionStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: "bg-red-100 text-red-800",
        text: "Offline",
        description: "No internet connection"
      };
    }

    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          text: "Connected",
          description: "Real-time updates active"
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          color: "bg-blue-100 text-blue-800",
          text: "Connecting...",
          description: "Establishing connection"
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: "bg-yellow-100 text-yellow-800",
          text: "Connection Issues",
          description: "Some features may be limited"
        };
      default:
        return {
          icon: WifiOff,
          color: "bg-gray-100 text-gray-800",
          text: "Disconnected",
          description: "Using cached data"
        };
    }
  };

  const { icon: Icon, color, text, description } = getStatusInfo();

  if (!showDetails) {
    return (
      <Badge className={`${color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${status === 'connecting' ? 'animate-spin' : ''}`} />
        <div>
          <div className="text-sm font-medium">{text}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      {(status === 'error' || status === 'disconnected') && onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default UnifiedConnectionStatus;
