
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import AdminRequestCard from "@/components/dashboard/AdminRequestCard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { isActiveShowing, isAgentRequested, isUnassignedRequest, type ShowingStatus } from "@/utils/showingStatus";

const AdminDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const { 
    profile, 
    showingRequests, 
    agents, 
    loading, 
    authLoading,
    handleAssignAgent,
    handleStatusUpdate,
    handleApprove,
    approveAgentRequest
  } = useAdminDashboard();

  const handleUpdateStatus = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    const success = await handleStatusUpdate(requestId, newStatus, estimatedDate);
    if (success) {
      setShowStatusModal(false);
      setSelectedRequest(null);
    }
  };

  // Organize requests by categories with improved filtering
  const unassignedRequests = showingRequests.filter(req => isUnassignedRequest(req));
  
  const agentRequests = showingRequests.filter(req => isAgentRequested(req.status as ShowingStatus));
  
  const activeShowings = showingRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading admin dashboard...</div>
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
          <div className="text-sm text-gray-600 mb-4">You need to be an admin to access this dashboard.</div>
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
              <p className="text-gray-600 mt-1">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-800">Admin</Badge>
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
              <div className="text-gray-600">Unassigned Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{agentRequests.length}</div>
              <div className="text-gray-600">Agent Requests</div>
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
        <Tabs defaultValue="unassigned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="unassigned">Unassigned ({unassignedRequests.length})</TabsTrigger>
            <TabsTrigger value="agent-requests">Agent Requests ({agentRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Unassigned Requests</h2>
              <p className="text-gray-600">Requests awaiting agent assignment</p>
            </div>

            {unassignedRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No unassigned requests</h3>
                  <p className="text-gray-500">All current requests have been assigned to agents.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {unassignedRequests.map((request) => (
                  <AdminRequestCard
                    key={request.id}
                    request={request}
                    agents={agents}
                    onAssign={handleAssignAgent}
                    onUpdateStatus={(status) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="agent-requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Agent Requests</h2>
              <p className="text-gray-600">Agents requesting assignment to showings</p>
            </div>

            {agentRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending agent requests</h3>
                  <p className="text-gray-500">Agent assignment requests will appear here for approval.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {agentRequests.map((request) => (
                  <AdminRequestCard
                    key={request.id}
                    request={request}
                    agents={agents}
                    onAssign={handleAssignAgent}
                    onUpdateStatus={(status) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    onApproveAgent={approveAgentRequest}
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
                  <AdminRequestCard
                    key={request.id}
                    request={request}
                    agents={agents}
                    onAssign={handleAssignAgent}
                    onUpdateStatus={(status) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
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
                  <p className="text-gray-500">Completed showings will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {showingRequests
                  .filter(req => req.status === 'completed')
                  .map((request) => (
                    <AdminRequestCard
                      key={request.id}
                      request={request}
                      agents={agents}
                      onAssign={handleAssignAgent}
                      onUpdateStatus={() => {}}
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
    </div>
  );
};

export default AdminDashboard;
