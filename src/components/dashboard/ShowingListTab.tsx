
import EmptyStateCard from "./EmptyStateCard";
import ShowingRequestCard from "./ShowingRequestCard";
import AgentRequestCard from "./AgentRequestCard";
import { LucideIcon } from "lucide-react";

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
  onConfirmShowing?: (showing: ShowingRequest) => void;
  onReportIssue?: (showing: ShowingRequest) => void;
  onSendMessage?: (showingId: string) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
}

const ShowingListTab = ({
  title,
  showings,
  emptyIcon,
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
  currentUserId
}: ShowingListTabProps) => {
  if (showings.length === 0) {
    return (
      <EmptyStateCard
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={emptyButtonText ? onRequestShowing : undefined}
        icon={emptyIcon}
      />
    );
  }

  return (
    <div className="space-y-4">
      {showings.map((showing) => {
        // For agent dashboard, use AgentRequestCard for pending requests and ShowingRequestCard for assigned ones
        if (userType === 'agent' && showing.status === 'pending' && !showing.assigned_agent_id) {
          return (
            <AgentRequestCard
              key={showing.id}
              request={showing}
              onAssign={() => {
                // This will be handled by the confirmation modal
                if (onConfirmShowing) {
                  onConfirmShowing(showing);
                }
              }}
              onUpdateStatus={(status, estimatedDate) => {
                // Handle status updates if needed
                console.log('Status update:', status, estimatedDate);
              }}
              onSendMessage={() => {
                if (onSendMessage) {
                  onSendMessage(showing.id);
                }
              }}
              onConfirm={onConfirmShowing}
              onReportIssue={onReportIssue}
              showAssignButton={true}
              onComplete={onComplete}
              currentAgentId={currentUserId}
            />
          );
        }

        // For all other cases, use the regular ShowingRequestCard
        return (
          <ShowingRequestCard
            key={showing.id}
            showing={showing}
            onCancel={onCancelShowing}
            onReschedule={onRescheduleShowing}
            onConfirm={(id: string) => {
              const showingToConfirm = showings.find(s => s.id === id);
              if (showingToConfirm && onConfirmShowing) {
                onConfirmShowing(showingToConfirm);
              }
            }}
            currentUserId={currentUserId}
            onSendMessage={onSendMessage}
            showActions={showActions}
            userType={userType}
            onComplete={onComplete}
            onReportIssue={onReportIssue}
          />
        );
      })}
    </div>
  );
};

export default ShowingListTab;
