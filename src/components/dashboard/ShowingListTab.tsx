
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import EmptyStateCard from "./EmptyStateCard";
import ShowingRequestCard from "./ShowingRequestCard";

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
  user_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
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
  agreements?: Record<string, boolean>;
  showActions?: boolean;
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
  agreements = {},
  showActions = true
}: ShowingListTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Button 
          onClick={onRequestShowing}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {title.includes('Pending') ? 'Submit New Request' : 'Schedule Another Showing'}
        </Button>
      </div>

      {showings.length === 0 ? (
        <EmptyStateCard
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          buttonText={emptyButtonText}
          onButtonClick={onRequestShowing}
        />
      ) : (
        <div className="grid gap-6">
          {showings.map((showing) => (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              onConfirm={onConfirmShowing && !agreements[showing.id] ? () => onConfirmShowing(showing) : undefined}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowingListTab;
