
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePendingTourHandler = (currentUser: any, fetchUserData: () => void) => {
  const { toast } = useToast();

  const handlePendingTourRequest = async () => {
    const pendingRequest = localStorage.getItem('pendingTourRequest');
    if (!pendingRequest) return;

    try {
      const tourData = JSON.parse(pendingRequest);
      
      if (!currentUser || !tourData.properties?.length) {
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      console.log('Processing pending tour request:', tourData);

      const requests = tourData.properties.map((property: string) => ({
        user_id: currentUser.id,
        property_address: property,
        preferred_date: tourData.preferredDates?.[0]?.date || null,
        preferred_time: tourData.preferredDates?.[0]?.time || null,
        message: tourData.notes || null,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('showing_requests')
        .insert(requests);

      if (error) {
        console.error('Error creating pending showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to process your pending tour request.",
          variant: "destructive"
        });
      } else {
        localStorage.removeItem('pendingTourRequest');
        toast({
          title: "Tour Request Submitted!",
          description: `Your tour request for ${requests.length} property${requests.length > 1 ? 'ies' : ''} has been submitted successfully!`,
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error processing pending tour request:', error);
      localStorage.removeItem('pendingTourRequest');
    }
  };

  useEffect(() => {
    if (currentUser) {
      handlePendingTourRequest();
    }
  }, [currentUser]);

  return { handlePendingTourRequest };
};
