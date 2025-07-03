
import { useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

interface SubscriptionConfig {
  channelName: string;
  table: string;
  filter?: string;
  onDataChange: () => void;
  enabled: boolean;
}

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  retryCount: number;
  circuitBreakerOpen: boolean;
  lastError?: string;
}

export const useReliableRealtimeManager = () => {
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const connectionStateRef = useRef<Map<string, ConnectionState>>(new Map());
  const retryTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const maxRetries = 3;
  const baseRetryDelay = 2000;
  const circuitBreakerTimeout = 30000;

  const getConnectionState = useCallback((channelName: string): ConnectionState => {
    return connectionStateRef.current.get(channelName) || {
      isConnected: false,
      isConnecting: false,
      retryCount: 0,
      circuitBreakerOpen: false,
    };
  }, []);

  const updateConnectionState = useCallback((channelName: string, updates: Partial<ConnectionState>) => {
    const current = getConnectionState(channelName);
    connectionStateRef.current.set(channelName, { ...current, ...updates });
  }, [getConnectionState]);

  const cleanupChannel = useCallback((channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      channelsRef.current.delete(channelName);
    }

    const timeout = retryTimeoutsRef.current.get(channelName);
    if (timeout) {
      clearTimeout(timeout);
      retryTimeoutsRef.current.delete(channelName);
    }

    updateConnectionState(channelName, {
      isConnected: false,
      isConnecting: false,
    });
  }, [updateConnectionState]);

  const createSubscription = useCallback((config: SubscriptionConfig) => {
    const { channelName, table, filter, onDataChange, enabled } = config;

    if (!enabled) {
      cleanupChannel(channelName);
      return;
    }

    const state = getConnectionState(channelName);
    
    // Check circuit breaker
    if (state.circuitBreakerOpen) {
      console.log(`Circuit breaker open for ${channelName}, skipping subscription`);
      return;
    }

    // Clean up existing connection
    cleanupChannel(channelName);

    console.log(`Setting up realtime subscription for ${channelName}`);
    updateConnectionState(channelName, { isConnecting: true });

    const channel = supabase.channel(channelName);
    
    // Configure postgres changes listener
    let pgConfig: any = {
      event: '*',
      schema: 'public',
      table: table,
    };

    if (filter) {
      pgConfig.filter = filter;
    }

    channel.on('postgres_changes', pgConfig, (payload) => {
      console.log(`Realtime update received for ${channelName}:`, payload);
      onDataChange();
    });

    channel.subscribe((status) => {
      console.log(`Subscription status for ${channelName}:`, status);
      
      switch (status) {
        case 'SUBSCRIBED':
          updateConnectionState(channelName, {
            isConnected: true,
            isConnecting: false,
            retryCount: 0,
            circuitBreakerOpen: false,
          });
          break;
          
        case 'CHANNEL_ERROR':
          console.error(`Channel error for ${channelName}`);
          updateConnectionState(channelName, {
            isConnected: false,
            isConnecting: false,
            lastError: 'Channel error',
          });
          
          const currentState = getConnectionState(channelName);
          if (currentState.retryCount < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, currentState.retryCount);
            console.log(`Retrying ${channelName} in ${delay}ms`);
            
            const timeout = setTimeout(() => {
              updateConnectionState(channelName, {
                retryCount: currentState.retryCount + 1,
              });
              createSubscription(config);
            }, delay);
            
            retryTimeoutsRef.current.set(channelName, timeout);
          } else {
            console.log(`Max retries reached for ${channelName}, opening circuit breaker`);
            updateConnectionState(channelName, {
              circuitBreakerOpen: true,
            });
            
            // Reset circuit breaker after timeout
            setTimeout(() => {
              console.log(`Resetting circuit breaker for ${channelName}`);
              updateConnectionState(channelName, {
                circuitBreakerOpen: false,
                retryCount: 0,
              });
            }, circuitBreakerTimeout);
          }
          break;
          
        case 'CLOSED':
          console.log(`Channel closed for ${channelName}`);
          updateConnectionState(channelName, {
            isConnected: false,
            isConnecting: false,
          });
          break;
      }
    });

    channelsRef.current.set(channelName, channel);
  }, [getConnectionState, updateConnectionState, cleanupChannel]);

  const unsubscribe = useCallback((channelName: string) => {
    cleanupChannel(channelName);
  }, [cleanupChannel]);

  const unsubscribeAll = useCallback(() => {
    const channelNames = Array.from(channelsRef.current.keys());
    channelNames.forEach(cleanupChannel);
  }, [cleanupChannel]);

  const getConnectionStatus = useCallback((channelName: string) => {
    return getConnectionState(channelName);
  }, [getConnectionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, [unsubscribeAll]);

  return {
    createSubscription,
    unsubscribe,
    unsubscribeAll,
    getConnectionStatus,
  };
};
