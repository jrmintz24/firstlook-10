
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseSimplifiedRealtimeProps {
  userId: string | null;
  onShowingRequestsChange?: () => void;
  onMessagesChange?: () => void;
  enabled?: boolean;
}

export const useSimplifiedRealtime = ({
  userId,
  onShowingRequestsChange,
  onMessagesChange,
  enabled = true
}: UseSimplifiedRealtimeProps) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log('Cleaning up realtime connection');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    isConnectingRef.current = false;
  }, []);

  const setupConnection = useCallback(() => {
    if (!enabled || !userId || isConnectingRef.current) return;

    cleanup();
    isConnectingRef.current = true;

    console.log('Setting up simplified realtime connection for user:', userId);

    // Create a single channel for all realtime updates
    const channel = supabase
      .channel(`user_updates_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Showing requests change detected');
          onShowingRequestsChange?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        () => {
          console.log('Messages change detected');
          onMessagesChange?.();
        }
      )
      .subscribe((status) => {
        console.log('Simplified realtime status:', status);
        isConnectingRef.current = false;
        
        if (status === 'SUBSCRIBED') {
          console.log('Realtime connection established successfully');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('Realtime connection failed, app will use polling fallback');
          // Don't retry aggressively - just let polling handle updates
        } else if (status === 'CLOSED') {
          console.log('Realtime connection closed');
        }
      });

    channelRef.current = channel;
  }, [userId, enabled, onShowingRequestsChange, onMessagesChange, cleanup]);

  useEffect(() => {
    setupConnection();
    return cleanup;
  }, [setupConnection, cleanup]);

  return {
    isConnected: channelRef.current !== null,
    reconnect: setupConnection,
    disconnect: cleanup
  };
};
