
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Heart, User, FileText, CheckCircle, Clock } from "lucide-react";
import PostShowingActionsPanel from "@/components/post-showing/PostShowingActionsPanel";
import PostShowingWorkflowTrigger from "@/components/post-showing/PostShowingWorkflowTrigger";
import { usePostShowingActionsTracking } from "@/hooks/usePostShowingActionsTracking";

interface PostShowingActionsProps {
  showingId: string;
  userType: 'buyer' | 'agent';
  showingStatus: string;
  agentName?: string;
  agentId?: string;
  agentEmail?: string;
  agentPhone?: string;
  propertyAddress: string;
  buyerId: string;
  onActionTaken?: () => void;
}

const PostShowingActions = ({
  showingId,
  userType,
  showingStatus,
  agentName,
  agentId,
  agentEmail,
  agentPhone,
  propertyAddress,
  buyerId,
  onActionTaken
}: PostShowingActionsProps) => {
  const { getCompletedActions, hasCompletedAction } = usePostShowingActionsTracking();
  const completedActions = getCompletedActions(showingId);

  // Only show for completed showings
  if (showingStatus !== 'completed') {
    return (
      <PostShowingWorkflowTrigger
        showingId={showingId}
        showingStatus={showingStatus}
      />
    );
  }

  // Show different content based on user type
  if (userType === 'agent') {
    return (
      <div className="mt-4">
        <PostShowingWorkflowTrigger
          showingId={showingId}
          showingStatus={showingStatus}
        />
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Buyer Actions</span>
            </div>
            <p className="text-sm text-gray-600">
              {completedActions.length > 0 
                ? `Buyer has completed ${completedActions.length} action${completedActions.length > 1 ? 's' : ''}`
                : 'Waiting for buyer to take action on this property'
              }
            </p>
            {completedActions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {completedActions.map((action) => (
                  <Badge key={action} variant="secondary" className="text-xs">
                    {action.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buyer view
  return (
    <div className="mt-4">
      <PostShowingWorkflowTrigger
        showingId={showingId}
        showingStatus={showingStatus}
      />
      
      <PostShowingActionsPanel
        showingId={showingId}
        buyerId={buyerId}
        agentId={agentId}
        agentName={agentName}
        agentEmail={agentEmail}
        agentPhone={agentPhone}
        propertyAddress={propertyAddress}
        onActionCompleted={onActionTaken}
      />
    </div>
  );
};

export default PostShowingActions;
