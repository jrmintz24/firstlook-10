
import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseStableSubscriptionProps {
  channelName: string;
  table: string;
  filter?: string;
  onDataChange: () => void;
  enabled?: boolean;
}

export const useStableSubscription = ({
  channelName,
  table,
  filter,
  onDataChange,
  enabled = true
}: UseStableSubscriptionProps) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  
  const maxRetries = 3; // Reduced from 5
  const baseRetryDelay = 2000; // Increased from 1000ms
  const maxRetryDelay = 10000; // Cap retry delay

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log(`Cleaning up stable subscription: ${channelName}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setConnectionStatus('disconnected');
  }, [channelName]);

  const setupSubscription = useCallback(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    cleanup();
    setConnectionStatus('connecting');

    console.log(`Setting up stable subscription: ${channelName}`);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter })
        },
        (payload) => {
          console.log(`${channelName} change detected:`, payload);
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log(`${channelName} stable subscription status:`, status);
        
        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          setConnectionStatus('connected');
          console.log(`Successfully subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`${channelName} subscription error`);
          setConnectionStatus('error');
          
          // Only retry if we haven't exceeded max retries
          if (retryCountRef.current < maxRetries) {
            const delay = Math.min(
              baseRetryDelay * Math.pow(2, retryCountRef.current),
              maxRetryDelay
            );
            console.log(`Retrying ${channelName} subscription in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              setupSubscription();
            }, delay);
          } else {
            console.error(`Max retries reached for ${channelName} subscription, giving up`);
            setConnectionStatus('error');
          }
        } else if (status === 'CLOSED') {
          console.log(`${channelName} subscription closed`);
          setConnectionStatus('disconnected');
        }
      });

    channelRef.current = channel;
  }, [channelName, table, filter, onDataChange, enabled, cleanup]);

  const forceRetry = useCallback(() => {
    retryCountRef.current = 0;
    setupSubscription();
  }, [setupSubscription]);

  useEffect(() => {
    setupSubscription();
    return cleanup;
  }, [setupSubscription, cleanup]);

  useEffect(() => {
    retryCountRef.current = 0;
  }, [enabled]);

  return {
    cleanup,
    retry: forceRetry,
    connectionStatus,
    isConnected: connectionStatus === 'connected'
  };
};
