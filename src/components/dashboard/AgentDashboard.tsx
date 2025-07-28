import { useState } from "react";
import { CalendarDays, Clock, CheckCircle, TrendingUp, BarChart3, FileText, MessageCircle, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { useUnifiedDashboardData } from "@/hooks/useUnifiedDashboardData";

// Unified components
import UnifiedDashboardLayout from "@/components/dashboard/shared/UnifiedDashboardLayout";
import UnifiedConnectionStatus from "@/components/dashboard/UnifiedConnectionStatus";

// Existing components
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";

// Post-showing components
import AgentPostShowingInsights from "@/components/dashboard/AgentPostShowingInsights";
import PostShowingAnalytics from "@/components/dashboard/PostShowingAnalytics";
import AgentNotificationsPanel from "@/components/dashboard/AgentNotificationsPanel";
import ProposalsTab from "@/components/dashboard/ProposalsTab";

// Offer workflow components
import AgentOfferManagement from "@/components/offer-management/AgentOfferManagement";
import AgentConsultationManager from "@/components/offer-workflow/AgentConsultationManager";

const AgentDashboard = () => {
  const {
    profile,
    pendingRequests,
    assignedRequests,
    completedRequests,
    loading,
    authLoading,
    currentUser,
    connectionStatus,
    refresh,
  } = useUnifiedDashboardData('agent');

  const { confirmShowing } = useAgentConfirmation();
  const isMobile = useIsMobile();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pending");

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
      refresh();
    }
  };

  const handleStatusUpdateSuccess = () => {
    setShowStatusModal(false);
    setSelectedRequest(null);
    refresh();
  };

  const handleReportIssueSuccess = () => {
    setShowReportIssueModal(false);
    setSelectedRequest(null);
    refresh();
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

  const displayName = profile.first_name || 'Agent';

  // Create enhanced stats section with 3 balanced cards
  const enhancedStats = (
    <>
      {/* Version indicator for debugging */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4 text-center">
        <p className="font-semibold">🚀 Agent Dashboard v2.0 - New Layout Active</p>
        <p className="text-xs opacity-90">Deployed: {new Date().toLocaleString()}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Needs Attention</p>
              <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
              <p className="text-xs text-gray-500 mt-1">Pending requests</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold text-blue-600">
                {assignedRequests.filter(req => {
                  if (!req.preferred_date) return false;
                  const date = new Date(req.preferred_date);
                  const now = new Date();
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return date >= now && date <= weekFromNow;
                }).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Scheduled tours</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 group-hover:scale-110 transition-transform">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Active</p>
              <p className="text-3xl font-bold text-green-600">
                {pendingRequests.length + assignedRequests.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tours in progress</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );

  // Primary tabs for main workflow
  const primaryTabs = [
    {
      id: "pending",
      title: "Pending",
      icon: Clock,
      count: pendingRequests.length,
      color: "bg-orange-100 text-orange-700",
      content: (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <ShowingListTab
              title=""
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
              onComplete={refresh}
              currentUserId={currentUser?.id}
            />
          </CardContent>
        </Card>
      )
    },
    {
      id: "assigned",
      title: "Scheduled",
      icon: CalendarDays,
      count: assignedRequests.length,
      color: "bg-blue-100 text-blue-700",
      content: (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <ShowingListTab
              title=""
              showings={assignedRequests}
              emptyIcon={CalendarDays}
              emptyTitle="No Scheduled Showings"
              emptyDescription="Confirmed showings will appear here."
              emptyButtonText=""
              onRequestShowing={() => {}}
              onCancelShowing={() => {}}
              onRescheduleShowing={() => {}}
              onReportIssue={handleReportIssue}
              userType="agent"
              onComplete={refresh}
              currentUserId={currentUser?.id}
            />
          </CardContent>
        </Card>
      )
    },
    {
      id: "offers",
      title: "Offers",
      icon: FolderOpen,
      count: 0,
      color: "bg-purple-100 text-purple-700",
      content: currentUser?.id ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <AgentOfferManagement agentId={currentUser.id} />
          </CardContent>
        </Card>
      ) : null
    },
    {
      id: "insights",
      title: "Insights",
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
      content: currentUser?.id ? (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <AgentPostShowingInsights 
                agentId={currentUser.id}
                timeframe="month"
              />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <PostShowingAnalytics 
                agentId={currentUser.id}
                timeframe="month"
              />
            </CardContent>
          </Card>
        </div>
      ) : null
    }
  ];

  // Secondary tabs in collapsible section
  const secondaryTabs = [
    {
      id: "consultations",
      title: "Consultations",
      icon: MessageCircle,
      content: currentUser?.id ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <AgentConsultationManager agentId={currentUser.id} />
          </CardContent>
        </Card>
      ) : null
    },
    {
      id: "proposals",
      title: "Proposals", 
      icon: FileText,
      content: currentUser?.id ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <ProposalsTab agentId={currentUser.id} />
          </CardContent>
        </Card>
      ) : null
    },
    {
      id: "history",
      title: "History",
      icon: CheckCircle,
      count: completedRequests.length,
      color: "bg-gray-100 text-gray-700",
      content: (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <ShowingListTab
              title=""
              showings={completedRequests}
              emptyIcon={CheckCircle}
              emptyTitle="No History"
              emptyDescription="Completed and cancelled showings will appear here."
              emptyButtonText=""
              onRequestShowing={() => {}}
              onCancelShowing={() => {}}
              onRescheduleShowing={() => {}}
              showActions={false}
              userType="agent"
              onComplete={refresh}
              currentUserId={currentUser?.id}
            />
          </CardContent>
        </Card>
      )
    }
  ];

  // Combine tabs based on active tab
  const dashboardTabs = activeTab && secondaryTabs.find(tab => tab.id === activeTab) 
    ? [...primaryTabs, ...secondaryTabs]
    : primaryTabs;

  // Combine upcoming and recent into a single activity timeline
  const activityItems = [
    ...assignedRequests.map(req => ({
      ...req,
      type: 'upcoming' as const,
      sortDate: new Date(req.preferred_date || req.created_at)
    })),
    ...completedRequests.slice(0, 3).map(req => ({
      ...req,
      type: 'recent' as const,
      sortDate: new Date(req.status_updated_at || req.created_at)
    }))
  ].sort((a, b) => {
    // Show upcoming first, then recent
    if (a.type !== b.type) {
      return a.type === 'upcoming' ? -1 : 1;
    }
    // Within each type, sort by date
    return a.type === 'upcoming' 
      ? a.sortDate.getTime() - b.sortDate.getTime()
      : b.sortDate.getTime() - a.sortDate.getTime();
  }).slice(0, 5);

  const sidebar = (
    <div className="space-y-4">
      {/* Connection Status - Minimal */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <UnifiedConnectionStatus 
            status={connectionStatus}
            onRetry={refresh}
          />
        </CardContent>
      </Card>

      {/* Post-Showing Notifications - Only show if there are notifications */}
      {currentUser?.id && (
        <div className="transition-all duration-300">
          <AgentNotificationsPanel agentId={currentUser.id} />
        </div>
      )}

      {/* Combined Activity Feed */}
      {activityItems.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Activity Timeline</h3>
              <button
                onClick={() => setActiveTab(activityItems[0].type === 'upcoming' ? 'assigned' : 'history')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </button>
            </div>
            
            <div className="space-y-3">
              {activityItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative pl-6 ${index !== activityItems.length - 1 ? 'pb-3' : ''}`}
                >
                  {/* Timeline line */}
                  {index !== activityItems.length - 1 && (
                    <div className="absolute left-2 top-6 w-0.5 h-full bg-gray-200" />
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`absolute left-0.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                    item.type === 'upcoming' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-400'
                  }`} />
                  
                  {/* Content */}
                  <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.property_address}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.type === 'upcoming' ? (
                            <>
                              <CalendarDays className="inline w-3 h-3 mr-1" />
                              {new Date(item.preferred_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="inline w-3 h-3 mr-1" />
                              Completed {new Date(item.status_updated_at || item.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      {item.type === 'upcoming' && (
                        <span className="flex-shrink-0 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <UnifiedDashboardLayout
          title={`Welcome back, ${displayName}`}
          subtitle="Manage your tours and connect with buyers • v2.0"
          userType="agent"
          displayName={displayName}
          tabs={dashboardTabs}
          sidebar={sidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          enhancedStats={enhancedStats}
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
