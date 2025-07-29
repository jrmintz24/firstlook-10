import { supabase } from '@/integrations/supabase/client';

interface ConsultationAutoCompleteResult {
  completed: number;
  errors: string[];
}

/**
 * Auto-complete consultations that are 2+ hours past their scheduled time
 * This can be called from a cron job or periodically from the application
 */
export const autoCompleteConsultations = async (): Promise<ConsultationAutoCompleteResult> => {
  const result: ConsultationAutoCompleteResult = {
    completed: 0,
    errors: []
  };

  try {
    // Find consultations that need auto-completion
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const { data: consultations, error: fetchError } = await supabase
      .from('consultation_bookings')
      .select('id, offer_intent_id, scheduled_at')
      .eq('status', 'confirmed')
      .is('completed_at', null)
      .eq('issue_reported', false)
      .lt('scheduled_at', twoHoursAgo.toISOString());

    if (fetchError) {
      result.errors.push(`Failed to fetch consultations: ${fetchError.message}`);
      return result;
    }

    if (!consultations || consultations.length === 0) {
      return result;
    }

    // Update each consultation
    for (const consultation of consultations) {
      const { error: updateError } = await supabase
        .from('consultation_bookings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completion_method: 'auto_time',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultation.id);

      if (updateError) {
        result.errors.push(`Failed to update consultation ${consultation.id}: ${updateError.message}`);
      } else {
        result.completed++;
      }
    }

    return result;
  } catch (error) {
    result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
};

/**
 * Check if a consultation should show auto-complete warning
 * Returns true if consultation is approaching the 2-hour auto-complete threshold
 */
export const shouldShowAutoCompleteWarning = (scheduledAt: string): boolean => {
  const scheduled = new Date(scheduledAt);
  const now = new Date();
  const hoursElapsed = (now.getTime() - scheduled.getTime()) / (1000 * 60 * 60);
  
  // Show warning if between 1.5 and 2 hours after scheduled time
  return hoursElapsed >= 1.5 && hoursElapsed < 2;
};

/**
 * Get time remaining until auto-completion
 */
export const getTimeUntilAutoComplete = (scheduledAt: string): string => {
  const scheduled = new Date(scheduledAt);
  const autoCompleteTime = new Date(scheduled.getTime() + (2 * 60 * 60 * 1000)); // 2 hours after
  const now = new Date();
  
  const minutesRemaining = Math.max(0, Math.floor((autoCompleteTime.getTime() - now.getTime()) / (1000 * 60)));
  
  if (minutesRemaining === 0) return 'Auto-completing soon';
  if (minutesRemaining < 60) return `${minutesRemaining} minutes`;
  
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;
  return `${hours}h ${minutes}m`;
};