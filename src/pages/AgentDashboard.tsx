
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import AgentConfirmationModal from "@/components/dashboard/AgentConfirmationModal";
import SendMessageModal from "@/components/dashboard/SendMessageModal";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { useAgentConfirmation } from "@/hooks/useAgentConfirmation";
import { isActiveShowing, type ShowingStatus } from "@/utils/showingStatus";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FirstLook
              </Link>
              <p className="text-gray-600 mt-1">Agent Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800">Agent</Badge>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, {profile.first_name}!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{availableRequests.length}</div>
              <div className="text-gray-600">Available Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{myRequests.length}</div>
              <div className="text-gray-600">My Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{activeShowings.length}</div>
              <div className="text-gray-600">Active Showings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {showingRequests.filter(req => req.status === 'completed').length}
              </div>
              <div className="text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Available ({availableRequests.length})</TabsTrigger>
            <TabsTrigger value="mine">My Requests ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
            
            {showingRequests.filter(req => req.status === 'completed').length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed showings yet</h3>
                  <p className="text-gray-500">Your completed showings will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {showingRequests
                  .filter(req => req.status === 'completed')
                  .map((request) => (
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
