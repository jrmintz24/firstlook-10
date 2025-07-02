
import EmptyStateCard from "./EmptyStateCard";
import OptimizedShowingCard from "./OptimizedShowingCard";
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
  onSignAgreement?: (showing: ShowingRequest) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  agreements?: Record<string, boolean> | any[];
}

const ShowingListTab = ({
  title,
  showings,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  emptyButtonText,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onSendMessage,
  onReportIssue,
  onSignAgreement,
  showActions = true,
  userType,
  onComplete,
  currentUserId,
  agreements = {}
}: ShowingListTabProps) => {
  // Convert agreements to Record format if it's an array
  const agreementsRecord = Array.isArray(agreements) 
    ? agreements.reduce((acc: Record<string, boolean>, agreement: any) => {
        if (agreement.showing_request_id) {
          acc[agreement.showing_request_id] = agreement.signed || false;
        }
        return acc;
      }, {})
    : agreements;

  if (showings.length === 0) {
    return (
      <EmptyStateCard
        icon={EmptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={emptyButtonText ? onRequestShowing : undefined}
      />
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{showings.length} total</span>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {showings.map((showing) => (
          <OptimizedShowingCard
            key={showing.id}
            showing={showing}
            onCancel={onCancelShowing}
            onReschedule={onRescheduleShowing}
            onConfirm={onConfirmShowing}
            onSendMessage={onSendMessage}
            onReportIssue={onReportIssue}
            onSignAgreement={onSignAgreement}
            showActions={showActions}
            userType={userType || 'buyer'}
            onComplete={onComplete}
            currentUserId={currentUserId}
            agreements={agreementsRecord}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowingListTab;
