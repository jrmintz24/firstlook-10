
import { useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

export const useMessageSubscriptionManager = () => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const circuitBreakerRef = useRef(false);
  const maxRetries = 3;
  const baseRetryDelay = 2000;
  const circuitBreakerTimeout = 30000; // 30 seconds

  const resetConnection = useCallback(() => {
    retryCountRef.current = 0;
    circuitBreakerRef.current = false;
  }, []);

  const cleanupConnection = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const createSubscription = useCallback((userId: string, onMessageReceived: () => void) => {
    // Check circuit breaker
    if (circuitBreakerRef.current) {
      console.log('Circuit breaker is open, skipping subscription');
      return null;
    }

    // Clean up existing connection
    cleanupConnection();

    console.log('Setting up message subscription for user:', userId);

    const channel = supabase
      .channel(`messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        () => {
          console.log('New message received, refreshing...');
          onMessageReceived();
        }
      )
      .subscribe((status) => {
        console.log('Message subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          circuitBreakerRef.current = false;
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Message subscription error');
          
          if (retryCountRef.current < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
            console.log(`Retrying message subscription in ${delay}ms`);
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              createSubscription(userId, onMessageReceived);
            }, delay);
          } else {
            console.log('Max retries reached, opening circuit breaker');
            circuitBreakerRef.current = true;
            
            // Reset circuit breaker after timeout
            setTimeout(() => {
              console.log('Resetting circuit breaker');
              resetConnection();
            }, circuitBreakerTimeout);
          }
        } else if (status === 'CLOSED') {
          console.log('Message subscription closed');
        }
      });

    channelRef.current = channel;
    return channel;
  }, [cleanupConnection, resetConnection]);

  return {
    createSubscription,
    cleanupConnection,
    resetConnection
  };
};
