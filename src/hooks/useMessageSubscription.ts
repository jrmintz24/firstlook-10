
import { useCallback } from 'react';
import { useReliableSubscription } from './useReliableSubscription';

export const useMessageSubscription = (userId: string | null, fetchMessages: () => void) => {
  const handleDataChange = useCallback(() => {
    console.log('useMessageSubscription: Message change detected, fetching messages');
    fetchMessages();
  }, [fetchMessages]);

  const { cleanup, retry, isConnected } = useReliableSubscription({
    channelName: `messages_${userId}`,
    table: 'messages',
    filter: userId ? `sender_id=eq.${userId},receiver_id=eq.${userId}` : undefined,
    onDataChange: handleDataChange,
    enabled: !!userId
  });

  return {
    cleanup,
    retry,
    isConnected
  };
};
