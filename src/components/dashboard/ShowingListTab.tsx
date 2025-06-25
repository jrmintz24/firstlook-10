
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShowingRequestCard from "./ShowingRequestCard";
import AgentRequestCard from "./AgentRequestCard";
import EmptyStateCard from "./EmptyStateCard";
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
  onConfirmShowing?: (request: ShowingRequest) => void;
  onReportIssue?: (request: ShowingRequest) => void;
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  onSendMessage?: (showingId: string) => void;
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
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  onSendMessage
}: ShowingListTabProps) => {
  if (showings.length === 0) {
    return (
      <EmptyStateCard
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={onRequestShowing}
        icon={emptyIcon}
      />
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200/60">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {showings.length} {showings.length === 1 ? 'showing' : 'showings'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showings.map((showing) => (
          userType === 'agent' ? (
            <AgentRequestCard
              key={showing.id}
              request={showing}
              onAssign={() => {}}
              onUpdateStatus={() => {}}
              onSendMessage={() => onSendMessage?.(showing.id)}
              onConfirm={onConfirmShowing}
              onReportIssue={onReportIssue}
              showAssignButton={showing.status === 'pending' && !showing.assigned_agent_id}
              onComplete={onComplete}
              currentAgentId={currentUserId}
            />
          ) : (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              onConfirm={onConfirmShowing}
              showActions={showActions}
              userType={userType}
              onComplete={onComplete}
              currentUserId={currentUserId}
              onSendMessage={onSendMessage}
            />
          )
        ))}
      </CardContent>
    </Card>
  );
};

export default ShowingListTab;
