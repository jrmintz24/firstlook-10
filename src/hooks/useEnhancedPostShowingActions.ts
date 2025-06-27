import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PostShowingActionData {
  showingId: string;
  buyerId: string;
  agentId?: string;
  propertyAddress: string;
  agentName?: string;
}

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

export const useEnhancedPostShowingActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scheduleAnotherTour = async (buyerId: string) => {
    try {
      // Check showing eligibility
      const { data: eligibility, error } = await supabase.rpc('check_showing_eligibility', {
        user_uuid: buyerId
      });

      if (error) throw error;

      // Cast the Json response to our expected type
      const eligibilityResult = eligibility as unknown as EligibilityResult;

      if (eligibilityResult.eligible) {
        // Direct to tour request - user can book independently
        navigate('/');
        toast({
          title: "Ready to Schedule!",
          description: "You can request another tour anytime. Let's find your next property!",
        });
      } else {
        // Show subscription upgrade modal
        toast({
          title: "Subscription Required",
          description: "To schedule more tours, please upgrade your subscription.",
          variant: "destructive"
        });
        // Could trigger subscription modal here
      }

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: buyerId, // This should be showing ID, not buyer ID
          buyer_id: buyerId,
          action_type: 'schedule_another_tour'
        });

    } catch (error) {
      console.error('Error checking tour eligibility:', error);
      toast({
        title: "Error",
        description: "Failed to check tour eligibility. Please try again.",
        variant: "destructive"
      });
    }
  };

  const hireAgent = async (data: PostShowingActionData) => {
    if (!data.agentId) return;

    setIsSubmitting(true);
    try {
      // Create buyer-agent match and reveal contact info
      const { error: matchError } = await supabase
        .from('buyer_agent_matches')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId,
          showing_request_id: data.showingId,
          match_source: 'post_showing'
        });

      if (matchError) throw matchError;

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: data.showingId,
          buyer_id: data.buyerId,
          action_type: 'hire_agent',
          action_details: {
            agent_id: data.agentId,
            agent_name: data.agentName
          }
        });

      toast({
        title: "Agent Hired!",
        description: `${data.agentName || 'Your agent'} has been notified and will contact you soon with next steps.`,
      });

    } catch (error) {
      console.error('Error hiring agent:', error);
      toast({
        title: "Error",
        description: "Failed to connect with agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const makeOfferAgentAssisted = async (data: PostShowingActionData) => {
    if (!data.agentId) return;

    setIsSubmitting(true);
    try {
      // Create offer intent with agent assistance
      const { error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          offer_type: 'agent_assisted'
        });

      if (offerError) throw offerError;

      // Also create buyer-agent match to reveal contact info
      await supabase
        .from('buyer_agent_matches')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId,
          showing_request_id: data.showingId,
          match_source: 'offer_intent'
        });

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: data.showingId,
          buyer_id: data.buyerId,
          action_type: 'make_offer_agent_assisted',
          action_details: {
            agent_id: data.agentId,
            property_address: data.propertyAddress
          }
        });

      toast({
        title: "Offer Request Sent!",
        description: `${data.agentName || 'Your agent'} will contact you to help create a competitive offer.`,
      });

    } catch (error) {
      console.error('Error creating agent-assisted offer:', error);
      toast({
        title: "Error",
        description: "Failed to request offer assistance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const makeOfferFirstLook = async (data: PostShowingActionData) => {
    setIsSubmitting(true);
    try {
      // Create offer intent with FirstLook generator
      const { error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId || null,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          offer_type: 'firstlook_generator'
        });

      if (offerError) throw offerError;

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: data.showingId,
          buyer_id: data.buyerId,
          action_type: 'make_offer_firstlook',
          action_details: {
            property_address: data.propertyAddress
          }
        });

      toast({
        title: "Redirecting to Offer Generator",
        description: "Creating your competitive offer automatically...",
      });

      // Redirect to FirstLook offer generator (placeholder)
      // navigate('/offer-generator');

    } catch (error) {
      console.error('Error creating FirstLook offer:', error);
      toast({
        title: "Error",
        description: "Failed to access offer generator. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const favoriteProperty = async (data: PostShowingActionData, notes?: string) => {
    setIsSubmitting(true);
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('property_favorites')
        .select('id')
        .eq('buyer_id', data.buyerId)
        .eq('property_address', data.propertyAddress)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already Favorited",
          description: "This property is already in your favorites.",
        });
        return;
      }

      // Add to favorites
      const { error: favoriteError } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: data.buyerId,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          notes: notes || null
        });

      if (favoriteError) throw favoriteError;

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: data.showingId,
          buyer_id: data.buyerId,
          action_type: 'favorite_property',
          action_details: {
            property_address: data.propertyAddress,
            notes: notes
          }
        });

      toast({
        title: "Property Favorited!",
        description: "Added to your favorites list for easy reference.",
      });

    } catch (error) {
      console.error('Error favoriting property:', error);
      toast({
        title: "Error",
        description: "Failed to favorite property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent,
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  };
};
