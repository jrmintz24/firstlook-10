
import ShowingRequestCard from "./ShowingRequestCard";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import EmptyStateCard from "./EmptyStateCard";
import ProfileTab from "./ProfileTab";
import BuyerMessagingView from "../messaging/BuyerMessagingView";

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

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

interface BuyerDashboardSectionsProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
  agreements: Agreement[];
  currentUser: any;
  profile: Profile | null;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing: (showing: ShowingRequest) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showingId: string) => void;
}

export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  agreements,
  currentUser,
  profile,
  displayName,
  unreadCount,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  fetchShowingRequests,
  onSendMessage
}: BuyerDashboardSectionsProps) => {
  return [
    {
      id: "requested",
      title: "Requested Tours",
      icon: Calendar,
      count: pendingRequests.length,
      content: (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <EmptyStateCard
              title="No Pending Requests"
              description="You don't have any tour requests pending. Ready to explore some properties?"
              buttonText="Request a Tour"
              onButtonClick={onRequestShowing}
              icon={Calendar}
            />
          ) : (
            pendingRequests.map((showing) => (
              <ShowingRequestCard
                key={showing.id}
                showing={showing}
                onCancel={onCancelShowing}
                onReschedule={onRescheduleShowing}
                onConfirm={onConfirmShowing}
                currentUserId={currentUser?.id}
                onSendMessage={onSendMessage}
                onComplete={fetchShowingRequests}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: "confirmed",
      title: "Confirmed Tours",
      icon: CheckCircle,
      count: activeShowings.length,
      content: (
        <div className="space-y-4">
          {activeShowings.length === 0 ? (
            <EmptyStateCard
              title="No Confirmed Tours"
              description="Once your tour requests are confirmed, they'll appear here."
              buttonText="Request a Tour"
              onButtonClick={onRequestShowing}
              icon={CheckCircle}
            />
          ) : (
            activeShowings.map((showing) => (
              <ShowingRequestCard
                key={showing.id}
                showing={showing}
                onCancel={onCancelShowing}
                onReschedule={onRescheduleShowing}
                onConfirm={onConfirmShowing}
                currentUserId={currentUser?.id}
                onSendMessage={onSendMessage}
                onComplete={fetchShowingRequests}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageCircle,
      count: unreadCount,
      content: currentUser?.id ? (
        <BuyerMessagingView userId={currentUser.id} />
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Please log in to view messages</p>
          </CardContent>
        </Card>
      )
    },
    {
      id: "history",
      title: "Tour History",
      icon: Clock,
      count: completedShowings.length,
      content: (
        <div className="space-y-4">
          {completedShowings.length === 0 ? (
            <EmptyStateCard
              title="No Tour History"
              description="Your completed tours will appear here for your reference."
              buttonText="Request Your First Tour"
              onButtonClick={onRequestShowing}
              icon={Clock}
            />
          ) : (
            completedShowings.map((showing) => (
              <ShowingRequestCard
                key={showing.id}
                showing={showing}
                onCancel={onCancelShowing}
                onReschedule={onRescheduleShowing}
                showActions={false}
                currentUserId={currentUser?.id}
                onSendMessage={onSendMessage}
                onComplete={fetchShowingRequests}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: "profile",
      title: "Profile",
      icon: currentUser?.user_metadata?.avatar_url ? null : undefined,
      count: 0,
      content: (
        <ProfileTab
          profile={profile}
          userEmail={currentUser?.email}
          displayName={displayName}
        />
      )
    }
  ];
};
