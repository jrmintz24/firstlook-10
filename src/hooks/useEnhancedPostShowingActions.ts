
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAgentReferralSystem } from './useAgentReferralSystem';

interface HireAgentData {
  showingId: string;
  buyerId: string;
  agentId: string;
  propertyAddress: string;
  agentName?: string;
}

interface MakeOfferData {
  showingId: string;
  buyerId: string;
  agentId?: string;
  propertyAddress: string;
  agentName?: string;
  buyerQualification?: any;
}

interface FavoritePropertyData {
  showingId: string;
  buyerId: string;
  propertyAddress: string;
  agentName?: string;
}

export const useEnhancedPostShowingActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createAgentReferral, sendAgentNotification, updateBuyerQualification } = useAgentReferralSystem();

  const scheduleAnotherTour = async (buyerId: string) => {
    try {
      setIsSubmitting(true);

      // Check eligibility first
      const { data: eligibility } = await supabase.rpc('check_showing_eligibility', {
        user_uuid: buyerId
      });

      // Track the action
      await supabase.from('post_showing_actions').insert({
        showing_request_id: '',
        buyer_id: buyerId,
        action_type: 'schedule_another_tour',
        action_details: { eligibility }
      });

      if (eligibility?.eligible) {
        toast({
          title: "Ready for Another Tour!",
          description: "You can schedule another tour right away.",
        });
      } else if (eligibility?.reason === 'free_showing_used') {
        toast({
          title: "Subscribe to Continue",
          description: "Your free tour has been used. Subscribe to schedule unlimited tours.",
        });
      } else {
        toast({
          title: "Tour Scheduled",
          description: "Redirecting you to find your next property...",
        });
      }

      // Navigate to home page for new search
      navigate('/');
    } catch (error) {
      console.error('Error in scheduleAnotherTour:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hireAgent = async (data: HireAgentData) => {
    try {
      setIsSubmitting(true);

      // Create agent referral
      const referralResult = await createAgentReferral({
        buyerId: data.buyerId,
        agentId: data.agentId,
        showingRequestId: data.showingId,
        referralType: 'hire_agent'
      });

      if (!referralResult.success) {
        throw new Error('Failed to create agent referral');
      }

      // Send notification to agent
      await sendAgentNotification({
        agentId: data.agentId,
        buyerId: data.buyerId,
        showingRequestId: data.showingId,
        notificationType: 'hire_agent',
        message: `Buyer wants to work with you as their agent after touring ${data.propertyAddress}`,
        metadata: {
          propertyAddress: data.propertyAddress,
          action: 'hire_agent'
        }
      });

      // Track the action
      await supabase.from('post_showing_actions').insert({
        showing_request_id: data.showingId,
        buyer_id: data.buyerId,
        action_type: 'hire_agent',
        action_details: {
          agent_id: data.agentId,
          agent_name: data.agentName,
          property_address: data.propertyAddress
        }
      });

      toast({
        title: "Agent Connected!",
        description: `${data.agentName} will be in touch soon to discuss working together.`,
      });

    } catch (error) {
      console.error('Error in hireAgent:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect with agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const makeOfferAgentAssisted = async (data: MakeOfferData) => {
    try {
      setIsSubmitting(true);

      // Create offer intent with agent assistance
      const { error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId!,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          offer_type: 'agent_assisted',
          agent_preference: 'use_assigned_agent',
          buyer_qualification: data.buyerQualification
        });

      if (offerError) throw offerError;

      // Update buyer qualification if provided
      if (data.buyerQualification) {
        await updateBuyerQualification(data.buyerId, data.buyerQualification);
      }

      // Send notification to agent
      if (data.agentId) {
        await sendAgentNotification({
          agentId: data.agentId,
          buyerId: data.buyerId,
          showingRequestId: data.showingId,
          notificationType: 'offer_request',
          message: `Buyer wants to make an offer on ${data.propertyAddress} with your assistance`,
          metadata: {
            propertyAddress: data.propertyAddress,
            offerType: 'agent_assisted',
            buyerQualification: data.buyerQualification
          }
        });
      }

      // Track the action
      await supabase.from('post_showing_actions').insert({
        showing_request_id: data.showingId,
        buyer_id: data.buyerId,
        action_type: 'make_offer_agent_assisted',
        action_details: {
          agent_id: data.agentId,
          property_address: data.propertyAddress,
          buyer_qualification: data.buyerQualification
        }
      });

      toast({
        title: "Offer Request Sent!",
        description: `${data.agentName} will help you prepare and submit a competitive offer.`,
      });

    } catch (error) {
      console.error('Error in makeOfferAgentAssisted:', error);
      toast({
        title: "Offer Request Failed",
        description: "Unable to process offer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const makeOfferFirstLook = async (data: MakeOfferData) => {
    try {
      setIsSubmitting(true);

      // Create offer intent with FirstLook generator
      const { error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: data.buyerId,
          agent_id: data.agentId || '',
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          offer_type: 'firstlook_generator',
          buyer_qualification: data.buyerQualification
        });

      if (offerError) throw offerError;

      // Update buyer qualification if provided
      if (data.buyerQualification) {
        await updateBuyerQualification(data.buyerId, data.buyerQualification);
      }

      // Track the action
      await supabase.from('post_showing_actions').insert({
        showing_request_id: data.showingId,
        buyer_id: data.buyerId,
        action_type: 'make_offer_firstlook',
        action_details: {
          property_address: data.propertyAddress,
          buyer_qualification: data.buyerQualification
        }
      });

      toast({
        title: "Offer Generator Started!",
        description: "We'll help you create a competitive offer using our FirstLook tools.",
      });

    } catch (error) {
      console.error('Error in makeOfferFirstLook:', error);
      toast({
        title: "Offer Generator Failed",
        description: "Unable to start offer generator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const favoriteProperty = async (data: FavoritePropertyData, notes?: string) => {
    try {
      setIsSubmitting(true);

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

      // Track the action
      await supabase.from('post_showing_actions').insert({
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
        description: "Added to your favorites. We'll keep you updated on similar properties.",
      });

    } catch (error) {
      console.error('Error in favoriteProperty:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save property to favorites. Please try again.",
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
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  };
};
