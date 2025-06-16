import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { unreadCount } = useMessages(profile?.id || '');

  const handleSendMessage = (requestId: string) => {
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

    try {
      // Find the request to get buyer information
      const request = showingRequests.find(req => req.id === messageRequestId);
      if (!request) {
        throw new Error("Request not found");
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          showing_request_id: messageRequestId,
          sender_id: profile.id,
          receiver_id: request.user_id,
          content: message
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the buyer.",
      });
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

  // Organize requests by categories - declare once only
  const availableRequests = showingRequests.filter(req => 
    req.status === 'pending' && !req.assigned_agent_name && !req.requested_agent_name
  );
  
  const myRequests = showingRequests.filter(
    req => profile && (
      req.assigned_agent_email === (profile as { email?: string }).email ||
      req.requested_agent_name?.includes(profile.first_name) ||
      req.assigned_agent_email === profile.id
    )
  );
  
  const activeShowings = showingRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  const completedShowings = showingRequests.filter(req => req.status === 'completed');
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

  // Create agent-specific stats with Apple-esque styling
  const agentStats = [
    {
      value: availableRequests.length,
      label: "Available Requests",
      icon: UserPlus,
      iconColor: "text-orange-500"
    },
    {
      value: thisWeekShowings.length,
      label: "This Week's Tours",
      icon: Calendar,
      iconColor: "text-blue-500"
    },
    {
      value: unreadCount > 0 ? unreadCount : "0",
      label: "Unread Messages",
      icon: MessageCircle,
      iconColor: "text-purple-500"
    },
    {
      value: completedShowings.length,
      label: "Completed Tours",
      icon: TrendingUp,
      iconColor: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FirstLook
              </Link>
              <p className="text-gray-600 mt-1 font-medium">Agent Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Agent</div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="font-medium">Welcome, {profile.first_name}!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <QuickStatsGrid stats={agentStats} />

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
            <TabsTrigger value="available" className="rounded-lg font-medium">Available ({availableRequests.length})</TabsTrigger>
            <TabsTrigger value="mine" className="rounded-lg font-medium">My Requests ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg font-medium">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg font-medium">Messages</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg font-medium">History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
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
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
              <p className="text-gray-600">Requests assigned to or confirmed by you</p>
            </div>

            {myRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests yet</h3>
                  <p className="text-gray-500">Accept available requests to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myRequests.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => {}}
                    onUpdateStatus={() => {}}
                    onSendMessage={() => handleSendMessage(request.id)}
                    showAssignButton={false}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
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
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            {profile?.id ? (
              <MessagesTab userId={profile.id} userType="agent" />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Please sign in to view messages</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
            
            {completedShowings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed showings yet</h3>
                  <p className="text-gray-500">Your completed showings will appear here.</p>
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
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
