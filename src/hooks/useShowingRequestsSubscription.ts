
import { useCallback } from 'react';
import { useReliableSubscription } from './useReliableSubscription';

interface UseShowingRequestsSubscriptionProps {
  userId: string | null;
  onDataChange: () => void;
  enabled?: boolean;
}

export const useShowingRequestsSubscription = ({
  userId,
  onDataChange,
  enabled = true
}: UseShowingRequestsSubscriptionProps) => {
  const handleDataChange = useCallback(() => {
    console.log('useShowingRequestsSubscription: Showing request change detected');
    onDataChange();
  }, [onDataChange]);

  const { cleanup, retry, isConnected } = useReliableSubscription({
    channelName: `showing_requests_${userId}`,
    table: 'showing_requests',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onDataChange: handleDataChange,
    enabled: enabled && !!userId
  });

  return {
    cleanup,
    retry,
    isConnected
  };
};
