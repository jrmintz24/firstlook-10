
import { useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface ConnectionManager {
  retryCount: number;
  maxRetries: number;
  isConnecting: boolean;
  channel: any;
  backoffDelays: number[];
}

export const useMessageSubscriptionManager = () => {
  const connectionManager = useRef<ConnectionManager>({
    retryCount: 0,
    maxRetries: 5,
    isConnecting: false,
    channel: null,
    backoffDelays: [2000, 4000, 8000, 16000, 32000] // Exponential backoff
  });

  const cleanupConnection = useCallback(() => {
    const manager = connectionManager.current;
    if (manager.channel) {
      console.log('Cleaning up message subscription channel');
      supabase.removeChannel(manager.channel);
      manager.channel = null;
    }
    manager.isConnecting = false;
  }, []);

  const createSubscription = useCallback((userId: string, fetchMessages: () => void) => {
    const manager = connectionManager.current;
    
    // Prevent multiple simultaneous connections
    if (manager.isConnecting || manager.channel) {
      console.log('Subscription already exists or is connecting, skipping');
      return manager.channel;
    }

    // Check retry limit
    if (manager.retryCount >= manager.maxRetries) {
      console.error('Max retries reached for message subscription');
      return null;
    }

    manager.isConnecting = true;
    console.log(`Setting up message subscription for user: ${userId} (attempt ${manager.retryCount + 1})`);

    const channelName = `messages-user-${userId}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        (payload) => {
          console.log('Message subscription event:', payload);
          fetchMessages();
        }
      )
      .subscribe((status) => {
        console.log('Message subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to message updates');
          manager.isConnecting = false;
          manager.retryCount = 0; // Reset on successful connection
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Message subscription error');
          manager.isConnecting = false;
          
          // Cleanup failed connection
          if (manager.channel) {
            supabase.removeChannel(manager.channel);
            manager.channel = null;
          }
          
          // Retry with exponential backoff
          if (manager.retryCount < manager.maxRetries) {
            const delay = manager.backoffDelays[manager.retryCount] || 32000;
            console.log(`Retrying message subscription in ${delay}ms`);
            
            setTimeout(() => {
              manager.retryCount++;
              createSubscription(userId, fetchMessages);
            }, delay);
          } else {
            console.error('Max retries reached, giving up on message subscription');
          }
        } else if (status === 'CLOSED') {
          console.log('Message subscription closed');
          manager.isConnecting = false;
          manager.channel = null;
        }
      });

    manager.channel = channel;
    return channel;
  }, []);

  const resetConnection = useCallback(() => {
    connectionManager.current.retryCount = 0;
  }, []);

  return {
    createSubscription,
    cleanupConnection,
    resetConnection,
    getConnectionStatus: () => ({
      isConnecting: connectionManager.current.isConnecting,
      retryCount: connectionManager.current.retryCount,
      maxRetries: connectionManager.current.maxRetries
    })
  };
};
