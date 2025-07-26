import { useState } from "react";
import { CalendarDays, Clock, CheckCircle, MessageSquare, TrendingUp, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { useBuyerActionsForAgent } from "@/hooks/useBuyerActionsForAgent";

// Unified components
import UnifiedDashboardLayout from "@/components/dashboard/shared/UnifiedDashboardLayout";
import UpcomingSection from "@/components/dashboard/shared/UpcomingSection";

// Existing components
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import MessagingInterface from "@/components/messaging/MessagingInterface";

// New components
import ProposalsTab from "@/components/dashboard/ProposalsTab";
import MyClientsTab from "@/components/dashboard/MyClientsTab";

const AgentDashboard = () => {
  const {
    profile,
    pendingRequests,
    assignedRequests,
    completedRequests,
    loading,
    authLoading,
    handleStatusUpdate,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchAgentData
  } = useAgentDashboard();

  const { buyerActions, loading: actionsLoading } = useBuyerActionsForAgent(profile?.id || '');
  const { confirmShowing } = useAgentConfirmation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const isMobile = useIsMobile();

  const currentUser = profile;
  const { unreadCount } = useMessages(currentUser?.id || null);

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

  const handleReschedule = (requestId: string) => {
    const request = [...assignedRequests, ...pendingRequests].find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowRescheduleModal(true);
    }
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

  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    setSelectedRequest(null);
    fetchAgentData();
  };

  const handleStatClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Show loading while auth is being determined
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

  // Enhanced color system for agent dashboard
  const getColorGradient = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-orange-100 text-orange-700': 'bg-gradient-to-br from-orange-100 to-amber-50 group-hover:from-orange-200 group-hover:to-amber-100',
      'bg-blue-100 text-blue-700': 'bg-gradient-to-br from-blue-100 to-indigo-50 group-hover:from-blue-200 group-hover:to-indigo-100',
      'bg-indigo-100 text-indigo-700': 'bg-gradient-to-br from-indigo-100 to-blue-50 group-hover:from-indigo-200 group-hover:to-blue-100',
      'bg-purple-100 text-purple-700': 'bg-gradient-to-br from-purple-100 to-pink-50 group-hover:from-purple-200 group-hover:to-pink-100',
      'bg-green-100 text-green-700': 'bg-gradient-to-br from-green-100 to-emerald-50 group-hover:from-green-200 group-hover:to-emerald-100'
    };
    return colorMap[color] || colorMap['bg-blue-100 text-blue-700'];
  };

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-orange-100 text-orange-700': 'text-orange-600',
      'bg-blue-100 text-blue-700': 'text-blue-600',
      'bg-indigo-100 text-indigo-700': 'text-indigo-600',
      'bg-purple-100 text-purple-700': 'text-purple-600',
      'bg-green-100 text-green-700': 'text-green-600'
    };
    return colorMap[color] || 'text-blue-600';
  };

  const dashboardTabs = [
    {
      id: "pending",
      title: "Available",
      icon: Clock,
      count: pendingRequests.length,
      color: "bg-orange-100 text-orange-700",
      content: (
        <ShowingListTab
          title="Available Requests"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No Available Requests"
          emptyDescription="All caught up! New showing requests will appear here for you to accept."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleReschedule}
          onConfirmShowing={handleConfirmShowing}
          onReportIssue={handleReportIssue}
          userType="agent"
          onComplete={fetchAgentData}
          currentUserId={currentUser?.id}
          buyerActions={buyerActions}
        />
      )
    },
    {
      id: "assigned",
      title: "My Tours",
      icon: CalendarDays,
      count: assignedRequests.length,
      color: "bg-blue-100 text-blue-700",
      content: (
        <ShowingListTab
          title="My Assigned Tours"
          showings={assignedRequests}
          emptyIcon={CalendarDays}
          emptyTitle="No Assigned Tours"
          emptyDescription="Tours you've accepted will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleReschedule}
          onReportIssue={handleReportIssue}
          userType="agent"
          onComplete={fetchAgentData}
          currentUserId={currentUser?.id}
          buyerActions={buyerActions}
        />
      )
    },
    {
      id: "clients",
      title: "My Clients",
      icon: Users,
      count: 0, // Count will be implemented in the component
      color: "bg-indigo-100 text-indigo-700",
      content: currentUser?.id ? (
        <MyClientsTab agentId={currentUser.id} />
      ) : (
        <EmptyStateCard
          title="Unable to Load Clients"
          description="Please refresh the page to load your clients."
          buttonText="Refresh"
          onButtonClick={fetchAgentData}
          icon={Users}
        />
      )
    },
    {
      id: "proposals",
      title: "Proposals",
      icon: FileText,
      count: 0, // We'll implement count later
      color: "bg-purple-100 text-purple-700",
      content: currentUser?.id ? (
        <ProposalsTab agentId={currentUser.id} />
      ) : (
        <EmptyStateCard
          title="Unable to Load Proposals"
          description="Please refresh the page to load your proposals."
          buttonText="Refresh"
          onButtonClick={fetchAgentData}
          icon={FileText}
        />
      )
    },
    {
      id: "completed",
      title: "Completed",
      icon: CheckCircle,
      count: completedRequests.length,
      color: "bg-green-100 text-green-700",
      content: (
        <ShowingListTab
          title="Completed"
          showings={completedRequests}
          emptyIcon={CheckCircle}
          emptyTitle="No Completed Showings"
          emptyDescription="Completed and cancelled showings will appear here."
          emptyButtonText=""
          onRequestShowing={() => {}}
          onCancelShowing={() => {}} // Disable for completed showings
          onRescheduleShowing={() => {}} // Disable for completed showings
          showActions={false}
          userType="agent"
          onComplete={fetchAgentData}
          currentUserId={currentUser?.id}
          buyerActions={buyerActions}
        />
      )
    }
  ];

  // Enhanced stats grid for agent dashboard
  const enhancedStats = (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <Card 
              key={index} 
              className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] border border-gray-100/60 bg-white/80 backdrop-blur-sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm ${getColorGradient(tab.color)}`}>
                    <Icon className={`w-7 h-7 transition-all duration-300 group-hover:scale-110 ${getIconColor(tab.color)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 tracking-tight">{tab.count}</div>
                    <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{tab.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const sidebar = (
    <div className="space-y-6">
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
      <UnifiedDashboardLayout
        title={`Welcome back, ${displayName}`}
        subtitle="View available tours and manage your assignments"
        userType="agent"
        displayName={displayName}
        tabs={dashboardTabs}
        sidebar={sidebar}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        enhancedStats={enhancedStats}
      />

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

          <RescheduleModal
            isOpen={showRescheduleModal}
            onClose={() => setShowRescheduleModal(false)}
            showingRequest={selectedRequest}
            onSuccess={handleRescheduleSuccess}
          />
        </>
      )}
    </>
  );
};

export default AgentDashboard;
