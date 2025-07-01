
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useMessageSubscriptionManager } from "@/hooks/useMessageSubscriptionManager";

interface ConnectionStatusProps {
  userId: string | null;
}

const ConnectionStatus = ({ userId }: ConnectionStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { getConnectionStatus } = useMessageSubscriptionManager();
  const connectionStatus = getConnectionStatus();

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

  if (!userId) return null;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: "bg-red-100 text-red-800",
        text: "Offline"
      };
    }

    if (connectionStatus.circuitBreakerOpen) {
      return {
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800",
        text: "Connection Issues"
      };
    }

    if (connectionStatus.isConnecting) {
      return {
        icon: Wifi,
        color: "bg-blue-100 text-blue-800",
        text: "Connecting..."
      };
    }

    return {
      icon: Wifi,
      color: "bg-green-100 text-green-800",
      text: "Connected"
    };
  };

  const { icon: Icon, color, text } = getStatusInfo();

  return (
    <Badge className={`${color} flex items-center gap-1 text-xs`}>
      <Icon className="w-3 h-3" />
      {text}
    </Badge>
  );
};

export default ConnectionStatus;
