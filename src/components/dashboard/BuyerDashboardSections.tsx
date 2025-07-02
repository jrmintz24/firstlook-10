import { Calendar, CheckCircle, Clock, MessageSquare, MapPin, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyStateCard from "./EmptyStateCard";
import ConsultationsSection from "./ConsultationsSection";
import InlineMessagesPanel from "@/components/messaging/InlineMessagesPanel";
import ShowingListTab from "./ShowingListTab";
import FavoritesSection from "./FavoritesSection";

// Add this interface for consultations
interface Consultation {
  id: string;
  propertyAddress: string;
  scheduledAt: string;
  consultationType: 'phone' | 'video';
  agentName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Update the generateBuyerDashboardSections function parameters to include consultations
export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  consultations = [], // Add this parameter
  agreements,
  currentUser,
  profile,
  displayName,
  unreadCount,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onSignAgreement,
  fetchShowingRequests,
  onSendMessage,
  onJoinConsultation,
  onRescheduleConsultation
}: {
  pendingRequests: any[];
  activeShowings: any[];
  completedShowings: any[];
  consultations?: Consultation[];
  agreements: Record<string, boolean>;
  currentUser: any;
  profile: any;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (showing: any) => void;
  onConfirmShowing: (showing: any) => void;
  onSignAgreement: (showing: any) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showing: any) => void;
  onJoinConsultation?: (consultationId: string) => void;
  onRescheduleConsultation?: (consultationId: string) => void;
}) => {
  const pendingCount = pendingRequests.length;
  const confirmedCount = activeShowings.length;
  const historyCount = completedShowings.length;

  const sections = [
    {
      id: "requested",
      title: "Requested",
      icon: Clock,
      count: pendingCount,
      color: "bg-orange-100 text-orange-700",
      component: (
        <ShowingListTab
          title="Pending Requests"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No Pending Requests"
          emptyDescription="Start by requesting a property tour."
          emptyButtonText="Request a Tour"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSendMessage={onSendMessage}
          onSignAgreement={onSignAgreement}
          showActions={true}
          userType="buyer"
          currentUserId={currentUser?.id}
          agreements={agreements}
        />
      )
    },
    {
      id: "confirmed",
      title: "Confirmed",
      icon: Calendar,
      count: confirmedCount,
      color: "bg-blue-100 text-blue-700",
      component: (
        <ShowingListTab
          title="Confirmed Tours"
          showings={activeShowings}
          emptyIcon={Calendar}
          emptyTitle="No Confirmed Tours"
          emptyDescription="Check back once your request is confirmed."
          emptyButtonText=""
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSendMessage={onSendMessage}
          onSignAgreement={onSignAgreement}
          showActions={true}
          userType="buyer"
          currentUserId={currentUser?.id}
          agreements={agreements}
        />
      )
    },
    {
      id: "history",
      title: "History",
      icon: CheckCircle,
      count: historyCount,
      color: "bg-green-100 text-green-700",
      component: (
        <ShowingListTab
          title="Tour History"
          showings={completedShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No Past Tours"
          emptyDescription="Your completed and cancelled tours will appear here."
          emptyButtonText=""
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSendMessage={onSendMessage}
          onSignAgreement={onSignAgreement}
          showActions={true}
          userType="buyer"
          onComplete={fetchShowingRequests}
          currentUserId={currentUser?.id}
          agreements={agreements}
        />
      )
    },
    
    // Add favorites section
    {
      id: "favorites",
      title: "Favorites",
      icon: Heart,
      count: 0, // We'll update this when we have the favorites data
      color: "bg-pink-100 text-pink-700",
      component: (
        <FavoritesSection buyerId={currentUser?.id} />
      )
    },
    
    // Add consultations section after the existing sections
    {
      id: "consultations",
      title: "Consultations",
      icon: Calendar,
      count: consultations.filter(c => c.status === 'scheduled' && new Date(c.scheduledAt) >= new Date()).length,
      color: "bg-purple-100 text-purple-700",
      component: (
        <ConsultationsSection
          consultations={consultations}
          onJoinCall={onJoinConsultation}
          onReschedule={onRescheduleConsultation}
        />
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageSquare,
      count: unreadCount,
      color: "bg-red-100 text-red-700",
      component: <InlineMessagesPanel />
    },
    {
      id: "profile",
      title: "Profile",
      icon: MapPin,
      count: 0,
      color: "bg-indigo-100 text-indigo-700",
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p>Welcome, {displayName}!</p>
            {profile && (
              <>
                <p>Email: {currentUser?.email}</p>
                <p>Phone: {profile.phone}</p>
              </>
            )}
          </CardContent>
        </Card>
      )
    }
  ];

  return sections;
};
