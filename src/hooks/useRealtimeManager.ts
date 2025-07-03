
import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeManagerConfig {
  userId: string | null;
  onShowingRequestsChange?: () => void;
  onMessagesChange?: () => void;
  enabled?: boolean;
}

export const useRealtimeManager = ({
  userId,
  onShowingRequestsChange,
  onMessagesChange,
  enabled = true
}: RealtimeManagerConfig) => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disabled'>('disabled');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const baseRetryDelay = 2000;

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log('Cleaning up realtime manager connection');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setConnectionStatus('disabled');
  }, []);

  const setupConnection = useCallback(() => {
    if (!enabled || !userId) {
      cleanup();
      return;
    }

    cleanup();
    setConnectionStatus('connecting');

    console.log('Setting up centralized realtime connection for user:', userId);

    const channel = supabase
      .channel(`unified_updates_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Realtime: Showing requests change detected', payload);
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
        (payload) => {
          console.log('Realtime: Messages change detected', payload);
          onMessagesChange?.();
        }
      )
      .subscribe((status) => {
        console.log('Realtime manager status:', status);
        
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          retryCountRef.current = 0;
          console.log('Realtime connection established successfully');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
          console.log('Realtime connection failed, will retry if under limit');
          
          if (retryCountRef.current < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
            console.log(`Retrying realtime connection in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              setupConnection();
            }, delay);
          } else {
            console.log('Max realtime retries reached, relying on polling');
          }
        } else if (status === 'CLOSED') {
          setConnectionStatus('error');
          console.log('Realtime connection closed');
        }
      });

    channelRef.current = channel;
  }, [userId, enabled, onShowingRequestsChange, onMessagesChange, cleanup]);

  useEffect(() => {
    setupConnection();
    return cleanup;
  }, [setupConnection, cleanup]);

  const reconnect = useCallback(() => {
    retryCountRef.current = 0;
    setupConnection();
  }, [setupConnection]);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    reconnect,
    cleanup
  };
};
