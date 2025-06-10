
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import AdminRequestCard, { ShowingRequest } from "@/components/dashboard/AdminRequestCard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { isActiveShowing, canBeAssigned, isAgentRequested, ShowingStatus } from "@/utils/showingStatus";

const AdminDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<ShowingRequest | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { showingRequests, agents, loading, assignToAgent, handleStatusUpdate, approveShowingRequest, approveAgentRequest } = useAdminDashboard();

  const unassigned = showingRequests.filter((r) => canBeAssigned(r.status as ShowingStatus) && !r.assigned_agent_name);
  const active = showingRequests.filter((r) => isActiveShowing(r.status as ShowingStatus));
  const pendingApproval = showingRequests.filter((r) => r.status === 'pending_admin_approval');
  const agentRequests = showingRequests.filter((r) => isAgentRequested(r.status as ShowingStatus));

  const handleUpdateStatus = async (id: string, newStatus: string, estimated?: string) => {
    const success = await handleStatusUpdate(id, newStatus, estimated);
    if (success) {
      setShowStatusModal(false);
      setSelectedRequest(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FirstLook
            </Link>
            <p className="text-gray-600 mt-1">Admin Dashboard</p>
          </div>
          <Badge className="bg-red-100 text-red-800">Admin</Badge>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({showingRequests.length})</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned ({unassigned.length})</TabsTrigger>
            <TabsTrigger value="agent_requests">Agent Requests ({agentRequests.length})</TabsTrigger>
            <TabsTrigger value="pending_approval">Pending Approval ({pendingApproval.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            {showingRequests.map((req) => (
              <AdminRequestCard
                key={req.id}
                request={req}
                agents={agents}
                onAssign={assignToAgent}
                onUpdateStatus={() => {
                  setSelectedRequest(req);
                  setShowStatusModal(true);
                }}
                onApprove={approveShowingRequest}
                onApproveAgent={approveAgentRequest}
              />
            ))}
          </TabsContent>
          <TabsContent value="unassigned" className="space-y-6">
            {unassigned.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>No unassigned requests</CardContent>
              </Card>
            ) : (
              unassigned.map((req) => (
                <AdminRequestCard
                  key={req.id}
                  request={req}
                  agents={agents}
                  onAssign={assignToAgent}
                  onUpdateStatus={() => {
                    setSelectedRequest(req);
                    setShowStatusModal(true);
                  }}
                  onApprove={approveShowingRequest}
                  onApproveAgent={approveAgentRequest}
                />
              ))
            )}
          </TabsContent>
          <TabsContent value="agent_requests" className="space-y-6">
            {agentRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>No agent requests pending approval</CardContent>
              </Card>
            ) : (
              agentRequests.map((req) => (
                <AdminRequestCard
                  key={req.id}
                  request={req}
                  agents={agents}
                  onAssign={assignToAgent}
                  onUpdateStatus={() => {
                    setSelectedRequest(req);
                    setShowStatusModal(true);
                  }}
                  onApprove={approveShowingRequest}
                  onApproveAgent={approveAgentRequest}
                />
              ))
            )}
          </TabsContent>
          <TabsContent value="pending_approval" className="space-y-6">
            {pendingApproval.map((req) => (
              <AdminRequestCard
                key={req.id}
                request={req}
                agents={agents}
                onAssign={assignToAgent}
                onApprove={approveShowingRequest}
                onApproveAgent={approveAgentRequest}
                onUpdateStatus={() => {
                  setSelectedRequest(req);
                  setShowStatusModal(true);
                }}
              />
            ))}
          </TabsContent>
          <TabsContent value="active" className="space-y-6">
            {active.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>No active showings</CardContent>
              </Card>
            ) : (
              active.map((req) => (
                <AdminRequestCard
                  key={req.id}
                  request={req}
                  agents={agents}
                  onAssign={assignToAgent}
                  onUpdateStatus={() => {
                    setSelectedRequest(req);
                    setShowStatusModal(true);
                  }}
                  onApprove={approveShowingRequest}
                  onApproveAgent={approveAgentRequest}
                />
              ))
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
