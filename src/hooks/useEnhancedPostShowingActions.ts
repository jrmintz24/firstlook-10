
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
    showingId: string | null;
    buyerId: string;
    propertyAddress: string;
    agentName?: string;
    mls_id?: string;
  }, notes?: string) => {
    setIsSubmitting(true);
    try {
      console.log('[useEnhancedPostShowingActions] Attempting to favorite property:', {
        buyer_id: data.buyerId,
        showing_request_id: data.showingId,
        property_address: data.propertyAddress,
        mls_id: data.mls_id,
        notes: notes
      });

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[useEnhancedPostShowingActions] Current session:', session?.user?.id);
      
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Try to get IDX property data if mls_id is provided
      let idx_property_id = null;
      let mls_id = data.mls_id;
      
      if (mls_id) {
        const { data: savedProperty } = await supabase
          .from('idx_properties')
          .select('id')
          .eq('mls_id', mls_id)
          .single();
        
        idx_property_id = savedProperty?.id || null;
      }

      // If no mls_id provided, try to extract from current page data
      if (!mls_id && typeof window !== 'undefined' && window.ihfPropertyData) {
        const propertyData = window.ihfPropertyData as any;
        if (propertyData.mlsId) {
          const { data: savedProperty } = await supabase
            .from('idx_properties')
            .select('id')
            .eq('mls_id', propertyData.mlsId)
            .single();
          
          idx_property_id = savedProperty?.id || null;
          mls_id = propertyData.mlsId;
        }
      }

      const { error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: data.buyerId,
          showing_request_id: data.showingId,
          property_address: data.propertyAddress,
          mls_id: mls_id || null,
          idx_property_id,
          notes: notes || null
        });

      if (error) {
        console.error('[useEnhancedPostShowingActions] Database error:', error);
        throw error;
      }

      toast({
        title: "Property Favorited",
        description: "This property has been added to your favorites.",
      });
    } catch (error: any) {
      console.error('[useEnhancedPostShowingActions] Error favoriting property:', error);
      
      let errorMessage = "Failed to favorite property. Please try again.";
      
      if (error.message === 'User not authenticated') {
        errorMessage = "Please log in to favorite properties.";
      } else if (error.code === 'PGRST301') {
        errorMessage = "Authentication required. Please log in and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error; // Re-throw so calling component can handle it
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
