import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle, MessageSquare, TrendingUp, Users, Calendar, Menu, X } from "lucide-react";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import MessagingInterface from "@/components/messaging/MessagingInterface";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";

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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleStatClick = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Welcome back, {displayName}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Manage your showing requests and connect with buyers
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Agent Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger 
                  value="pending" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Pending</span>
                    {pendingRequests.length > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5">
                        {pendingRequests.length}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="assigned" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:inline">Assigned</span>
                    {assignedRequests.length > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5">
                        {assignedRequests.length}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Messages</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700 text-xs px-1.5 py-0.5">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
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
                  userType="agent"
                  onComplete={fetchAgentData}
                  currentUserId={currentUser?.id}
                />
              </TabsContent>

              <TabsContent value="assigned" className="mt-6">
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
                  userType="agent"
                  onComplete={fetchAgentData}
                  currentUserId={currentUser?.id}
                />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                {currentUser?.id ? (
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
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
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
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-1 ${isMobile ? (sidebarOpen ? 'fixed inset-0 z-50 bg-white p-4' : 'hidden') : ''}`}>
            <div className="space-y-6">
              {isMobile && sidebarOpen && (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Dashboard Overview</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Quick Stats */}
              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => handleStatClick("pending")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Pending</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-orange-600">{pendingRequests.length}</div>
                  </div>

                  <div 
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleStatClick("assigned")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Assigned</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{assignedRequests.length}</div>
                  </div>

                  <div 
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleStatClick("completed")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Completed</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{completedRequests.length}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Showings */}
              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedRequests.slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {assignedRequests.slice(0, 3).map((showing) => (
                        <div key={showing.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {showing.property_address}
                          </div>
                          <div className="text-xs text-gray-600">
                            {showing.preferred_date && new Date(showing.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {assignedRequests.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-blue-600 hover:bg-blue-50"
                          onClick={() => handleStatClick("assigned")}
                        >
                          View All ({assignedRequests.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No upcoming showings
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completedRequests.slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {completedRequests.slice(0, 3).map((showing) => (
                        <div key={showing.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                            {showing.property_address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={showing.status === 'completed' ? 'default' : 'secondary'} 
                              className={`text-xs ${
                                showing.status === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {showing.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(showing.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {completedRequests.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-green-600 hover:bg-green-50"
                          onClick={() => handleStatClick("completed")}
                        >
                          View All ({completedRequests.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
        </>
      )}
    </div>
  );
};

export default AgentDashboard;
