
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TourAgreement {
  id: string;
  showing_request_id: string;
  signed: boolean;
  signed_at: string | null;
  agreement_type: string;
  created_at: string;
}

interface ShowingWithAgreement {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  assigned_agent_name: string | null;
  assigned_agent_phone: string | null;
  tour_agreement: TourAgreement | null;
}

export const useDashboardAgreements = (userId: string) => {
  const [showingsWithAgreements, setShowingsWithAgreements] = useState<ShowingWithAgreement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchShowingsWithAgreements = async () => {
    setLoading(true);
    try {
      // Fetch showings that need agreements
      const { data: showings, error: showingsError } = await supabase
        .from('showing_requests')
        .select(`
          id,
          property_address,
          preferred_date,
          preferred_time,
          status,
          assigned_agent_name,
          assigned_agent_phone
        `)
        .eq('user_id', userId)
        .eq('status', 'awaiting_agreement');

      if (showingsError) {
        console.error('Error fetching showings:', showingsError);
        return;
      }

      // Fetch corresponding tour agreements
      const showingIds = showings?.map(s => s.id) || [];
      const { data: agreements, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('*')
        .in('showing_request_id', showingIds);

      if (agreementsError) {
        console.error('Error fetching agreements:', agreementsError);
      }

      // Combine the data
      const combined = showings?.map(showing => ({
        ...showing,
        tour_agreement: agreements?.find(a => a.showing_request_id === showing.id) || null
      })) || [];

      setShowingsWithAgreements(combined);
    } catch (error) {
      console.error('Error in fetchShowingsWithAgreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const signAgreement = async (showingId: string, signerName: string) => {
    try {
      // First, try to find existing agreement
      let { data: agreement, error: findError } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('showing_request_id', showingId)
        .eq('buyer_id', userId)
        .single();

      if (findError || !agreement) {
        // Create agreement if it doesn't exist
        console.log('Creating missing tour agreement...');
        const { data: newAgreement, error: createError } = await supabase
          .from('tour_agreements')
          .insert({
            showing_request_id: showingId,
            buyer_id: userId,
            agreement_type: 'single_tour',
            signed: false,
            email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating agreement:', createError);
          throw new Error('Failed to create agreement');
        }
        agreement = newAgreement;
      }

      // Sign the agreement
      const { error: signError } = await supabase
        .from('tour_agreements')
        .update({
          signed: true,
          signed_at: new Date().toISOString()
        })
        .eq('id', agreement.id);

      if (signError) {
        console.error('Error signing agreement:', signError);
        throw new Error('Failed to sign agreement');
      }

      // Update showing status to confirmed (NOT completed)
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showingId);

      if (statusError) {
        console.error('Error updating showing status:', statusError);
        throw new Error('Failed to update showing status');
      }

      toast({
        title: "Agreement Signed",
        description: "Your tour agreement has been signed successfully. Your tour is now confirmed!"
      });

      // Refresh the data
      await fetchShowingsWithAgreements();

      return true;
    } catch (error: any) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchShowingsWithAgreements();
    }
  }, [userId]);

  return {
    showingsWithAgreements,
    loading,
    signAgreement,
    refetch: fetchShowingsWithAgreements
  };
};
