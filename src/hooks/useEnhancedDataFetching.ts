
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataFetchingConfig {
  userId: string | null;
  enabled?: boolean;
  pollingInterval?: number;
  maxPollingInterval?: number;
}

export const useEnhancedDataFetching = ({
  userId,
  enabled = true,
  pollingInterval = 15000,
  maxPollingInterval = 60000
}: DataFetchingConfig) => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [currentPollingInterval, setCurrentPollingInterval] = useState(pollingInterval);
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const consecutiveErrorsRef = useRef(0);
  const { toast } = useToast();

  const fetchData = useCallback(async (showLoading = false) => {
    if (!userId || !enabled) return null;

    if (showLoading) {
      setIsRefreshing(true);
    }

    try {
      console.log('Enhanced data fetching: Fetching showing requests for user:', userId);
      
      const { data: showingData, error: showingError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (showingError) {
        throw showingError;
      }

      // Reset error count on successful fetch
      consecutiveErrorsRef.current = 0;
      setCurrentPollingInterval(pollingInterval);
      setLastFetchTime(Date.now());

      console.log('Enhanced data fetching: Successfully loaded', showingData?.length || 0, 'showing requests');
      return showingData || [];

    } catch (error) {
      console.error('Enhanced data fetching error:', error);
      consecutiveErrorsRef.current++;
      
      // Exponential backoff for polling interval
      const newInterval = Math.min(
        pollingInterval * Math.pow(2, consecutiveErrorsRef.current - 1),
        maxPollingInterval
      );
      setCurrentPollingInterval(newInterval);

      if (consecutiveErrorsRef.current === 1) {
        toast({
          title: "Connection Issue",
          description: "Having trouble loading your data. We'll keep trying.",
          variant: "destructive"
        });
      }

      return null;
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, enabled, pollingInterval, maxPollingInterval, toast]);

  const startPolling = useCallback(() => {
    if (!enabled || !userId) return;

    const poll = async () => {
      await fetchData();
      
      pollingTimeoutRef.current = setTimeout(() => {
        poll();
      }, currentPollingInterval);
    };

    // Clear existing timeout
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    // Start polling
    poll();
  }, [fetchData, currentPollingInterval, enabled, userId]);

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
  }, []);

  const manualRefresh = useCallback(async () => {
    console.log('Manual refresh triggered');
    return await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    return stopPolling;
  }, [stopPolling]);

  return {
    loading,
    isRefreshing,
    lastFetchTime,
    currentPollingInterval,
    consecutiveErrors: consecutiveErrorsRef.current,
    fetchData,
    startPolling,
    stopPolling,
    manualRefresh
  };
};
