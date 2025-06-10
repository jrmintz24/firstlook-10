

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
    showingRequests, 
    agents, 
    loading, 
    assignToAgent,
    handleStatusUpdate,
    approveShowingRequest,
    approveAgentRequest
  } = useAdminDashboard();

  const handleUpdateStatus = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    const success = await handleStatusUpdate(requestId, newStatus, estimatedDate);
    if (success) {
      setShowStatusModal(false);
      setSelectedRequest(null);
    }
  };

  // Enhanced debugging with more detailed analysis
  console.log('=== ADMIN DASHBOARD ANALYSIS ===');
  console.log('Total showing requests loaded:', showingRequests.length);
  console.log('Raw requests data:', showingRequests);

  // Organize requests by categories with improved filtering and logging
  const unassignedRequests = showingRequests.filter(req => {
    const isUnassigned = isUnassignedRequest(req);
    console.log(`Request ${req.id} unassigned check result:`, isUnassigned);
    return isUnassigned;
  });
  
  const agentRequests = showingRequests.filter(req => {
    const isAgentReq = isAgentRequested(req.status as ShowingStatus);
    console.log(`Request ${req.id} agent requested check result:`, isAgentReq);
    return isAgentReq;
  });
  
  const activeShowings = showingRequests.filter(req => {
    const isActive = isActiveShowing(req.status as ShowingStatus);
    console.log(`Request ${req.id} active showing check result:`, isActive);
    return isActive;
  });

  console.log('=== FILTERING RESULTS ===');
  console.log('Filtered results:', {
    total: showingRequests.length,
    unassigned: unassignedRequests.length,
    agentRequests: agentRequests.length,
    activeShowings: activeShowings.length
  });
  console.log('Unassigned requests:', unassignedRequests);
  console.log('Agent requests:', agentRequests);
  console.log('Active showings:', activeShowings);
  console.log('=== END ANALYSIS ===');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading admin dashboard...</div>
          <div className="text-sm text-gray-600">Loading dashboard data...</div>
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
                <span>Welcome, Admin!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Debug Information */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <p className="text-sm text-yellow-700 mb-2">
            Total requests: {showingRequests.length} | 
            Unassigned: {unassignedRequests.length} | 
            Agent requests: {agentRequests.length} | 
            Active: {activeShowings.length}
          </p>
          <div className="mt-2 text-xs text-yellow-600">
            <strong>Request Details:</strong>
            {showingRequests.length === 0 ? (
              <div className="ml-2 text-red-600">No requests found! Check database connection and RLS policies.</div>
            ) : (
              showingRequests.map(req => (
                <div key={req.id} className="ml-2 mb-1 p-2 bg-yellow-100 rounded">
                  <div><strong>ID:</strong> {req.id}</div>
                  <div><strong>Status:</strong> {req.status}</div>
                  <div><strong>Assigned Agent:</strong> {req.assigned_agent_name || 'None'}</div>
                  <div><strong>Requested Agent:</strong> {req.requested_agent_name || 'None'}</div>
                  <div><strong>Property:</strong> {req.property_address}</div>
                </div>
              ))
            )}
          </div>
        </div>

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
                  {showingRequests.length === 0 ? (
                    <div>
                      <p className="text-gray-500 mb-4">No requests found in the system.</p>
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        This could indicate:
                        <ul className="mt-2 text-left list-disc list-inside">
                          <li>Database connection issues</li>
                          <li>RLS policies preventing data access</li>
                          <li>No requests have been submitted yet</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500">All current requests have been assigned to agents or are pending agent requests.</p>
                      <div className="mt-4 text-sm text-gray-400">
                        Total requests in system: {showingRequests.length}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {unassignedRequests.map((request) => (
                  <AdminRequestCard
                    key={request.id}
                    request={request}
                    agents={agents}
                    onAssign={assignToAgent}
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
                    onAssign={assignToAgent}
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
                    onAssign={assignToAgent}
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
                      onAssign={assignToAgent}
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
