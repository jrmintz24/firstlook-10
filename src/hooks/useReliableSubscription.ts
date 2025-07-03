
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuthValidation } from './useAuthValidation';

interface UseReliableSubscriptionProps {
  channelName: string;
  table: string;
  filter?: string;
  onDataChange: () => void;
  enabled?: boolean;
}

export const useReliableSubscription = ({
  channelName,
  table,
  filter,
  onDataChange,
  enabled = true
}: UseReliableSubscriptionProps) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const authRetryCountRef = useRef(0);
  const maxRetries = 5;
  const maxAuthRetries = 3;
  const baseRetryDelay = 1000;
  const authRetryDelay = 2000;
  
  const { validateAuthSession } = useAuthValidation();

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log(`Cleaning up subscription: ${channelName}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, [channelName]);

  const setupSubscription = useCallback(async () => {
    if (!enabled) {
      cleanup();
      return;
    }

    // Validate auth session before attempting subscription
    const { isValid, userId } = await validateAuthSession();
    
    if (!isValid || !userId) {
      console.warn(`Auth not ready for subscription: ${channelName}. Retrying...`);
      
      // Retry auth validation up to maxAuthRetries times
      if (authRetryCountRef.current < maxAuthRetries) {
        authRetryCountRef.current++;
        retryTimeoutRef.current = setTimeout(() => {
          setupSubscription();
        }, authRetryDelay);
      } else {
        console.error(`Max auth retries reached for ${channelName}. Subscription aborted.`);
        authRetryCountRef.current = 0; // Reset for future attempts
      }
      return;
    }

    // Reset auth retry count on successful validation
    authRetryCountRef.current = 0;

    cleanup();

    console.log(`Setting up reliable subscription: ${channelName} for user: ${userId}`);

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
        console.log(`${channelName} subscription status:`, status);
        
        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          console.log(`Successfully subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`${channelName} subscription error - Auth valid: ${isValid}, User ID: ${userId}`);
          
          if (retryCountRef.current < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
            console.log(`Retrying ${channelName} subscription in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              setupSubscription();
            }, delay);
          } else {
            console.error(`Max retries reached for ${channelName} subscription`);
          }
        } else if (status === 'CLOSED') {
          console.log(`${channelName} subscription closed`);
        }
      });

    channelRef.current = channel;
  }, [channelName, table, filter, onDataChange, enabled, cleanup, validateAuthSession]);

  useEffect(() => {
    setupSubscription();
    return cleanup;
  }, [setupSubscription, cleanup]);

  useEffect(() => {
    retryCountRef.current = 0;
    authRetryCountRef.current = 0;
  }, [enabled]);

  return {
    cleanup,
    retry: setupSubscription,
    isConnected: channelRef.current !== null
  };
};
