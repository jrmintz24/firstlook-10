
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedPostShowingActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const scheduleAnotherTour = async (buyerId: string, showingId: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: showingId,
          buyer_id: buyerId,
          action_type: 'scheduled_more_tours',
          action_details: { timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      toast({
        title: "Interest Recorded",
        description: "We've noted your interest in scheduling another tour.",
      });
    } catch (error) {
      console.error('Error recording tour scheduling interest:', error);
      toast({
        title: "Error",
        description: "Failed to record your interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hireAgent = async (data: {
    showingId: string;
    buyerId: string;
    agentId: string;
    propertyAddress: string;
    agentName?: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Insert the agent referral record
      const { error: referralError } = await supabase
        .from('agent_referrals')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId,
          showing_request_id: data.showingId,
          referral_type: 'hire_agent',
          status: 'active'
        });

      if (referralError) throw referralError;

      // Update the showing request to set buyer consent
      const { error: showingError } = await supabase
        .from('showing_requests')
        .update({
          buyer_consents_to_contact: true
        })
        .eq('id', data.showingId);

      if (showingError) throw showingError;

      // Record the post-showing action
      const { error: actionError } = await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: data.showingId,
          buyer_id: data.buyerId,
          action_type: 'hired_agent',
          action_details: {
            agent_id: data.agentId,
            agent_name: data.agentName,
            property_address: data.propertyAddress,
            timestamp: new Date().toISOString()
          }
        });

      if (actionError) throw actionError;

      toast({
        title: "Agent Hired",
        description: `You've chosen to work with ${data.agentName}. They now have access to your contact information.`,
      });
    } catch (error) {
      console.error('Error hiring agent:', error);
      toast({
        title: "Error",
        description: "Failed to connect with agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const favoriteProperty = async (data: {
    showingId: string;
    buyerId: string;
    propertyAddress: string;
    agentName?: string;
  }, notes?: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: data.buyerId,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Property Favorited",
        description: "This property has been added to your favorites.",
      });
    } catch (error) {
      console.error('Error favoriting property:', error);
      toast({
        title: "Error",
        description: "Failed to favorite property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    favoriteProperty
  };
};
