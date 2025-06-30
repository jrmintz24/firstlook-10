
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultationBooking {
  id: string;
  offer_intent_id: string;
  agent_id: string;
  buyer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meeting_link?: string;
  agent_notes?: string;
  buyer_notes?: string;
  created_at: string;
  updated_at: string;
}

interface OfferIntent {
  id: string;
  property_address: string;
  buyer_qualification: any;
  consultation_type: string;
  created_at: string;
}

export const useConsultationBookings = (userId?: string, userType: 'buyer' | 'agent' = 'buyer') => {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const column = userType === 'buyer' ? 'buyer_id' : 'agent_id';
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select(`
          *,
          offer_intents!inner(
            id,
            property_address,
            buyer_qualification,
            consultation_type,
            created_at
          )
        `)
        .eq(column, userId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching consultation bookings:', err);
      setError('Failed to fetch consultation bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status };
      
      if (notes) {
        if (userType === 'agent') {
          updateData.agent_notes = notes;
        } else {
          updateData.buyer_notes = notes;
        }
      }

      const { error } = await supabase
        .from('consultation_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation updated successfully"
      });

      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: "Failed to update consultation",
        variant: "destructive"
      });
    }
  };

  const rescheduleBooking = async (bookingId: string, newScheduledAt: string) => {
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ 
          scheduled_at: newScheduledAt,
          status: 'rescheduled'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation rescheduled successfully"
      });

      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      toast({
        title: "Error",
        description: "Failed to reschedule consultation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, userType]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
    rescheduleBooking
  };
};
