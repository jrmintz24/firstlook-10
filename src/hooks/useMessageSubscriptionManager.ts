
import { useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface ConnectionManager {
  retryCount: number;
  maxRetries: number;
  isConnecting: boolean;
  channel: any;
  backoffDelays: number[];
  circuitBreakerOpen: boolean;
  lastFailureTime: number;
  circuitBreakerTimeout: number;
}

export const useMessageSubscriptionManager = () => {
  const connectionManager = useRef<ConnectionManager>({
    retryCount: 0,
    maxRetries: 3, // Reduced from 5
    isConnecting: false,
    channel: null,
    backoffDelays: [1000, 2000, 4000], // Reduced delays
    circuitBreakerOpen: false,
    lastFailureTime: 0,
    circuitBreakerTimeout: 30000 // 30 seconds
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

  const isCircuitBreakerOpen = useCallback(() => {
    const manager = connectionManager.current;
    if (!manager.circuitBreakerOpen) return false;
    
    const now = Date.now();
    if (now - manager.lastFailureTime > manager.circuitBreakerTimeout) {
      manager.circuitBreakerOpen = false;
      manager.retryCount = 0;
      return false;
    }
    return true;
  }, []);

  const createSubscription = useCallback((userId: string, fetchMessages: () => void) => {
    const manager = connectionManager.current;
    
    // Circuit breaker check
    if (isCircuitBreakerOpen()) {
      console.log('Circuit breaker is open, skipping subscription');
      return null;
    }

    // Prevent multiple simultaneous connections
    if (manager.isConnecting || manager.channel) {
      console.log('Subscription already exists or is connecting, skipping');
      return manager.channel;
    }

    // Check retry limit
    if (manager.retryCount >= manager.maxRetries) {
      console.error('Max retries reached, opening circuit breaker');
      manager.circuitBreakerOpen = true;
      manager.lastFailureTime = Date.now();
      return null;
    }

    manager.isConnecting = true;
    console.log(`Setting up message subscription for user: ${userId} (attempt ${manager.retryCount + 1})`);

    const channelName = `messages-user-${userId}`;
    
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
          // Debounce the fetch to prevent excessive calls
          setTimeout(fetchMessages, 100);
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
            const delay = manager.backoffDelays[manager.retryCount] || 4000;
            console.log(`Retrying message subscription in ${delay}ms`);
            
            setTimeout(() => {
              manager.retryCount++;
              createSubscription(userId, fetchMessages);
            }, delay);
          } else {
            console.error('Max retries reached for message subscription');
            manager.circuitBreakerOpen = true;
            manager.lastFailureTime = Date.now();
          }
        } else if (status === 'CLOSED') {
          console.log('Message subscription closed');
          manager.isConnecting = false;
          manager.channel = null;
        }
      });

    manager.channel = channel;
    return channel;
  }, [isCircuitBreakerOpen]);

  const resetConnection = useCallback(() => {
    const manager = connectionManager.current;
    manager.retryCount = 0;
    manager.circuitBreakerOpen = false;
  }, []);

  return {
    createSubscription,
    cleanupConnection,
    resetConnection,
    getConnectionStatus: () => ({
      isConnecting: connectionManager.current.isConnecting,
      retryCount: connectionManager.current.retryCount,
      maxRetries: connectionManager.current.maxRetries,
      circuitBreakerOpen: connectionManager.current.circuitBreakerOpen
    })
  };
};
