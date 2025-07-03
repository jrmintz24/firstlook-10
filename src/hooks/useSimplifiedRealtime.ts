
import { useEffect, useCallback } from 'react';
import { useShowingRequestsSubscription } from './useShowingRequestsSubscription';

interface UseSimplifiedRealtimeProps {
  userId: string | null;
  onShowingRequestsChange: () => void;
  enabled?: boolean;
}

export const useSimplifiedRealtime = ({
  userId,
  onShowingRequestsChange,
  enabled = true
}: UseSimplifiedRealtimeProps) => {
  
  // Set up showing requests subscription with improved reliability
  const { cleanup, retry, isConnected } = useShowingRequestsSubscription({
    userId,
    onDataChange: onShowingRequestsChange,
    enabled: enabled && !!userId
  });

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Log connection status for debugging
  useEffect(() => {
    if (userId && enabled) {
      console.log(`SimplifiedRealtime: Connection status for user ${userId}:`, isConnected);
    }
  }, [userId, enabled, isConnected]);

  return {
    cleanup,
    retry,
    isConnected
  };
};
