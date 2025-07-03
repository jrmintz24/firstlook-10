import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MessageSquare, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessages } from "@/hooks/useMessages";
import { useUnifiedDashboardData } from "@/hooks/useUnifiedDashboardData";

// Unified components
import UnifiedDashboardLayout from "@/components/dashboard/shared/UnifiedDashboardLayout";
import UpcomingSection from "@/components/dashboard/shared/UpcomingSection";
import UnifiedConnectionStatus from "@/components/dashboard/UnifiedConnectionStatus";

// Existing components
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import BuyerPostShowingHub from "@/components/dashboard/BuyerPostShowingHub";
import PropertyRequestWizard from "@/components/PropertyRequestWizard";

const BuyerDashboard = () => {
  const {
    profile,
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements,
    loading,
    authLoading,
    currentUser,
    connectionStatus,
    refresh,
  } = useUnifiedDashboardData('buyer');

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { unreadCount } = useMessages(currentUser?.id || null);

  const [selectedShowing, setSelectedShowing] = useState<any>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  console.log('BuyerDashboard - Current user:', currentUser?.id);
  console.log('BuyerDashboard - Loading states:', { loading, authLoading });

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handlePropertyRequestSuccess = async () => {
    setShowPropertyForm(false);
    await refresh(); // Refresh dashboard data after successful submission
  };

  const handleMakeOffer = () => {
    navigate('/offer-questionnaire');
  };

  const handleConfirmShowing = (showing: any) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  };

  const handleReportIssue = (showing: any) => {
    setSelectedShowing(showing);
    setShowReportIssueModal(true);
  };

  const handleAgreementSign = async (name: string) => {
    // Handle agreement signing logic here
    setShowAgreementModal(false);
    setSelectedShowing(null);
    refresh(); // Use the unified refresh function
  };

  const handleStatClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg mb-4">Unable to load profile</div>
          <button
            onClick={refresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile.first_name || 'there';

  const dashboardTabs = [
    {
      id: "pending",
      title: "Pending",
      icon: Clock,
      count: pendingRequests.length,
      color: "bg-orange-100 text-orange-700",
      content: (
        <ShowingListTab
          title="Pending Tours"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No Pending Tours"
          emptyDescription="Ready to find your dream home? Let's schedule a tour!"
          emptyButtonText="Request Tour"
          onRequestShowing={handleRequestShowing}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          onConfirmShowing={handleConfirmShowing}
          onReportIssue={handleReportIssue}
          userType="buyer"
          agreements={agreements}
          onComplete={refresh}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "active",
      title: "Active",
      icon: Calendar,
      count: activeShowings.length,
      color: "bg-blue-100 text-blue-700",
      content: (
        <ShowingListTab
          title="Active Tours"
          showings={activeShowings}
          emptyIcon={Calendar}
          emptyTitle="No Active Tours"
          emptyDescription="Confirmed tours will appear here."
          emptyButtonText="Request Tour"
          onRequestShowing={handleRequestShowing}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          onReportIssue={handleReportIssue}
          userType="buyer"
          agreements={agreements}
          onComplete={refresh}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageSquare,
      count: unreadCount,
      color: "bg-red-100 text-red-700",
      content: currentUser?.id ? (
        <MessagingInterface
          userId={currentUser.id}
          userType="buyer"
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Messages"
          description="Please refresh the page to load your messages."
          buttonText="Refresh"
          onButtonClick={refresh}
          icon={MessageSquare}
        />
      )
    },
    {
      id: "post-showing",
      title: "Actions",
      icon: TrendingUp,
      count: 0,
      color: "bg-purple-100 text-purple-700",
      content: currentUser?.id ? (
        <BuyerPostShowingHub 
          buyerId={currentUser.id}
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Actions"
          description="Please refresh the page to load your actions."
          buttonText="Refresh"
          onButtonClick={refresh}
          icon={TrendingUp}
        />
      )
    },
    {
      id: "completed",
      title: "History",
      icon: CheckCircle,
      count: completedShowings.length,
      color: "bg-green-100 text-green-700",
      content: (
        <ShowingListTab
          title="Tour History"
          showings={completedShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No Tour History"
          emptyDescription="Completed tours will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          showActions={false}
          userType="buyer"
          agreements={agreements}
          onComplete={refresh}
          currentUserId={currentUser?.id}
        />
      )
    }
  ];

  const sidebar = (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Connection Status</h3>
        </div>
        <UnifiedConnectionStatus 
          status={connectionStatus}
          onRetry={refresh}
        />
      </div>

      {/* Upcoming Tours */}
      <UpcomingSection
        title="Upcoming Tours"
        showings={activeShowings}
        onViewAll={() => handleStatClick("active")}
        maxItems={3}
      />

      {/* Recent Activity */}
      <UpcomingSection
        title="Recent Activity"
        showings={completedShowings}
        onViewAll={() => handleStatClick("completed")}
        maxItems={3}
      />
    </div>
  );

  return (
    <>
      <div className="pt-6">
        <UnifiedDashboardLayout
          title={`Welcome back, ${displayName}`}
          subtitle="Track your tours and find your perfect home"
          userType="buyer"
          displayName={displayName}
          tabs={dashboardTabs}
          sidebar={sidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Property Request Wizard Modal */}
      <PropertyRequestWizard
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={handlePropertyRequestSuccess}
        skipNavigation={true}
      />

      {/* Modals */}
      {selectedShowing && (
        <>
          <SignAgreementModal
            isOpen={showAgreementModal}
            onClose={() => setShowAgreementModal(false)}
            onSign={handleAgreementSign}
            showingDetails={{
              propertyAddress: selectedShowing.property_address,
              date: selectedShowing.preferred_date,
              time: selectedShowing.preferred_time,
              agentName: selectedShowing.assigned_agent_name
            }}
          />

          <ReportIssueModal
            isOpen={showReportIssueModal}
            onClose={() => setShowReportIssueModal(false)}
            request={selectedShowing}
            agentId={selectedShowing.assigned_agent_id || ''}
            onComplete={() => {
              setShowReportIssueModal(false);
              setSelectedShowing(null);
              refresh();
            }}
          />
        </>
      )}
    </>
  );
};

export default BuyerDashboard;
