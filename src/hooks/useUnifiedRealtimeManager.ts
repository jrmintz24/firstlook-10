
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
  connectionId: string;
}

interface UnifiedRealtimeManager {
  subscribe: (config: SubscriptionConfig) => void;
  unsubscribe: (channelName: string) => void;
  unsubscribeAll: () => void;
  getConnectionStatus: (channelName: string) => ConnectionState;
  getGlobalStats: () => { activeConnections: number; errorRate: number };
}

// Global connection pool to prevent duplicate subscriptions
const globalChannelPool = new Map<string, RealtimeChannel>();
const globalConnectionStates = new Map<string, ConnectionState>();
const globalRetryTimeouts = new Map<string, NodeJS.Timeout>();

// Configuration constants
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 2000;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // Increased from 30s
const MAX_CONCURRENT_CONNECTIONS = 5;
const CONNECTION_HEALTH_CHECK_INTERVAL = 30000;

export const useUnifiedRealtimeManager = (): UnifiedRealtimeManager => {
  const managerIdRef = useRef(`manager_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const generateConnectionId = useCallback(() => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getConnectionState = useCallback((channelName: string): ConnectionState => {
    return globalConnectionStates.get(channelName) || {
      isConnected: false,
      isConnecting: false,
      retryCount: 0,
      circuitBreakerOpen: false,
      connectionId: generateConnectionId(),
    };
  }, [generateConnectionId]);

  const updateConnectionState = useCallback((channelName: string, updates: Partial<ConnectionState>) => {
    const current = getConnectionState(channelName);
    globalConnectionStates.set(channelName, { ...current, ...updates });
  }, [getConnectionState]);

  const cleanupChannel = useCallback((channelName: string) => {
    console.log(`[UnifiedRealtimeManager] Cleaning up channel: ${channelName}`);
    
    const channel = globalChannelPool.get(channelName);
    if (channel) {
      try {
        supabase.removeChannel(channel);
        globalChannelPool.delete(channelName);
      } catch (error) {
        console.error(`[UnifiedRealtimeManager] Error removing channel ${channelName}:`, error);
      }
    }

    const timeout = globalRetryTimeouts.get(channelName);
    if (timeout) {
      clearTimeout(timeout);
      globalRetryTimeouts.delete(channelName);
    }

    updateConnectionState(channelName, {
      isConnected: false,
      isConnecting: false,
    });

    subscriptionsRef.current.delete(channelName);
  }, [updateConnectionState]);

  const resetCircuitBreaker = useCallback((channelName: string) => {
    console.log(`[UnifiedRealtimeManager] Resetting circuit breaker for: ${channelName}`);
    updateConnectionState(channelName, {
      circuitBreakerOpen: false,
      retryCount: 0,
      lastError: undefined,
    });
  }, [updateConnectionState]);

  const subscribe = useCallback((config: SubscriptionConfig) => {
    const { channelName, table, filter, onDataChange, enabled } = config;

    if (!enabled) {
      cleanupChannel(channelName);
      return;
    }

    // Check if we're at max concurrent connections
    if (globalChannelPool.size >= MAX_CONCURRENT_CONNECTIONS) {
      console.warn(`[UnifiedRealtimeManager] Max concurrent connections reached (${MAX_CONCURRENT_CONNECTIONS})`);
      return;
    }

    const state = getConnectionState(channelName);
    
    // Check circuit breaker
    if (state.circuitBreakerOpen) {
      console.log(`[UnifiedRealtimeManager] Circuit breaker open for ${channelName}, skipping subscription`);
      return;
    }

    // Prevent duplicate subscriptions
    if (globalChannelPool.has(channelName)) {
      console.log(`[UnifiedRealtimeManager] Channel ${channelName} already exists, reusing connection`);
      return;
    }

    console.log(`[UnifiedRealtimeManager] Creating subscription for ${channelName}`);
    updateConnectionState(channelName, { 
      isConnecting: true,
      connectionId: generateConnectionId()
    });

    // Create unique channel with connection ID
    const connectionId = state.connectionId || generateConnectionId();
    const uniqueChannelName = `${channelName}_${connectionId}`;
    
    const channel = supabase.channel(uniqueChannelName);
    
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
      console.log(`[UnifiedRealtimeManager] Data change received for ${channelName}:`, payload.eventType);
      try {
        onDataChange();
      } catch (error) {
        console.error(`[UnifiedRealtimeManager] Error in onDataChange callback for ${channelName}:`, error);
      }
    });

    channel.subscribe((status) => {
      console.log(`[UnifiedRealtimeManager] Subscription status for ${channelName}:`, status);
      
      switch (status) {
        case 'SUBSCRIBED':
          updateConnectionState(channelName, {
            isConnected: true,
            isConnecting: false,
            retryCount: 0,
            circuitBreakerOpen: false,
            lastError: undefined,
          });
          subscriptionsRef.current.add(channelName);
          break;
          
        case 'CHANNEL_ERROR':
          console.error(`[UnifiedRealtimeManager] Channel error for ${channelName}`);
          updateConnectionState(channelName, {
            isConnected: false,
            isConnecting: false,
            lastError: 'Channel error',
          });
          
          const currentState = getConnectionState(channelName);
          if (currentState.retryCount < MAX_RETRIES) {
            const delay = BASE_RETRY_DELAY * Math.pow(2, currentState.retryCount);
            console.log(`[UnifiedRealtimeManager] Retrying ${channelName} in ${delay}ms (attempt ${currentState.retryCount + 1}/${MAX_RETRIES})`);
            
            const timeout = setTimeout(() => {
              updateConnectionState(channelName, {
                retryCount: currentState.retryCount + 1,
              });
              cleanupChannel(channelName);
              subscribe(config);
            }, delay);
            
            globalRetryTimeouts.set(channelName, timeout);
          } else {
            console.log(`[UnifiedRealtimeManager] Max retries reached for ${channelName}, opening circuit breaker`);
            updateConnectionState(channelName, {
              circuitBreakerOpen: true,
            });
            
            // Reset circuit breaker after timeout
            setTimeout(() => {
              resetCircuitBreaker(channelName);
            }, CIRCUIT_BREAKER_TIMEOUT);
          }
          break;
          
        case 'CLOSED':
          console.log(`[UnifiedRealtimeManager] Channel closed for ${channelName}`);
          updateConnectionState(channelName, {
            isConnected: false,
            isConnecting: false,
          });
          subscriptionsRef.current.delete(channelName);
          break;
      }
    });

    globalChannelPool.set(channelName, channel);
  }, [getConnectionState, updateConnectionState, cleanupChannel, resetCircuitBreaker, generateConnectionId]);

  const unsubscribe = useCallback((channelName: string) => {
    cleanupChannel(channelName);
  }, [cleanupChannel]);

  const unsubscribeAll = useCallback(() => {
    console.log(`[UnifiedRealtimeManager] Unsubscribing all channels for manager: ${managerIdRef.current}`);
    const channelNames = Array.from(subscriptionsRef.current);
    channelNames.forEach(cleanupChannel);
  }, [cleanupChannel]);

  const getConnectionStatus = useCallback((channelName: string) => {
    return getConnectionState(channelName);
  }, [getConnectionState]);

  const getGlobalStats = useCallback(() => {
    const activeConnections = globalChannelPool.size;
    const totalStates = globalConnectionStates.size;
    const errorCount = Array.from(globalConnectionStates.values()).filter(state => state.lastError).length;
    const errorRate = totalStates > 0 ? errorCount / totalStates : 0;

    return { activeConnections, errorRate };
  }, []);

  // Health check system
  useEffect(() => {
    const healthCheck = setInterval(() => {
      const stats = getGlobalStats();
      console.log(`[UnifiedRealtimeManager] Health check - Active: ${stats.activeConnections}, Error rate: ${(stats.errorRate * 100).toFixed(1)}%`);
      
      // Reset circuit breakers if error rate is too high
      if (stats.errorRate > 0.5 && stats.activeConnections < MAX_CONCURRENT_CONNECTIONS / 2) {
        console.log('[UnifiedRealtimeManager] High error rate detected, resetting all circuit breakers');
        globalConnectionStates.forEach((state, channelName) => {
          if (state.circuitBreakerOpen) {
            resetCircuitBreaker(channelName);
          }
        });
      }
    }, CONNECTION_HEALTH_CHECK_INTERVAL);

    return () => {
      clearInterval(healthCheck);
    };
  }, [getGlobalStats, resetCircuitBreaker]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, [unsubscribeAll]);

  return {
    subscribe,
    unsubscribe,
    unsubscribeAll,
    getConnectionStatus,
    getGlobalStats,
  };
};
