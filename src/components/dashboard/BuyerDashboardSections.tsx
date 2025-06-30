import { Clock, CheckCircle, Calendar, MessageSquare, User, FileText, Home } from "lucide-react";
import React from "react";
import { ShowingRequest } from "@/types";

import ShowingList from "./ShowingList";
import ProfileCard from "./ProfileCard";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import EmptyStateCard from "./EmptyStateCard";
import OfferManagementDashboard from '@/components/offer-management/OfferManagementDashboard';

interface BuyerDashboardSectionsProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
  agreements: { [showing_request_id: string]: boolean };
  currentUser: any;
  profile: any;
  displayName: string;
  unreadCount: number;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing: (showing: ShowingRequest) => void;
  fetchShowingRequests: () => void;
  onSendMessage: (showing: ShowingRequest) => void;
  onSignAgreement: (showing: ShowingRequest) => void;
}

interface DashboardSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  count?: number;
  content: React.ReactNode;
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
  onSendMessage,
  onSignAgreement
}: BuyerDashboardSectionsProps): DashboardSection[] => {
  const overviewSection: DashboardSection = {
    id: "overview",
    title: "Overview",
    icon: Home,
    content: (
      <div>
        <h2>Welcome to your dashboard!</h2>
        {/* Add overview content here */}
      </div>
    )
  };

  const requestedSection: DashboardSection = {
    id: "requested",
    title: "Requested",
    icon: Clock,
    count: pendingRequests.length,
    content: (
      <ShowingList
        title="Pending Tour Requests"
        showings={pendingRequests}
        emptyState={
          <EmptyStateCard
            icon={Clock}
            title="No Pending Tours"
            description="You don't have any pending tour requests."
            buttonText="Request a Tour"
            onClick={onRequestShowing}
          />
        }
        onCancelShowing={onCancelShowing}
        onRescheduleShowing={onRescheduleShowing}
        onConfirmShowing={onConfirmShowing}
        fetchShowingRequests={fetchShowingRequests}
        onSendMessage={onSendMessage}
        agreements={agreements}
        onSignAgreement={onSignAgreement}
      />
    )
  };

  const confirmedSection: DashboardSection = {
    id: "confirmed",
    title: "Confirmed",
    icon: Calendar,
    count: activeShowings.length,
    content: (
      <ShowingList
        title="Upcoming Tours"
        showings={activeShowings}
        emptyState={
          <EmptyStateCard
            icon={Calendar}
            title="No Upcoming Tours"
            description="You don't have any upcoming tours scheduled."
            buttonText="Request a Tour"
            onClick={onRequestShowing}
          />
        }
        onCancelShowing={onCancelShowing}
        onRescheduleShowing={onRescheduleShowing}
        onConfirmShowing={onConfirmShowing}
        fetchShowingRequests={fetchShowingRequests}
        onSendMessage={onSendMessage}
        agreements={agreements}
        onSignAgreement={onSignAgreement}
      />
    )
  };

  const messagesSection: DashboardSection = {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    count: unreadCount,
    content: <MessagingInterface userId={currentUser?.id} userType="buyer" />
  };

  const historySection: DashboardSection = {
    id: "history",
    title: "History",
    icon: CheckCircle,
    count: completedShowings.length,
    content: (
      <ShowingList
        title="Tour History"
        showings={completedShowings}
        emptyState={
          <EmptyStateCard
            icon={CheckCircle}
            title="No Tour History"
            description="You haven't completed any tours yet."
            buttonText="Request a Tour"
            onClick={onRequestShowing}
          />
        }
        showActions={false}
        onSendMessage={onSendMessage}
        agreements={agreements}
        onSignAgreement={onSignAgreement}
      />
    )
  };

  const profileSection: DashboardSection = {
    id: "profile",
    title: "Profile",
    icon: User,
    content: <ProfileCard profile={profile} displayName={displayName} />
  };

  // Add the offers section
  const offersSection: DashboardSection = {
    id: "offers",
    title: "My Offers",
    icon: FileText,
    count: 0, // Will be updated when data is loaded
    content: (
      <OfferManagementDashboard 
        buyerId={currentUser?.id || ''} 
        onCreateOffer={onRequestShowing}
      />
    )
  };

  return [
    overviewSection,
    requestedSection,
    confirmedSection,
    offersSection, // Add offers section here
    messagesSection,
    historySection,
    profileSection
  ];
};
