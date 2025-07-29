import { useEffect, useCallback } from 'react';
import { autoCompleteConsultations } from '@/services/consultationService';

/**
 * Hook to periodically check and auto-complete consultations
 * This should be used in a component that's always mounted (like a layout or dashboard)
 */
export const useConsultationAutoComplete = (enabled: boolean = true, intervalMinutes: number = 5) => {
  const checkAndAutoComplete = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const result = await autoCompleteConsultations();
      
      if (result.completed > 0) {
        console.log(`Auto-completed ${result.completed} consultations`);
      }
      
      if (result.errors.length > 0) {
        console.error('Auto-complete errors:', result.errors);
      }
    } catch (error) {
      console.error('Failed to run auto-complete:', error);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Run immediately on mount
    checkAndAutoComplete();

    // Set up interval
    const interval = setInterval(checkAndAutoComplete, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, intervalMinutes, checkAndAutoComplete]);

  return { checkAndAutoComplete };
};