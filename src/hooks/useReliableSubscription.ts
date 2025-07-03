
import { useEffect, useRef, useCallback, useState } from 'react';
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

interface ConnectionHealth {
  retryCount: number;
  lastError: string | null;
  circuitBreakerOpen: boolean;
  lastSuccessfulConnection: Date | null;
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
  const circuitBreakerTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [isReady, setIsReady] = useState(false);
  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth>({
    retryCount: 0,
    lastError: null,
    circuitBreakerOpen: false,
    lastSuccessfulConnection: null
  });
  
  const maxRetries = 5;
  const maxAuthRetries = 3;
  const baseRetryDelay = 1000;
  const authRetryDelay = 2000;
  const circuitBreakerTimeout = 30000; // 30 seconds
  
  const { validateAuthSession } = useAuthValidation();

  const updateConnectionHealth = useCallback((updates: Partial<ConnectionHealth>) => {
    setConnectionHealth(prev => ({ ...prev, ...updates }));
  }, []);

  const openCircuitBreaker = useCallback(() => {
    console.log(`Opening circuit breaker for ${channelName}`);
    setIsReady(false);
    updateConnectionHealth({ 
      circuitBreakerOpen: true,
      lastError: 'Max retries reached, circuit breaker opened'
    });
    
    // Reset circuit breaker after timeout
    circuitBreakerTimeoutRef.current = setTimeout(() => {
      console.log(`Resetting circuit breaker for ${channelName}`);
      retryCountRef.current = 0;
      authRetryCountRef.current = 0;
      updateConnectionHealth({ 
        circuitBreakerOpen: false,
        retryCount: 0,
        lastError: null
      });
      if (enabled) {
        setupSubscription();
      }
    }, circuitBreakerTimeout);
  }, [channelName, enabled]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log(`Cleaning up subscription: ${channelName}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (circuitBreakerTimeoutRef.current) {
      clearTimeout(circuitBreakerTimeoutRef.current);
    }
    setIsReady(false);
  }, [channelName]);

  const setupSubscription = useCallback(async () => {
    if (!enabled || connectionHealth.circuitBreakerOpen) {
      cleanup();
      return;
    }

    // Validate auth session before attempting subscription
    const { isValid, userId } = await validateAuthSession();
    
    if (!isValid || !userId) {
      console.warn(`Auth not ready for subscription: ${channelName}. Retrying...`);
      updateConnectionHealth({ 
        lastError: 'Authentication not ready',
        retryCount: authRetryCountRef.current
      });
      
      // Retry auth validation up to maxAuthRetries times
      if (authRetryCountRef.current < maxAuthRetries) {
        authRetryCountRef.current++;
        retryTimeoutRef.current = setTimeout(() => {
          setupSubscription();
        }, authRetryDelay);
      } else {
        console.error(`Max auth retries reached for ${channelName}. Opening circuit breaker.`);
        openCircuitBreaker();
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
          setIsReady(true);
          updateConnectionHealth({
            retryCount: 0,
            lastError: null,
            circuitBreakerOpen: false,
            lastSuccessfulConnection: new Date()
          });
          console.log(`Successfully subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          const errorMsg = `${channelName} subscription error - Auth valid: ${isValid}, User ID: ${userId}`;
          console.error(errorMsg);
          setIsReady(false);
          updateConnectionHealth({ 
            lastError: errorMsg,
            retryCount: retryCountRef.current
          });
          
          if (retryCountRef.current < maxRetries) {
            const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
            console.log(`Retrying ${channelName} subscription in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
            
            retryTimeoutRef.current = setTimeout(() => {
              retryCountRef.current++;
              updateConnectionHealth({ retryCount: retryCountRef.current });
              setupSubscription();
            }, delay);
          } else {
            console.error(`Max retries reached for ${channelName} subscription`);
            openCircuitBreaker();
          }
        } else if (status === 'CLOSED') {
          console.log(`${channelName} subscription closed`);
          setIsReady(false);
        }
      });

    channelRef.current = channel;
  }, [channelName, table, filter, onDataChange, enabled, cleanup, validateAuthSession, updateConnectionHealth, openCircuitBreaker, connectionHealth.circuitBreakerOpen]);

  useEffect(() => {
    setupSubscription();
    return cleanup;
  }, [setupSubscription, cleanup]);

  useEffect(() => {
    retryCountRef.current = 0;
    authRetryCountRef.current = 0;
    updateConnectionHealth({ 
      retryCount: 0,
      circuitBreakerOpen: false,
      lastError: null
    });
  }, [enabled, updateConnectionHealth]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    authRetryCountRef.current = 0;
    updateConnectionHealth({ 
      retryCount: 0,
      circuitBreakerOpen: false,
      lastError: null
    });
    setupSubscription();
  }, [setupSubscription, updateConnectionHealth]);

  return {
    cleanup,
    retry,
    isConnected: channelRef.current !== null,
    isReady,
    connectionHealth
  };
};
