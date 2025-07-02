
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface SimplifiedConnectionStatusProps {
  userId: string | null;
}

const SimplifiedConnectionStatus = ({ userId }: SimplifiedConnectionStatusProps) => {
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

  // Only show status if offline - no need to show connection issues for realtime
  if (!userId || isOnline) return null;

  return (
    <Badge className="bg-red-100 text-red-800 flex items-center gap-1 text-xs">
      <WifiOff className="w-3 h-3" />
      Offline
    </Badge>
  );
};

export default SimplifiedConnectionStatus;
