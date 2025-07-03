
import { useMemo } from 'react';

interface SubscriptionStatus {
  isReady: boolean;
  connectionHealth: {
    retryCount: number;
    lastError: string | null;
    circuitBreakerOpen: boolean;
    lastSuccessfulConnection: Date | null;
  };
}

interface UseSubscriptionReadinessProps {
  subscriptions: Record<string, SubscriptionStatus>;
  requiredForSubmission?: string[];
}

export const useSubscriptionReadiness = ({ 
  subscriptions, 
  requiredForSubmission = [] 
}: UseSubscriptionReadinessProps) => {
  
  const overallHealth = useMemo(() => {
    const allSubscriptions = Object.entries(subscriptions);
    const totalSubscriptions = allSubscriptions.length;
    const readySubscriptions = allSubscriptions.filter(([, status]) => status.isReady).length;
    const failedSubscriptions = allSubscriptions.filter(([, status]) => 
      status.connectionHealth.circuitBreakerOpen
    ).length;
    
    // Check if required subscriptions are ready
    const requiredReady = requiredForSubmission.length === 0 || 
      requiredForSubmission.every(name => subscriptions[name]?.isReady);
    
    const isHealthy = readySubscriptions > 0 && failedSubscriptions === 0;
    const isPartiallyHealthy = readySubscriptions > 0 && failedSubscriptions < totalSubscriptions;
    
    return {
      totalSubscriptions,
      readySubscriptions,
      failedSubscriptions,
      requiredReady,
      isHealthy,
      isPartiallyHealthy,
      canSubmitForms: requiredReady || readySubscriptions > 0, // Allow submission if at least one is ready
      overallStatus: isHealthy ? 'healthy' : isPartiallyHealthy ? 'partial' : 'failed'
    };
  }, [subscriptions, requiredForSubmission]);

  const getSubscriptionErrors = useMemo(() => {
    return Object.entries(subscriptions)
      .filter(([, status]) => status.connectionHealth.lastError)
      .map(([name, status]) => ({
        name,
        error: status.connectionHealth.lastError,
        retryCount: status.connectionHealth.retryCount
      }));
  }, [subscriptions]);

  return {
    ...overallHealth,
    subscriptions,
    errors: getSubscriptionErrors
  };
};
