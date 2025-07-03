
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
  onRefresh: () => void;
  showRefreshButton?: boolean;
}

export const ConnectionStatus = ({ 
  isConnected, 
  onRefresh, 
  showRefreshButton = true 
}: ConnectionStatusProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Wifi className="h-4 w-4" />
        <span>Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-amber-600 text-sm">
      <WifiOff className="h-4 w-4" />
      <span>Updates via polling</span>
      {showRefreshButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
    </div>
  );
};
