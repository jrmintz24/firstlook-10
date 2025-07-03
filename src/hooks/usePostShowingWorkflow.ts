
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AttendanceData {
  user_type: 'buyer' | 'agent';
  attended?: boolean;
  checked_out?: boolean;
}

export interface BuyerFeedback {
  buyer_id: string;
  agent_id: string;
  property_rating?: number;
  agent_rating?: number;
  property_comments?: string;
  agent_comments?: string;
}

export interface AgentFeedback {
  agent_id: string;
  buyer_id: string;
  buyer_interest_level?: number;
  buyer_seriousness_rating?: number;
  notes?: string;
  recommend_buyer?: boolean;
}

export interface PostShowingAction {
  buyer_id: string;
  action_type: 'schedule_same_agent' | 'schedule_different_agent' | 'work_with_agent' | 
              'request_offer_assistance' | 'favorite_property' | 'request_disclosures' | 
              'ask_question' | 'no_action';
  action_details?: any;
}

export const usePostShowingWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const triggerWorkflow = async (showing_request_id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('post-showing-workflow', {
        body: {
          action: 'trigger_workflow',
          showing_request_id
        }
      });

      if (error) throw error;

      toast({
        title: "Workflow Triggered",
        description: "Post-showing workflow has been initiated."
      });

      return data;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      toast({
        title: "Error",
        description: "Failed to trigger post-showing workflow.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkAttendance = async (showing_request_id: string, attendanceData: AttendanceData) => {
    setLoading(true);
    try {
      // First update the attendance record
      const { data, error } = await supabase.functions.invoke('post-showing-workflow', {
        body: {
          action: 'check_attendance',
          showing_request_id,
          ...attendanceData
        }
      });

      if (error) throw error;

      // If buyer checked out and attended, update the showing status to completed
      if (attendanceData.user_type === 'buyer' && attendanceData.checked_out && attendanceData.attended) {
        const { error: statusError } = await supabase
          .from('showing_requests')
          .update({ 
            status: 'completed',
            status_updated_at: new Date().toISOString()
          })
          .eq('id', showing_request_id);

        if (statusError) {
          console.error('Error updating showing status:', statusError);
        } else {
          console.log('Successfully updated showing status to completed');
        }
      }

      toast({
        title: "Attendance Updated",
        description: "Your attendance has been recorded."
      });

      return data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitBuyerFeedback = async (showing_request_id: string, feedback: BuyerFeedback) => {
    setLoading(true);
    try {
      console.log('Submitting buyer feedback directly to database:', feedback);

      // Insert feedback directly into the buyer_feedback table
      const { data, error } = await supabase
        .from('buyer_feedback')
        .insert({
          showing_request_id,
          buyer_id: feedback.buyer_id,
          agent_id: feedback.agent_id,
          property_rating: feedback.property_rating,
          agent_rating: feedback.agent_rating,
          property_comments: feedback.property_comments,
          agent_comments: feedback.agent_comments
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Feedback submitted successfully:', data);

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!"
      });

      return data;
    } catch (error) {
      console.error('Error submitting buyer feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitAgentFeedback = async (showing_request_id: string, feedback: AgentFeedback) => {
    setLoading(true);
    try {
      // Insert feedback directly into the agent_feedback table
      const { data, error } = await supabase
        .from('agent_feedback')
        .insert({
          showing_request_id,
          agent_id: feedback.agent_id,
          buyer_id: feedback.buyer_id,
          buyer_interest_level: feedback.buyer_interest_level,
          buyer_seriousness_rating: feedback.buyer_seriousness_rating,
          notes: feedback.notes,
          recommend_buyer: feedback.recommend_buyer
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been recorded."
      });

      return data;
    } catch (error) {
      console.error('Error submitting agent feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recordAction = async (showing_request_id: string, action: PostShowingAction) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('post-showing-workflow', {
        body: {
          action: 'record_action',
          showing_request_id,
          ...action
        }
      });

      if (error) throw error;

      toast({
        title: "Action Recorded",
        description: "Your choice has been saved."
      });

      return data;
    } catch (error) {
      console.error('Error recording action:', error);
      toast({
        title: "Error",
        description: "Failed to record action.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add debouncing and duplicate prevention for scheduleWorkflowTriggers
  const scheduledRequests = new Set<string>();

  const scheduleWorkflowTriggers = async (showing_request_id: string, scheduled_end_time: string) => {
    // Prevent duplicate scheduling
    const requestKey = `${showing_request_id}-${scheduled_end_time}`;
    if (scheduledRequests.has(requestKey)) {
      console.log('Workflow triggers already scheduled for:', showing_request_id);
      return;
    }

    scheduledRequests.add(requestKey);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('post-showing-workflow', {
        body: {
          action: 'schedule_workflow_triggers',
          showing_request_id,
          scheduled_end_time
        }
      });

      if (error) throw error;

      console.log('Successfully scheduled workflow triggers for:', showing_request_id);
      return data;
    } catch (error) {
      console.error('Error scheduling workflow triggers:', error);
      // Remove from scheduled set on error so it can be retried
      scheduledRequests.delete(requestKey);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const favoriteProperty = async (property_address: string, showing_request_id?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          buyer_id: (await supabase.auth.getUser()).data.user?.id,
          property_address,
          showing_request_id
        });

      if (error) throw error;

      toast({
        title: "Property Favorited",
        description: "Property has been added to your favorites."
      });
    } catch (error) {
      console.error('Error favoriting property:', error);
      toast({
        title: "Error",
        description: "Failed to favorite property.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const askFollowUpQuestion = async (showing_request_id: string, question: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('follow_up_questions')
        .insert({
          showing_request_id,
          buyer_id: (await supabase.auth.getUser()).data.user?.id,
          question
        });

      if (error) throw error;

      toast({
        title: "Question Submitted",
        description: "Your question has been sent to the agent."
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    triggerWorkflow,
    checkAttendance,
    submitBuyerFeedback,
    submitAgentFeedback,
    recordAction,
    scheduleWorkflowTriggers,
    favoriteProperty,
    askFollowUpQuestion
  };
};
