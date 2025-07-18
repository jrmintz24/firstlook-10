
import React from "react";
import { LucideIcon } from "lucide-react";
import AgentRequestCard from "./AgentRequestCard";
import ShowingRequestCard from "./ShowingRequestCard";
import OptimizedShowingCard from "./OptimizedShowingCard";
import EmptyStateCard from "./EmptyStateCard";
import { useShowingRequestPropertyDetails } from "@/hooks/useShowingRequestPropertyDetails";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
  buyer_consents_to_contact?: boolean | null;
  idx_property_id?: string | null;
}

interface ShowingListTabProps {
  title: string;
  showings: ShowingRequest[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonText: string;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing?: (request: ShowingRequest) => void;
  onReportIssue?: (request: ShowingRequest) => void;
  onSendMessage?: (id: string) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  agreements?: Record<string, boolean>;
  onSignAgreement?: (showing: ShowingRequest) => void;
  buyerActions?: Record<string, {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    askedQuestions?: number;
    propertyRating?: number;
    agentRating?: number;
    latestAction?: string;
    actionTimestamp?: string;
  }>;
  eligibility?: any;
  onUpgradeClick?: () => void;
}

const ShowingListTab: React.FC<ShowingListTabProps> = ({
  title,
  showings,
  emptyIcon: Icon,
  emptyTitle,
  emptyDescription,
  emptyButtonText,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onReportIssue,
  onSendMessage,
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  agreements = {},
  onSignAgreement,
  buyerActions = {},
  eligibility,
  onUpgradeClick
}) => {
  // Fetch property details for the showings
  const { showingsWithDetails, loading: detailsLoading } = useShowingRequestPropertyDetails(showings);

  // Use showings with details if available, otherwise fall back to original showings
  const enhancedShowings = showingsWithDetails.length > 0 ? showingsWithDetails : showings;

  if (enhancedShowings.length === 0) {
    return (
      <EmptyStateCard
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={onRequestShowing}
        icon={Icon}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {enhancedShowings.map((showing) => {
          if (userType === 'agent') {
            return (
              <AgentRequestCard
                key={showing.id}
                request={showing}
                onAssign={() => {}}
                onUpdateStatus={(status, estimatedDate) => {}}
                onSendMessage={() => onSendMessage?.(showing.id)}
                onConfirm={onConfirmShowing}
                onReportIssue={onReportIssue}
                onReschedule={onRescheduleShowing}
                showAssignButton={!showing.assigned_agent_id}
                onComplete={onComplete}
                currentAgentId={currentUserId}
                buyerActions={buyerActions[showing.id]}
              />
            );
          }

          return (
            <OptimizedShowingCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              onConfirm={onConfirmShowing ? () => onConfirmShowing(showing) : undefined}
              onComplete={onComplete}
              currentUserId={currentUserId}
              agreements={agreements}
              userType={userType}
              showActions={showActions}
              onSignAgreement={onSignAgreement}
              onRequestShowing={onRequestShowing}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ShowingListTab;
