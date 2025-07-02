import React from "react";
import { Clock, CheckCircle, History } from "lucide-react";
import WelcomeDashboard from "./WelcomeDashboard";
import QuickActions from "./QuickActions";
import ShowingListTab from "./ShowingListTab";
import ConsultationsSection from "./ConsultationsSection";
import MessagesTab from "./MessagesTab";
import ProfileTab from "./ProfileTab";

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

interface Consultation {
  id: string;
  propertyAddress: string;
  scheduledAt: string;
  consultationType: 'phone' | 'video';
  agentName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface GenerateBuyerDashboardSectionsProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
  consultations: Consultation[];
  agreements: Record<string, boolean>;
  currentUser: any;
  profile: any;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing: (showing: ShowingRequest) => void;
  onSignAgreement: (showing: ShowingRequest) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showingId: string) => void;
  onJoinConsultation: (consultationId: string) => void;
  onRescheduleConsultation: (consultationId: string) => void;
  onComplete?: () => void;
}

export const generateBuyerDashboardSections = ({
  pendingRequests,
  activeShowings,
  completedShowings,
  consultations,
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
  onRescheduleConsultation,
  onComplete
}: GenerateBuyerDashboardSectionsProps) => {
  return [
    {
      id: "dashboard",
      title: "Dashboard",
      content: (
        <div className="space-y-6">
          <WelcomeDashboard displayName={displayName} />
          <QuickActions onRequestShowing={onRequestShowing} />
        </div>
      )
    },
    {
      id: "requested",
      title: "Requested",
      content: (
        <ShowingListTab
          title="Requested Tours"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No pending requests"
          emptyDescription="Ready to find your dream home?"
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSignAgreement={onSignAgreement}  
          currentUserId={currentUser?.id}
          onSendMessage={onSendMessage}
          agreements={agreements}
          onComplete={onComplete}
        />
      )
    },
    {
      id: "confirmed",
      title: "Confirmed",
      content: (
        <ShowingListTab
          title="Confirmed Tours"
          showings={activeShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No confirmed tours"
          emptyDescription="Your confirmed tours will appear here"
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSignAgreement={onSignAgreement}
          currentUserId={currentUser?.id}
          onSendMessage={onSendMessage}
          agreements={agreements}
          onComplete={onComplete}
        />
      )
    },
    {
      id: "history",
      title: "History",
      content: (
        <ShowingListTab
          title="Tour History"
          showings={completedShowings}
          emptyIcon={History}
          emptyTitle="No completed tours yet"
          emptyDescription="Your tour history will appear here"
          emptyButtonText="Request Your First Tour"
          onRequestShowing={onRequestShowing}
          onCancelShowing={onCancelShowing}
          onRescheduleShowing={onRescheduleShowing}
          onConfirmShowing={onConfirmShowing}
          onSignAgreement={onSignAgreement}
          currentUserId={currentUser?.id}
          onSendMessage={onSendMessage}
          agreements={agreements}
          onComplete={onComplete}
        />
      )
    },
    {
      id: "consultations",
      title: "Consultations",
      content: (
        <ConsultationsSection
          consultations={consultations}
          onJoinConsultation={onJoinConsultation}
          onRescheduleConsultation={onRescheduleConsultation}
        />
      )
    },
    {
      id: "messages",
      title: "Messages",
      content: <MessagesTab unreadCount={unreadCount} />
    },
    {
      id: "profile",
      title: "Profile",
      content: <ProfileTab profile={profile} />
    }
  ];
};
