
import { AlertCircle, Calendar, Star, MessageCircle } from "lucide-react";
import ShowingListTab from "./ShowingListTab";
import ProfileTab from "./ProfileTab";
import MessagingInterface from "@/components/messaging/MessagingInterface";

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
  unreadCount,
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
      id: "active",
      label: "Active Tours",
      count: pendingRequests.length + activeShowings.length,
      content: (
        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <ShowingListTab
              title="Pending Requests"
              showings={pendingRequests}
              emptyIcon={AlertCircle}
              emptyTitle="No pending requests"
              emptyDescription="Ready to find your dream home? Submit a showing request!"
              emptyButtonText="Request Your Free Showing"
              onRequestShowing={onRequestShowing}
              onCancelShowing={onCancelShowing}
              onRescheduleShowing={onRescheduleShowing}
              onComplete={fetchShowingRequests}
              currentUserId={currentUser?.id}
            />
          )}
          
          {activeShowings.length > 0 && (
            <ShowingListTab
              title="Confirmed Showings"
              showings={activeShowings}
              emptyIcon={Calendar}
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
          )}

          {pendingRequests.length === 0 && activeShowings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No active tours</h3>
              <p className="text-gray-500 mb-6">Ready to find your dream home?</p>
              <button 
                onClick={onRequestShowing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg"
              >
                Request Your Free Showing
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      id: "messages",
      label: "Messages",
      count: unreadCount,
      content: currentUser?.id ? (
        <MessagingInterface userId={currentUser.id} userType="buyer" />
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Sign in to view messages</h3>
          <p className="text-gray-500">Your conversations with agents will appear here</p>
        </div>
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
