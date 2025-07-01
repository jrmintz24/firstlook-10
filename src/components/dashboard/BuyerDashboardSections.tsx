
import { Clock, CheckCircle, Calendar, MessageSquare, User, FileText, Home } from "lucide-react";
import React from "react";

import EmptyStateCard from "./EmptyStateCard";
import ShowingListTab from "./ShowingListTab";
import OfferManagementDashboard from '@/components/offer-management/OfferManagementDashboard';
import PostShowingActionsPanel from '@/components/post-showing/PostShowingActionsPanel';

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

interface BuyerDashboardSectionsProps {
  pendingRequests: ShowingRequest[];
  activeShowings: ShowingRequest[];
  completedShowings: ShowingRequest[];
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
  onSendMessage: (showing: ShowingRequest) => void;
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
  onSignAgreement,
  fetchShowingRequests,
  onSendMessage
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
      <ShowingListTab
        title="Pending Tour Requests"
        showings={pendingRequests}
        emptyIcon={Clock}
        emptyTitle="No Pending Tours"
        emptyDescription="You don't have any pending tour requests."
        emptyButtonText="Request a Tour"
        onRequestShowing={onRequestShowing}
        onCancelShowing={onCancelShowing}
        onRescheduleShowing={onRescheduleShowing}
        onConfirmShowing={onConfirmShowing}
        onSignAgreement={onSignAgreement}
        onSendMessage={(showingId) => {
          const showing = pendingRequests.find(s => s.id === showingId);
          if (showing) onSendMessage(showing);
        }}
        userType="buyer"
        currentUserId={currentUser?.id || ''}
        agreements={agreements}
      />
    )
  };

  const confirmedSection: DashboardSection = {
    id: "confirmed",
    title: "Confirmed",
    icon: Calendar,
    count: activeShowings.length,
    content: (
      <ShowingListTab
        title="Upcoming Tours"
        showings={activeShowings}
        emptyIcon={Calendar}
        emptyTitle="No Upcoming Tours"
        emptyDescription="You don't have any upcoming tours scheduled."
        emptyButtonText="Request a Tour"
        onRequestShowing={onRequestShowing}
        onCancelShowing={onCancelShowing}
        onRescheduleShowing={onRescheduleShowing}
        onConfirmShowing={onConfirmShowing}
        onSignAgreement={onSignAgreement}
        onSendMessage={(showingId) => {
          const showing = activeShowings.find(s => s.id === showingId);
          if (showing) onSendMessage(showing);
        }}
        userType="buyer"
        currentUserId={currentUser?.id || ''}
        agreements={agreements}
      />
    )
  };

  const messagesSection: DashboardSection = {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    count: unreadCount,
    content: <div className="p-4">Messages content coming soon...</div>
  };

  const historySection: DashboardSection = {
    id: "history",
    title: "History",
    icon: CheckCircle,
    count: completedShowings.length,
    content: (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tour History</h2>
        {completedShowings.length === 0 ? (
          <EmptyStateCard
            icon={CheckCircle}
            title="No Tour History"
            description="You haven't completed any tours yet."
            buttonText="Request a Tour"
            onButtonClick={onRequestShowing}
          />
        ) : (
          <div className="space-y-6">
            {completedShowings.map((showing) => (
              <div key={showing.id} className="border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-medium">{showing.property_address}</h3>
                  <p className="text-sm text-gray-600">
                    Completed: {showing.status_updated_at ? new Date(showing.status_updated_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div className="p-4">
                  <PostShowingActionsPanel
                    showingId={showing.id}
                    buyerId={currentUser?.id || ''}
                    agentId={showing.assigned_agent_email || ''}
                    agentName={showing.assigned_agent_name}
                    agentEmail={showing.assigned_agent_email}
                    agentPhone={showing.assigned_agent_phone}
                    propertyAddress={showing.property_address}
                    onActionCompleted={() => {
                      // Refresh data when actions are completed
                      fetchShowingRequests();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  };

  const profileSection: DashboardSection = {
    id: "profile",
    title: "Profile",
    icon: User,
    content: (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p>Welcome, {displayName}!</p>
      </div>
    )
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
    offersSection,
    messagesSection,
    historySection,
    profileSection
  ];
};
