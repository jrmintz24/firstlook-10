import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, Calendar, MessageCircle, TrendingUp, Menu, X } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import SendMessageModal from "@/components/dashboard/SendMessageModal";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { isActiveShowing, type ShowingStatus } from "@/utils/showingStatus";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/hooks/useMessages";
import AgentConversationsView from "@/components/messaging/AgentConversationsView";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import ModernSidebar from "@/components/dashboard/ModernSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const AgentDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRequestId, setMessageRequestId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('available');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    profile, 
    showingRequests, 
    loading, 
    authLoading,
    fetchAgentData
  } = useAgentDashboard();

  const { confirmShowing, loading: confirmationLoading } = useAgentConfirmation();
  const { toast } = useToast();
  const { unreadCount, sendMessage: sendMessageViaHook } = useMessages(profile?.id || '');

  const handleSendMessage = (requestId: string) => {
    console.log('handleSendMessage called with requestId:', requestId);
    
    const request = showingRequests.find(req => req.id === requestId);
    console.log('Found request:', request);
    
    if (!request) {
      console.log('Request not found');
      return;
    }
    
    if (request.status === 'cancelled') {
      toast({
        title: "Messaging Unavailable",
        description: "Cannot send messages for cancelled showings.",
        variant: "destructive"
      });
      return;
    }

    if (request.status === 'completed' && request.status_updated_at) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(request.status_updated_at) < weekAgo) {
        toast({
          title: "Messaging Expired",
          description: "Message access expires one week after showing completion.",
          variant: "destructive"
        });
        return;
      }
    }

    if (!request.user_id) {
      toast({
        title: "Messaging Unavailable",
        description: "No buyer contact available for this showing.",
        variant: "destructive"
      });
      return;
    }

    console.log('Setting messageRequestId and showing modal');
    setMessageRequestId(requestId);
    setShowMessageModal(true);
  };

  const sendMessage = async (message: string) => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Profile not found. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    console.log('sendMessage called with:', { message, messageRequestId, profileId: profile.id });

    try {
      const request = showingRequests.find(req => req.id === messageRequestId);
      if (!request) {
        throw new Error("Request not found");
      }

      console.log('Found request for messaging:', request);

      if (request.status === 'cancelled') {
        throw new Error("Cannot send messages for cancelled showings");
      }

      if (!request.user_id) {
        throw new Error("No buyer contact available");
      }

      const success = await sendMessageViaHook(messageRequestId, request.user_id, message);
      
      if (success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the buyer.",
        });
        setShowMessageModal(false);
        setMessageRequestId('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleConfirmShowing = (request: any) => {
    setSelectedRequest(request);
    setShowConfirmationModal(true);
  };

  const handleAgentConfirmation = async (confirmationData: any) => {
    if (!profile) {
      console.error('No profile available for confirmation');
      return;
    }
    
    const success = await confirmShowing(confirmationData, profile);
    if (success) {
      setShowConfirmationModal(false);
      setSelectedRequest(null);
      fetchAgentData();
    }
  };

  const handleComplete = () => {
    fetchAgentData();
  };

  const handleStatClick = (tabId: string | number) => {
    if (typeof tabId === 'string') {
      setActiveTab(tabId);
    }
  };

  // Organize requests by categories
  const availableRequests = showingRequests.filter(req => 
    req.status === 'pending' && !req.assigned_agent_name && !req.requested_agent_name
  );
  
  const activeShowings = showingRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed' || req.status === 'cancelled'
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900 mb-2">Loading agent dashboard...</div>
          <div className="text-sm text-gray-500">
            {authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-4">Access Denied</div>
          <div className="text-sm text-gray-600 mb-4">You need to be an agent to access this dashboard.</div>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Modern agent stats
  const agentStats = [
    {
      title: "Available Requests",
      value: availableRequests.length,
      change: availableRequests.length > 0 ? { value: "Ready to accept", trend: 'up' as const } : undefined,
      icon: UserPlus,
      color: 'orange' as const,
      targetTab: "available"
    },
    {
      title: "Active Showings",
      value: activeShowings.length,
      change: activeShowings.length > 0 ? { value: "In progress", trend: 'up' as const } : undefined,
      icon: Calendar,
      color: 'blue' as const,
      targetTab: "active"
    },
    {
      title: "Messages",
      value: unreadCount > 0 ? unreadCount : 0,
      change: unreadCount > 0 ? { value: "Response needed", trend: 'neutral' as const } : undefined,
      icon: MessageCircle,
      color: 'purple' as const,
      targetTab: "conversations"
    },
    {
      title: "Completed",
      value: completedShowings.filter(s => s.status === 'completed').length,
      change: completedShowings.filter(s => s.status === 'completed').length > 0 ? { value: "This month", trend: 'up' as const } : undefined,
      icon: CheckCircle,
      color: 'green' as const,
      targetTab: "history"
    }
  ];

  // Dashboard sections
  const dashboardSectionsArray = [
    {
      id: "available",
      title: "Available",
      count: availableRequests.length,
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Available Requests</h2>
            <p className="text-gray-600 text-sm sm:text-base">Accept and confirm showing requests</p>
          </div>

          {availableRequests.length === 0 ? (
            <Card className="text-center py-12 border-0 shadow-sm">
              <CardContent>
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No available requests</h3>
                <p className="text-gray-500">All current requests have been accepted by agents.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {availableRequests.map((request) => (
                <AgentRequestCard
                  key={request.id}
                  request={request}
                  onAssign={() => {}}
                  onUpdateStatus={() => {}}
                  onSendMessage={() => handleSendMessage(request.id)}
                  onConfirm={handleConfirmShowing}
                  showAssignButton={true}
                  onComplete={handleComplete}
                  currentAgentId={profile.id}
                />
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: "active",
      title: "Active",
      count: activeShowings.length,
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Active Showings</h2>
            <p className="text-gray-600 text-sm sm:text-base">Confirmed and scheduled showings</p>
          </div>

          {activeShowings.length === 0 ? (
            <Card className="text-center py-12 border-0 shadow-sm">
              <CardContent>
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active showings</h3>
                <p className="text-gray-500">Confirmed showings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeShowings.map((request) => (
                <AgentRequestCard
                  key={request.id}
                  request={request}
                  onAssign={() => {}}
                  onUpdateStatus={() => {}}
                  onSendMessage={() => handleSendMessage(request.id)}
                  showAssignButton={false}
                  onComplete={handleComplete}
                  currentAgentId={profile.id}
                />
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: "conversations",
      title: "Conversations",
      count: unreadCount,
      content: profile?.id ? (
        <AgentConversationsView agentId={profile.id} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to view conversations</p>
        </div>
      )
    },
    {
      id: "history",
      title: "History",
      count: completedShowings.length,
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Showing History</h2>
          
          {completedShowings.length === 0 ? (
            <Card className="text-center py-12 border-0 shadow-sm">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed showings yet</h3>
                <p className="text-gray-500">Your completed and cancelled showings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedShowings.map((request) => (
                <AgentRequestCard
                  key={request.id}
                  request={request}
                  onAssign={() => {}}
                  onUpdateStatus={() => {}}
                  onSendMessage={() => handleSendMessage(request.id)}
                  showAssignButton={false}
                  onComplete={handleComplete}
                  currentAgentId={profile.id}
                />
              ))}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome, {profile?.first_name || 'Agent'}!</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your property showings</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        )}

        {/* Desktop Welcome Section */}
        {!isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.first_name || 'Agent'}!</h1>
                <p className="text-gray-600 mt-1">Manage your property showings and grow your business</p>
              </div>
            </div>
          </div>
        )}
        
        <ModernStatsGrid stats={agentStats} onStatClick={handleStatClick} />

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-4'} gap-6 mt-6`}>
          {/* Main Content - Tabbed Sections */}
          <div className={isMobile ? '' : 'lg:col-span-3'}>
            <Card className="bg-white border-0 shadow-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-100">
                  <TabsList className="w-full bg-transparent border-0 p-0 h-auto justify-start rounded-none overflow-x-auto">
                    {dashboardSectionsArray.map((section) => (
                      <TabsTrigger 
                        key={section.id} 
                        value={section.id}
                        className="relative px-4 sm:px-6 py-4 bg-transparent border-0 rounded-none text-gray-600 font-medium hover:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 text-sm sm:text-base whitespace-nowrap"
                      >
                        {section.title}
                        {section.count !== undefined && section.count > 0 && (
                          <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                            {section.count}
                          </span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {dashboardSectionsArray.map((section) => (
                  <TabsContent key={section.id} value={section.id} className="p-4 sm:p-6 mt-0">
                    {section.content}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobile && sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Dashboard Info</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <ModernSidebar 
                  quickStats={[
                    { label: "Available", value: availableRequests.length, icon: UserPlus },
                    { label: "In Progress", value: activeShowings.length, icon: Clock },
                    { label: "Total Completed", value: completedShowings.filter(s => s.status === 'completed').length, icon: TrendingUp }
                  ]}
                  upcomingEvents={activeShowings.slice(0, 3).map(showing => ({
                    id: showing.id,
                    title: showing.property_address,
                    date: showing.preferred_date ? new Date(showing.preferred_date).toLocaleDateString() : 'TBD',
                    type: 'Property Showing'
                  }))}
                  activities={[
                    ...availableRequests.slice(0, 2).map(req => ({
                      id: req.id,
                      type: 'update' as const,
                      title: 'New Request Available',
                      description: req.property_address,
                      time: new Date(req.created_at).toLocaleDateString(),
                      unread: true
                    })),
                    ...completedShowings.slice(0, 2).map(req => ({
                      id: req.id,
                      type: 'update' as const,
                      title: 'Showing Completed',
                      description: req.property_address,
                      time: req.status_updated_at ? new Date(req.status_updated_at).toLocaleDateString() : '',
                      unread: false
                    }))
                  ]}
                />
              </div>
            </div>
          )}
          
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <ModernSidebar 
                quickStats={[
                  { label: "Available", value: availableRequests.length, icon: UserPlus },
                  { label: "In Progress", value: activeShowings.length, icon: Clock },
                  { label: "Total Completed", value: completedShowings.filter(s => s.status === 'completed').length, icon: TrendingUp }
                ]}
                upcomingEvents={activeShowings.slice(0, 3).map(showing => ({
                  id: showing.id,
                  title: showing.property_address,
                  date: showing.preferred_date ? new Date(showing.preferred_date).toLocaleDateString() : 'TBD',
                  type: 'Property Showing'
                }))}
                activities={[
                  ...availableRequests.slice(0, 2).map(req => ({
                    id: req.id,
                    type: 'update' as const,
                    title: 'New Request Available',
                    description: req.property_address,
                    time: new Date(req.created_at).toLocaleDateString(),
                    unread: true
                  })),
                  ...completedShowings.slice(0, 2).map(req => ({
                    id: req.id,
                    type: 'update' as const,
                    title: 'Showing Completed',
                    description: req.property_address,
                    time: req.status_updated_at ? new Date(req.status_updated_at).toLocaleDateString() : '',
                    unread: false
                  }))
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <AgentConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => {
            setShowConfirmationModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onConfirm={handleAgentConfirmation}
        />
      )}

      <SendMessageModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setMessageRequestId('');
        }}
        onSend={sendMessage}
      />
    </div>
  );
};

export default AgentDashboard;
