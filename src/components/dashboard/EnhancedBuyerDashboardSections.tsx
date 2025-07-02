
import React from "react";
import { 
  Home, 
  Clock, 
  CheckCircle, 
  History, 
  Heart, 
  MessageCircle, 
  User, 
  Calendar,
  FileText
} from "lucide-react";
import WelcomeDashboard from "./WelcomeDashboard";
import QuickActions from "./QuickActions";
import ShowingListTab from "./ShowingListTab";
import ConsultationsSection from "./ConsultationsSection";
import FavoritesSection from "./FavoritesSection";
import { default as MessagesTab } from "../messaging/MessagesTab";
import ProfileTab from "./ProfileTab";

// Same interfaces as the original
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

interface EnhancedBuyerDashboardSectionsProps {
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

export const generateEnhancedBuyerDashboardSections = ({
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
}: EnhancedBuyerDashboardSectionsProps) => {
  return [
    {
      id: "overview",
      title: "Overview",
      icon: Home,
      content: (
        <div className="space-y-6">
          <WelcomeDashboard displayName={displayName} userType="buyer" />
          <QuickActions 
            onRequestShowing={onRequestShowing} 
            onMakeOffer={() => console.log("Make offer clicked")}
          />
        </div>
      )
    },
    {
      id: "tours",
      title: "Tours",
      icon: Calendar,
      subsections: [
        {
          id: "requested",
          title: "Requested",
          count: pendingRequests.length,
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
          count: activeShowings.length,
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
          count: completedShowings.length,
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
        }
      ]
    },
    {
      id: "services",
      title: "Services",
      icon: FileText,
      subsections: [
        {
          id: "favorites",
          title: "Favorites",
          content: (
            <FavoritesSection buyerId={currentUser?.id} />
          )
        },
        {
          id: "consultations",
          title: "Consultations",
          content: (
            <ConsultationsSection
              consultations={consultations}
              onJoinCall={onJoinConsultation}
              onReschedule={onRescheduleConsultation}
            />
          )
        }
      ]
    },
    {
      id: "account",
      title: "Account",
      icon: User,
      subsections: [
        {
          id: "messages",
          title: "Messages",
          count: unreadCount,
          content: (
            <MessagesTab userId={currentUser?.id || ''} userType="buyer" />
          )
        },
        {
          id: "profile",
          title: "Profile",
          content: (
            <ProfileTab 
              profile={profile}
              userEmail={currentUser?.email || ''}
              displayName={displayName}
            />
          )
        }
      ]
    }
  ];
};
