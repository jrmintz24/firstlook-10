
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PostShowingActionsPanel from "./PostShowingActionsPanel";
import PostShowingWorkflowTrigger from "./PostShowingWorkflowTrigger";
import { usePostShowingActionsTracking } from "@/hooks/usePostShowingActionsTracking";

interface PostShowingCommunicationProps {
  showingId: string;
  userType: 'buyer' | 'agent';
  showingStatus: string;
  agentName?: string;
  propertyAddress: string;
  onActionTaken?: () => void;
}

const PostShowingCommunication = ({
  showingId,
  userType,
  showingStatus,
  agentName,
  propertyAddress,
  onActionTaken
}: PostShowingCommunicationProps) => {
  const [showingDetails, setShowingDetails] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { trackAction } = usePostShowingActionsTracking();

  // Get current user and showing details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Get showing details including agent info
        const { data: showing } = await supabase
          .from('showing_requests')
          .select('assigned_agent_id, assigned_agent_email, assigned_agent_phone, assigned_agent_name')
          .eq('id', showingId)
          .single();
        
        setShowingDetails(showing);
      } catch (error) {
        console.error('Error fetching showing details:', error);
      }
    };

    fetchDetails();
  }, [showingId]);

  // Only show for completed showings and buyers
  if (showingStatus !== 'completed' || userType !== 'buyer' || !currentUser || !showingDetails) {
    return (
      <>
        {/* Still trigger the workflow even if we don't show the panel */}
        <PostShowingWorkflowTrigger
          showingId={showingId}
          showingStatus={showingStatus}
        />
        {userType === 'agent' && showingStatus === 'completed' && (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600">
              Buyer actions will appear here. You'll be notified when they take any actions regarding this property.
            </p>
          </div>
        )}
      </>
    );
  }

  const handleActionCompleted = async (actionType: string) => {
    // Track the completed action
    await trackAction(showingId, currentUser.id, actionType, true);
    
    // Notify parent component
    if (onActionTaken) {
      onActionTaken();
    }
  };

  return (
    <>
      <PostShowingWorkflowTrigger
        showingId={showingId}
        showingStatus={showingStatus}
      />
      
      <div className="mt-6">
        <PostShowingActionsPanel
          showingId={showingId}
          buyerId={currentUser.id}
          agentId={showingDetails.assigned_agent_id}
          agentName={showingDetails.assigned_agent_name || agentName}
          agentEmail={showingDetails.assigned_agent_email}
          agentPhone={showingDetails.assigned_agent_phone}
          propertyAddress={propertyAddress}
          onActionCompleted={handleActionCompleted}
        />
      </div>
    </>
  );
};

export default PostShowingCommunication;
