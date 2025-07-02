
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

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
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const baseRetryDelay = 2000;

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log('Cleaning up showing requests subscription for user:', userId);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryCountRef.current = 0;
  }, [userId]);

  const setupSubscription = useCallback(() => {
    if (!userId || !enabled) {
      cleanup();
      return;
    }

    // Clean up existing subscription
    cleanup();

    console.log('Setting up showing requests subscription for user:', userId);

    const channel = supabase
      .channel(`showing_requests_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Showing request change detected:', payload);
          // Trigger data refresh
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log('Showing requests subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          console.log('Successfully subscribed to showing requests changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Showing requests subscription error');
          
          // Retry with exponential backoff
          if (retryCountRef.current < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
            console.log(`Retrying showing requests subscription in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              setupSubscription();
            }, delay);
          } else {
            console.error('Max retries reached for showing requests subscription');
          }
        } else if (status === 'CLOSED') {
          console.log('Showing requests subscription closed');
        }
      });

    channelRef.current = channel;
  }, [userId, enabled, onDataChange, cleanup]);

  useEffect(() => {
    setupSubscription();
    return cleanup;
  }, [setupSubscription, cleanup]);

  // Reset connection on user change
  useEffect(() => {
    retryCountRef.current = 0;
  }, [userId]);

  return {
    cleanup,
    retry: setupSubscription
  };
};
