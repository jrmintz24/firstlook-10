
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PendingTourData {
  properties: string[];
  preferredDates: { date: string; time: string }[];
  notes?: string;
}

export const usePendingTourHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const processPendingTour = async () => {
    if (!user) return;

    const pendingTourData = localStorage.getItem('pendingTourRequest');
    if (!pendingTourData) return;

    try {
      console.log('Processing pending tour for user:', user.id);
      const tourData: PendingTourData = JSON.parse(pendingTourData);
      
      if (!tourData.properties || tourData.properties.length === 0) {
        console.log('No properties in pending tour data');
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      // Get the first preferred date/time
      const firstPreference = tourData.preferredDates?.[0];
      const preferredDate = firstPreference?.date || null;
      const preferredTime = firstPreference?.time || null;

      // Calculate estimated confirmation date (2 business days from now)
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 2);

      // Create showing requests for each property
      const requests = tourData.properties.map(property => ({
        user_id: user.id,
        property_address: property,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: tourData.notes || null,
        internal_notes: tourData.preferredDates.length > 1 ? JSON.stringify({ preferredOptions: tourData.preferredDates }) : null,
        status: 'pending',
        estimated_confirmation_date: estimatedDate.toISOString().split('T')[0]
      }));

      console.log('Creating pending tour requests:', requests);

      const { data, error } = await supabase
        .from('showing_requests')
        .insert(requests)
        .select();

      if (error) {
        console.error('Error creating pending tour requests:', error);
        toast({
          title: "Error",
          description: `Failed to process your tour request: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully created pending tour requests:', data);

      // Clear the pending tour data
      localStorage.removeItem('pendingTourRequest');

      toast({
        title: "Tour Request Processed! 🎉",
        description: `Your tour request for ${tourData.properties.length} propert${tourData.properties.length > 1 ? 'ies has' : 'y has'} been submitted successfully.`,
      });

    } catch (error) {
      console.error('Error processing pending tour:', error);
      localStorage.removeItem('pendingTourRequest'); // Clean up invalid data
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User signed in, checking for pending tours');
      processPendingTour();
    }
  }, [user]);

  return { processPendingTour };
};
