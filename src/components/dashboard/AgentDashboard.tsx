import { useState } from "react";
import { CalendarDays, Clock, CheckCircle, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";

// Unified components
import UnifiedDashboardLayout from "@/components/dashboard/shared/UnifiedDashboardLayout";
import UpcomingSection from "@/components/dashboard/shared/UpcomingSection";

// Existing components
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";
import MessagingInterface from "@/components/messaging/MessagingInterface";

// New post-showing components
import AgentPostShowingInsights from "@/components/dashboard/AgentPostShowingInsights";
import PostShowingAnalytics from "@/components/dashboard/PostShowingAnalytics";
import AgentNotificationsPanel from "@/components/dashboard/AgentNotificationsPanel";

const AgentDashboard = () => {
  const {
    profile,
    pendingRequests,
    assignedRequests,
    completedRequests,
    loading,
    authLoading,
    handleStatusUpdate,
    fetchAgentData
  } = useAgentDashboard();

  const { confirmShowing } = useAgentConfirmation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const isMobile = useIsMobile();

  const currentUser = profile;
  const { unreadCount } = useMessages(currentUser?.id || null);

  console.log('AgentDashboard - Current user:', currentUser?.id);
  console.log('AgentDashboard - Loading states:', { loading, authLoading });

  const handleConfirmShowing = (request: any) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  const handleStatusChange = (request: any) => {
    setSelectedRequest(request);
    setShowStatusModal(true);
  };

  const handleReportIssue = (request: any) => {
    setSelectedRequest(request);
    setShowReportIssueModal(true);
  };

  const handleConfirmSuccess = async (confirmationData: any) => {
    if (!profile) return;
    
    const success = await confirmShowing(confirmationData, profile);
    if (success) {
      setShowConfirmModal(false);
      setSelectedRequest(null);
      fetchAgentData();
    }
  };

  const handleStatusUpdateSuccess = (requestId: string, newStatus: string, estimatedDate?: string) => {
    handleStatusUpdate(requestId, newStatus, estimatedDate);
    setShowStatusModal(false);
    setSelectedRequest(null);
    fetchAgentData();
  };

  const handleReportIssueSuccess = () => {
    setShowReportIssueModal(false);
    setSelectedRequest(null);
    fetchAgentData();
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
        </div>
      </div>
    );
  }

  const displayName = profile.first_name || 'Agent';

  const dashboardTabs = [
    {
      id: "pending",
      title: "Pending",
      icon: Clock,
      count: pendingRequests.length,
      color: "bg-orange-100 text-orange-700",
      content: (
        <ShowingListTab
          title="Pending Requests"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No Pending Requests"
          emptyDescription="All caught up! New showing requests will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          onConfirmShowing={handleConfirmShowing}
          onReportIssue={handleReportIssue}
          userType="agent"
          onComplete={fetchAgentData}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "assigned",
      title: "Assigned",
      icon: CalendarDays,
      count: assignedRequests.length,
      color: "bg-blue-100 text-blue-700",
      content: (
        <ShowingListTab
          title="Assigned Showings"
          showings={assignedRequests}
          emptyIcon={CalendarDays}
          emptyTitle="No Assigned Showings"
          emptyDescription="Confirmed showings will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          onReportIssue={handleReportIssue}
          userType="agent"
          onComplete={fetchAgentData}
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
          userType="agent"
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Messages"
          description="Please refresh the page to load your messages."
          buttonText="Refresh"
          onButtonClick={() => window.location.reload()}
          icon={MessageSquare}
        />
      )
    },
    {
      id: "insights",
      title: "Insights",
      icon: TrendingUp,
      count: 0,
      color: "bg-purple-100 text-purple-700",
      content: currentUser?.id ? (
        <AgentPostShowingInsights 
          agentId={currentUser.id}
          timeframe="month"
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Insights"
          description="Please refresh the page to load your insights."
          buttonText="Refresh"
          onButtonClick={() => window.location.reload()}
          icon={TrendingUp}
        />
      )
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      count: 0,
      color: "bg-green-100 text-green-700",
      content: currentUser?.id ? (
        <PostShowingAnalytics 
          agentId={currentUser.id}
          timeframe="month"
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Analytics"
          description="Please refresh the page to load your analytics."
          buttonText="Refresh"
          onButtonClick={() => window.location.reload()}
          icon={BarChart3}
        />
      )
    },
    {
      id: "completed",
      title: "History",
      icon: CheckCircle,
      count: completedRequests.length,
      color: "bg-green-100 text-green-700",
      content: (
        <ShowingListTab
          title="History"
          showings={completedRequests}
          emptyIcon={CheckCircle}
          emptyTitle="No Completed Showings"
          emptyDescription="Completed and cancelled showings will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={() => {}}
          onRescheduleShowing={() => {}}
          showActions={false}
          userType="agent"
          onComplete={fetchAgentData}
          currentUserId={currentUser?.id}
        />
      )
    }
  ];

  const sidebar = (
    <div className="space-y-6">
      {/* Post-Showing Notifications */}
      {currentUser?.id && (
        <AgentNotificationsPanel agentId={currentUser.id} />
      )}

      {/* Upcoming Showings */}
      <UpcomingSection
        title="Upcoming"
        showings={assignedRequests}
        onViewAll={() => handleStatClick("assigned")}
        maxItems={3}
      />

      {/* Recent Activity */}
      <UpcomingSection
        title="Recent Activity"
        showings={completedRequests}
        onViewAll={() => handleStatClick("completed")}
        maxItems={3}
      />
    </div>
  );

  return (
    <>
      {/* Remove the redundant header, use only the main navigation */}
      <div className="pt-6">
        <UnifiedDashboardLayout
          title={`Welcome back, ${displayName}`}
          subtitle="Manage your showing requests and connect with buyers"
          userType="agent"
          displayName={displayName}
          tabs={dashboardTabs}
          sidebar={sidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Modals */}
      {selectedRequest && (
        <>
          <AgentConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            request={selectedRequest}
            onConfirm={handleConfirmSuccess}
          />
          
          <StatusUpdateModal
            isOpen={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            request={selectedRequest}
            onUpdateStatus={handleStatusUpdateSuccess}
          />

          <ReportIssueModal
            isOpen={showReportIssueModal}
            onClose={() => setShowReportIssueModal(false)}
            request={selectedRequest}
            agentId={currentUser?.id || ''}
            onComplete={handleReportIssueSuccess}
          />
        </>
      )}
    </>
  );
};

export default AgentDashboard;
