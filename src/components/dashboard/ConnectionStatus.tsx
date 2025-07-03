
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionStatusProps {
  userId: string | null;
}

const ConnectionStatus = ({ userId }: ConnectionStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

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

  useEffect(() => {
    if (!userId || !isOnline) {
      setRealtimeStatus('disconnected');
      return;
    }

    setRealtimeStatus('connecting');

    // Test realtime connection
    const testChannel = supabase
      .channel('connection_test')
      .subscribe((status) => {
        console.log('Connection test status:', status);
        
        switch (status) {
          case 'SUBSCRIBED':
            setRealtimeStatus('connected');
            break;
          case 'CHANNEL_ERROR':
            setRealtimeStatus('error');
            break;
          case 'CLOSED':
            setRealtimeStatus('disconnected');
            break;
          default:
            setRealtimeStatus('connecting');
        }
      });

    return () => {
      supabase.removeChannel(testChannel);
    };
  }, [userId, isOnline]);

  if (!userId) return null;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: "bg-red-100 text-red-800",
        text: "Offline"
      };
    }

    switch (realtimeStatus) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          text: "Connected"
        };
      case 'connecting':
        return {
          icon: Wifi,
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
          text: "Disconnected"
        };
    }
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
