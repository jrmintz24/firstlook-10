
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
// import SendMessageModal from "@/components/dashboard/SendMessageModal";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { isActiveShowing, canBeAssigned, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";

const AgentDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  // const [showMessageModal, setShowMessageModal] = useState(false);
  
  const { 
    profile, 
    showingRequests, 
    loading, 
    authLoading,
    handleAssignToSelf, 
    handleStatusUpdate 
  } = useAgentDashboard();

  const handleSendMessage = (requestId: string) => {
    // TODO: Re-enable when TypeScript types are updated
    // Temporarily disabled messaging until types are updated
    /*
    const request = showingRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowMessageModal(true);
    }
    */
    console.log('Message functionality temporarily disabled until database types are updated');
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    const success = await handleStatusUpdate(requestId, newStatus, estimatedDate);
    if (success) {
      setShowStatusModal(false);
      setSelectedRequest(null);
    }
  };

  const handleAcceptShowing = async (requestId: string) => {
    await handleStatusUpdate(requestId, 'scheduled');
  };

  // Organize requests by categories
  const unassignedRequests = showingRequests.filter(req => 
    canBeAssigned(req.status as ShowingStatus) && !req.assigned_agent_name
  );
  
  const myRequests = showingRequests.filter(req => 
    profile && req.assigned_agent_email === (profile as any).email
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
              <div className="text-3xl font-bold text-orange-600 mb-2">{unassignedRequests.length}</div>
              <div className="text-gray-600">Available Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{myRequests.length}</div>
              <div className="text-gray-600">My Assignments</div>
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
            <TabsTrigger value="available">Available ({unassignedRequests.length})</TabsTrigger>
            <TabsTrigger value="mine">My Assignments ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Available Requests</h2>
              <p className="text-gray-600">Assign yourself to showing requests</p>
            </div>

            {unassignedRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No available requests</h3>
                  <p className="text-gray-500">All current requests have been assigned to agents.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {unassignedRequests.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => handleAssignToSelf(request.id)}
                    onUpdateStatus={(status, estimatedDate) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    onSendMessage={() => handleSendMessage(request.id)}
                    showAssignButton={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
              <p className="text-gray-600">Requests assigned to you</p>
            </div>

            {myRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments yet</h3>
                  <p className="text-gray-500">Assign yourself to available requests to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myRequests.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => {}}
                    onUpdateStatus={(status, estimatedDate) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    onSendMessage={() => handleSendMessage(request.id)}
                    onAccept={request.status === 'under_review' ? () => handleAcceptShowing(request.id) : undefined}
                    showAssignButton={false}
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
                    onUpdateStatus={(status, estimatedDate) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    onSendMessage={() => handleSendMessage(request.id)}
                    showAssignButton={false}
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
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedRequest && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* TODO: Re-enable when TypeScript types are updated */}
      {/*
      {selectedRequest && (
        <SendMessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onSendMessage={() => {}}
        />
      )}
      */}
    </div>
  );
};

export default AgentDashboard;
