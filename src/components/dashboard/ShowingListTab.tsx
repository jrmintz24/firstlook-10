
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
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
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface Agreement {
  id: string;
  showing_request_id: string;
  signed: boolean;
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
  agreements?: Agreement[];
  showActions?: boolean;
  userType?: 'buyer' | 'agent';
  onComplete?: () => void;
  currentUserId?: string;
  onSendMessage?: (showingId: string) => void;
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
  agreements = [],
  showActions = true,
  userType = 'buyer',
  onComplete,
  currentUserId,
  onSendMessage
}: ShowingListTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{showings.length} showing{showings.length !== 1 ? 's' : ''}</p>
      </div>

      {showings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <EmptyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{emptyTitle}</h3>
            <p className="text-gray-500 mb-6">{emptyDescription}</p>
            <Button 
              onClick={onRequestShowing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {emptyButtonText}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {showings.map((showing) => (
            <ShowingRequestCard
              key={showing.id}
              showing={showing}
              onCancel={onCancelShowing}
              onReschedule={onRescheduleShowing}
              onConfirm={onConfirmShowing ? (id: string) => {
                const foundShowing = showings.find(s => s.id === id);
                if (foundShowing) {
                  onConfirmShowing(foundShowing);
                }
              } : undefined}
              agreements={agreements}
              showActions={showActions}
              userType={userType}
              onComplete={onComplete}
              currentUserId={currentUserId}
              onSendMessage={onSendMessage ? () => onSendMessage(showing.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowingListTab;
