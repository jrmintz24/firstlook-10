import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle, Calendar, MessageCircle, TrendingUp, Users } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import SendMessageModal from "@/components/dashboard/SendMessageModal";
import QuickStatsGrid from "@/components/dashboard/QuickStatsGrid";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { isActiveShowing, type ShowingStatus } from "@/utils/showingStatus";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MessagesTab from "@/components/messaging/MessagesTab";
import { useMessages } from "@/hooks/useMessages";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TourProgressTracker from "@/components/dashboard/TourProgressTracker";
import SmartReminders from "@/components/dashboard/SmartReminders";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import TourHistoryInsights from "@/components/dashboard/TourHistoryInsights";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UpdatesPanel from "@/components/dashboard/UpdatesPanel";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import AgentConversationsView from "@/components/messaging/AgentConversationsView";

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
    
    // Check if messaging is allowed for this request
    const request = showingRequests.find(req => req.id === requestId);
    console.log('Found request:', request);
    
    if (!request) {
      console.log('Request not found');
      return;
    }
    
    // Don't allow messaging for cancelled showings
    if (request.status === 'cancelled') {
      toast({
        title: "Messaging Unavailable",
        description: "Cannot send messages for cancelled showings.",
        variant: "destructive"
      });
      return;
    }

    // Don't allow messaging if completed more than a week ago
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

    // Don't allow messaging if no buyer user_id
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
      // Find the request to get buyer information
      const request = showingRequests.find(req => req.id === messageRequestId);
      if (!request) {
        throw new Error("Request not found");
      }

      console.log('Found request for messaging:', request);

      // Check if messaging is still allowed
      if (request.status === 'cancelled') {
        throw new Error("Cannot send messages for cancelled showings");
      }

      if (!request.user_id) {
        throw new Error("No buyer contact available");
      }

      // Use the updated hook that handles email notifications
      const success = await sendMessageViaHook(messageRequestId, request.user_id, message);
      
      if (success) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the buyer.",
        });
        // Close the modal
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

  // Organize requests by categories - cancelled requests go to history
  const availableRequests = showingRequests.filter(req => 
    req.status === 'pending' && !req.assigned_agent_name && !req.requested_agent_name
  );
  
  const activeShowings = showingRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  // History includes completed AND cancelled requests
  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed' || req.status === 'cancelled'
  );
  
  const thisWeekShowings = activeShowings.filter(req => {
    if (!req.preferred_date) return false;
    const showingDate = new Date(req.preferred_date);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return showingDate >= now && showingDate <= weekFromNow;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="text-lg mb-4">Loading agent dashboard...</div>
          <div className="text-sm text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="text-lg mb-4">Access Denied</div>
          <div className="text-sm text-gray-600 mb-4">You need to be an agent to access this dashboard.</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Create enhanced agent-specific stats with more relevant information
  const agentStats = [
    {
      value: availableRequests.length,
      label: "New Requests",
      subtitle: availableRequests.length > 0 ? "Ready to accept" : "No new requests",
      icon: UserPlus,
      iconColor: "text-orange-500",
      trend: availableRequests.length > 0 ? {
        value: "Opportunities",
        direction: 'up' as const
      } : undefined,
      actionable: true
    },
    {
      value: thisWeekShowings.length,
      label: "This Week",
      subtitle: thisWeekShowings.length > 0 ? "Scheduled tours" : "No tours scheduled",
      icon: Calendar,
      iconColor: "text-blue-500",
      trend: thisWeekShowings.length > 0 ? {
        value: "Busy week!",
        direction: 'up' as const
      } : undefined,
      progress: thisWeekShowings.length > 0 ? {
        current: thisWeekShowings.filter(s => s.status === 'scheduled').length,
        max: thisWeekShowings.length,
        color: 'bg-blue-500'
      } : undefined
    },
    {
      value: unreadCount > 0 ? unreadCount : "0",
      label: "Messages",
      subtitle: unreadCount > 0 ? "From clients" : "All caught up",
      icon: MessageCircle,
      iconColor: "text-purple-500",
      trend: unreadCount > 0 ? {
        value: "Response needed",
        direction: 'neutral' as const
      } : undefined,
      actionable: true
    },
    {
      value: completedShowings.filter(s => s.status === 'completed').length,
      label: "Tours Completed",
      subtitle: completedShowings.filter(s => s.status === 'completed').length > 0 ? "This month" : "Get started",
      icon: TrendingUp,
      iconColor: "text-green-500",
      trend: completedShowings.filter(s => s.status === 'completed').length > 0 ? {
        value: "Great work!",
        direction: 'up' as const
      } : undefined,
      progress: completedShowings.filter(s => s.status === 'completed').length > 0 ? {
        current: completedShowings.filter(s => s.status === 'completed').length,
        max: Math.max(10, completedShowings.filter(s => s.status === 'completed').length),
        color: 'bg-green-500'
      } : undefined
    }
  ];

  const handleStatClick = (statIndex: number) => {
    switch (statIndex) {
      case 0: // Available requests
        // Switch to available tab
        break;
      case 2: // Messages
        // Switch to messages tab
        break;
      default:
        break;
    }
  };

  const allShowings = [...availableRequests, ...activeShowings, ...completedShowings];

  // Dashboard sections for the new layout
  const dashboardSections = [
    {
      id: "available",
      label: "Available",
      count: availableRequests.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Available Requests</h2>
            <p className="text-gray-600">Accept and confirm showing requests</p>
          </div>

          {availableRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No available requests</h3>
                <p className="text-gray-500">All current requests have been accepted by agents.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
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
      label: "Active",
      count: activeShowings.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Active Showings</h2>
            <p className="text-gray-600">Confirmed and scheduled showings</p>
          </div>

          {activeShowings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No active showings</h3>
                <p className="text-gray-500">Confirmed showings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
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
      label: "Conversations",
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
      label: "History",
      count: completedShowings.length,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
          
          {completedShowings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed showings yet</h3>
                <p className="text-gray-500">Your completed and cancelled showings will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
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

  // Header component
  const header = (
    <DashboardHeader 
      displayName={profile?.first_name || 'Agent'} 
      onRequestShowing={() => {}} // Agents don't request showings
      userType="agent"
    />
  );

  // Stats component  
  const stats = <EnhancedStatsGrid stats={agentStats} onStatClick={handleStatClick} />;

  // Main content (welcome dashboard instead of progress tracker)
  const mainContent = (
    <WelcomeDashboard 
      userType="agent"
      displayName={profile?.first_name || 'Agent'}
      hasActiveShowings={activeShowings.length > 0}
      completedCount={completedShowings.filter(s => s.status === 'completed').length}
      pendingCount={availableRequests.length}
    />
  );

  // Sidebar content
  const sidebar = (
    <UpdatesPanel 
      showingRequests={allShowings} 
      userType="agent" 
      onSendMessage={handleSendMessage}
    />
  );

  return (
    <>
      <DashboardLayout
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
