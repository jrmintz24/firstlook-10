
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScheduleAnotherTourParams {
  showingId: string;
  buyerId: string;
}

interface HireAgentParams {
  showingId: string;
  buyerId: string;
  agentId: string;
  propertyAddress: string;
  agentName?: string;
}

interface FavoritePropertyParams {
  showingId: string;
  buyerId: string;
  propertyAddress: string;
  agentName?: string;
}

export const useEnhancedPostShowingActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const scheduleAnotherTour = async (buyerId?: string, showingId?: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Tour Scheduled",
        description: "We'll help you schedule another property tour.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule tour. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hireAgent = async ({ 
    showingId, 
    buyerId, 
    agentId, 
    propertyAddress, 
    agentName 
  }: {
    showingId: string;
    buyerId: string;
    agentId: string;
    propertyAddress: string;
    agentName: string;
  }) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would call the Supabase API
      const { data, error } = await supabase
        .from('buyer_agent_matches')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId,
          showing_request_id: showingId,
          match_source: 'post_showing'
        });

      if (error) throw error;

      // Create an agent referral record
      await supabase
        .from('agent_referrals')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId,
          showing_request_id: showingId,
          referral_type: 'hire_agent',
          status: 'active'
        });

      toast({
        title: "Agent Connected",
        description: `You're now working with ${agentName}. They'll be in touch soon!`,
      });
    } catch (error) {
      console.error('Error hiring agent:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect with agent. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const favoriteProperty = async (
    params: FavoritePropertyParams,
    notes?: string
  ) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: params.buyerId,
          showing_request_id: params.showingId,
          property_address: params.propertyAddress,
          notes: notes
        });

      if (error) throw error;

      toast({
        title: "Property Saved",
        description: `${params.propertyAddress} has been added to your favorites.`,
      });
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save property. Please try again.",
        variant: "destructive"
      });
      throw error;
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
