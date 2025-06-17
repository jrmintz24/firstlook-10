import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import SendMessageModal from "@/components/dashboard/SendMessageModal";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { isActiveShowing, type ShowingStatus } from "@/utils/showingStatus";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/hooks/useMessages";
import AgentConversationsView from "@/components/messaging/AgentConversationsView";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import ModernHeader from "@/components/dashboard/ModernHeader";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import ModernSidebar from "@/components/dashboard/ModernSidebar";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";

const AgentDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRequestId, setMessageRequestId] = useState<string>('');
  
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
      color: 'orange' as const
    },
    {
      title: "Active Showings",
      value: activeShowings.length,
      change: activeShowings.length > 0 ? { value: "In progress", trend: 'up' as const } : undefined,
      icon: Calendar,
      color: 'blue' as const
    },
    {
      title: "Messages",
      value: unreadCount > 0 ? unreadCount : 0,
      change: unreadCount > 0 ? { value: "Response needed", trend: 'neutral' as const } : undefined,
      icon: MessageCircle,
      color: 'purple' as const
    },
    {
      title: "Completed",
      value: completedShowings.filter(s => s.status === 'completed').length,
      change: completedShowings.filter(s => s.status === 'completed').length > 0 ? { value: "This month", trend: 'up' as const } : undefined,
      icon: CheckCircle,
      color: 'green' as const
    }
  ];

  const allShowings = [...availableRequests, ...activeShowings, ...completedShowings];

  // Dashboard sections - convert to object
  const dashboardSectionsArray = [
    {
      id: "available",
      title: "Available",
      count: availableRequests.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Available Requests</h2>
            <p className="text-gray-600">Accept and confirm showing requests</p>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Showings</h2>
            <p className="text-gray-600">Confirmed and scheduled showings</p>
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

  // Convert array to object for DashboardLayout
  const dashboardSections = dashboardSectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  // Header component
  const header = (
    <ModernHeader
      title="Agent Dashboard"
      subtitle={`Welcome back, ${profile?.first_name || 'Agent'}!`}
      displayName={profile?.first_name || 'Agent'}
      userType="agent"
      notificationCount={unreadCount}
    />
  );

  // Stats component  
  const stats = <ModernStatsGrid stats={agentStats} />;

  // Main content
  const mainContent = (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Agent Performance</h2>
        <p className="text-gray-600">Manage your showings and track your success</p>
      </div>
      
      <WelcomeDashboard 
        userType="agent"
        displayName={profile?.first_name || 'Agent'}
        hasActiveShowings={activeShowings.length > 0}
        completedCount={completedShowings.filter(s => s.status === 'completed').length}
        pendingCount={availableRequests.length}
      />
    </div>
  );

  // Sidebar content
  const sidebar = (
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
  );

  return (
    <>
      <ModernDashboardLayout
        header={header}
        stats={stats}
        mainContent={mainContent}
        sidebar={sidebar}
        sections={dashboardSections}
        defaultSection="available"
      />

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
    </>
  );
};

export default AgentDashboard;
