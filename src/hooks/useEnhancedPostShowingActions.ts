import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePostShowingWorkflow } from "./usePostShowingWorkflow";

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

interface MakeOfferParams {
  showingId: string;
  buyerId: string;
  agentId?: string;
  propertyAddress: string;
  agentName?: string;
  buyerQualification?: any;
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
  const { favoriteProperty: workflowFavoriteProperty } = usePostShowingWorkflow();

  const scheduleAnotherTour = async (buyerId: string, showingId?: string) => {
    setIsSubmitting(true);
    try {
      // Record the action - only if we have a showing ID
      if (showingId) {
        await supabase
          .from('post_showing_actions')
          .insert({
            showing_request_id: showingId,
            buyer_id: buyerId,
            action_type: 'schedule_another_tour',
            action_details: {
              timestamp: new Date().toISOString()
            }
          });
      }

      toast({
        title: "Interest Recorded",
        description: "We'll help you find more properties to tour!",
      });

      // In a real app, this would redirect to the property search or request form
      console.log('Scheduling another tour for buyer:', buyerId);
      
    } catch (error) {
      console.error('Error scheduling another tour:', error);
      toast({
        title: "Error",
        description: "Failed to record your interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hireAgent = async (params: HireAgentParams) => {
    setIsSubmitting(true);
    try {
      // Create agent referral record
      await supabase
        .from('agent_referrals')
        .insert({
          buyer_id: params.buyerId,
          agent_id: params.agentId,
          showing_request_id: params.showingId,
          referral_type: 'hire_agent',
          status: 'active'
        });

      // Create buyer-agent match
      await supabase
        .from('buyer_agent_matches')
        .insert({
          buyer_id: params.buyerId,
          agent_id: params.agentId,
          showing_request_id: params.showingId,
          match_source: 'post_showing'
        });

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: params.showingId,
          buyer_id: params.buyerId,
          action_type: 'hire_agent',
          action_details: {
            agent_id: params.agentId,
            agent_name: params.agentName,
            property_address: params.propertyAddress,
            timestamp: new Date().toISOString()
          }
        });

      toast({
        title: "Agent Connection Successful",
        description: `You're now connected with ${params.agentName}. They'll reach out to you soon!`,
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

  const makeOfferAgentAssisted = async (params: MakeOfferParams) => {
    setIsSubmitting(true);
    try {
      // Create offer intent record
      await supabase
        .from('offer_intents')
        .insert({
          buyer_id: params.buyerId,
          agent_id: params.agentId,
          showing_request_id: params.showingId,
          property_address: params.propertyAddress,
          offer_type: 'agent_assisted',
          buyer_qualification: params.buyerQualification,
          agent_preference: 'same_agent'
        });

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: params.showingId,
          buyer_id: params.buyerId,
          action_type: 'make_offer_agent_assisted',
          action_details: {
            agent_id: params.agentId,
            agent_name: params.agentName,
            property_address: params.propertyAddress,
            buyer_qualification: params.buyerQualification,
            timestamp: new Date().toISOString()
          }
        });

      toast({
        title: "Offer Intent Recorded",
        description: `${params.agentName} will help you prepare and submit your offer.`,
      });

    } catch (error) {
      console.error('Error recording agent-assisted offer:', error);
      toast({
        title: "Error",
        description: "Failed to record offer intent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const makeOfferFirstLook = async (params: MakeOfferParams) => {
    setIsSubmitting(true);
    try {
      // Create offer intent record
      await supabase
        .from('offer_intents')
        .insert({
          buyer_id: params.buyerId,
          agent_id: params.agentId,
          showing_request_id: params.showingId,
          property_address: params.propertyAddress,
          offer_type: 'firstlook_generator',
          buyer_qualification: params.buyerQualification
        });

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: params.showingId,
          buyer_id: params.buyerId,
          action_type: 'make_offer_firstlook',
          action_details: {
            property_address: params.propertyAddress,
            buyer_qualification: params.buyerQualification,
            timestamp: new Date().toISOString()
          }
        });

      toast({
        title: "Offer Generation Started",
        description: "We'll help you create a competitive offer using our AI-powered tools.",
      });

    } catch (error) {
      console.error('Error starting FirstLook offer:', error);
      toast({
        title: "Error",
        description: "Failed to start offer generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const favoriteProperty = async (params: FavoritePropertyParams, notes?: string) => {
    setIsSubmitting(true);
    try {
      // Use the workflow method to favorite the property
      await workflowFavoriteProperty(params.propertyAddress, params.showingId);

      // Also add to property_favorites table with notes
      await supabase
        .from('property_favorites')
        .insert({
          buyer_id: params.buyerId,
          showing_request_id: params.showingId,
          property_address: params.propertyAddress,
          notes: notes
        });

      // Record the action
      await supabase
        .from('post_showing_actions')
        .insert({
          showing_request_id: params.showingId,
          buyer_id: params.buyerId,
          action_type: 'favorite_property',
          action_details: {
            property_address: params.propertyAddress,
            notes: notes,
            timestamp: new Date().toISOString()
          }
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
    makeOfferAgentAssisted,
    makeOfferFirstLook,
    favoriteProperty
  };
};
