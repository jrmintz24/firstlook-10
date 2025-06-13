
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidShowingStatus } from "@/utils/showingStatus";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  requested_agent_name?: string | null;
  requested_agent_phone?: string | null;
  requested_agent_email?: string | null;
  requested_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface ShowingRequestUpdates {
  status: string;
  status_updated_at: string;
  estimated_confirmation_date?: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
}

export const useShowingRequestsAdmin = () => {
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchShowingRequests = async () => {
    console.log('Fetching all showing requests...');
    setLoading(true);
    
    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from("showing_requests")
        .select("*")
        .order("created_at", { ascending: false });

      console.log('Requests fetch result:', { 
        requestsData, 
        requestsError,
        count: requestsData?.length || 0 
      });

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests",
          variant: "destructive",
        });
        setShowingRequests([]);
      } else {
        console.log('Successfully fetched requests:', requestsData?.length || 0);
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Exception in fetchShowingRequests:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: string,
    estimatedDate?: string
  ) => {
    if (!isValidShowingStatus(newStatus)) {
      toast({ title: "Error", description: "Invalid status", variant: "destructive" });
      return false;
    }

    const updates: ShowingRequestUpdates = {
      status: newStatus,
      status_updated_at: new Date().toISOString(),
    };
    if (estimatedDate) {
      updates.estimated_confirmation_date = estimatedDate;
    }

    const { error } = await supabase
      .from("showing_requests")
      .update(updates)
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      return false;
    }
    toast({ title: "Status Updated" });
    fetchShowingRequests();
    return true;
  };

  const approveShowingRequest = async (requestId: string) => {
    const newStatus = 'confirmed';
    const { error } = await supabase
      .from('showing_requests')
      .update({
        status: newStatus,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve request', variant: 'destructive' });
    } else {
      toast({ title: 'Approved', description: 'Showing request approved.' });
      fetchShowingRequests();
      // Call notification function
      await supabase.functions.invoke('notify-agent', {
        body: { requestId },
      });
    }
  };

  useEffect(() => {
    fetchShowingRequests();
  }, []);

  return {
    showingRequests,
    loading,
    handleStatusUpdate,
    approveShowingRequest,
    fetchShowingRequests
  };
};
