
import { AlertCircle, Calendar, Star, Clock, CheckCircle } from "lucide-react";
import ShowingListTab from "./ShowingListTab";
import ProfileTab from "./ProfileTab";

interface BuyerDashboardSectionsProps {
  pendingRequests: any[];
  activeShowings: any[];
  completedShowings: any[];
  agreements: any[];
  currentUser: any;
  profile: any;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing: (showing: any) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (requestId: string) => void;
}

export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  agreements,
  currentUser,
  profile,
  displayName,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  fetchShowingRequests,
  onSendMessage
}: BuyerDashboardSectionsProps) => {
  const agreementsArray = Object.entries(agreements).map(([showing_request_id, signed]) => ({
    id: showing_request_id,
    showing_request_id,
    signed
  }));

  return [
    {
      id: "requested",
      label: "Requested Tours",
      count: pendingRequests.length,
      content: (
        <ShowingListTab
          title="Requested Tours"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No pending requests"
          emptyDescription="Ready to find your dream home? Submit a showing request!"
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onComplete={fetchShowingRequests}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "confirmed",
      label: "Confirmed Tours",
      count: activeShowings.length,
      content: (
        <ShowingListTab
          title="Confirmed Tours"
          showings={activeShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No confirmed showings"
          emptyDescription="Once your requests are confirmed, they'll appear here."
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          agreements={agreementsArray}
          onComplete={fetchShowingRequests}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "history",
      label: "History",
      count: completedShowings.length,
      content: (
        <ShowingListTab
          title="Showing History"
          showings={completedShowings}
          emptyIcon={Star}
          emptyTitle="No completed showings yet"
          emptyDescription="Your showing history will appear here once you complete your first showing."
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          showActions={false}
          onComplete={fetchShowingRequests}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "profile",
      label: "Profile",
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
