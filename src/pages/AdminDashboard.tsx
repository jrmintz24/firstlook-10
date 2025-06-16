
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle, Settings, Home } from "lucide-react";
import AdminRequestCard from "@/components/dashboard/AdminRequestCard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { isActiveShowing, isAgentRequested, isUnassignedRequest, type ShowingStatus } from "@/utils/showingStatus";

const AdminDashboard = () => {
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

  // Organize requests by categories
  const unassignedRequests = showingRequests.filter(req => isUnassignedRequest(req));
  const agentRequests = showingRequests.filter(req => isAgentRequested(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

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

  // Header component
  const header = (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FirstLook
              </span>
            </Link>
            <div className="hidden md:block">
              <p className="text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Welcome, Admin!</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats component
  const stats = (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">{unassignedRequests.length}</div>
          <div className="text-sm text-gray-600">Unassigned</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{agentRequests.length}</div>
          <div className="text-sm text-gray-600">Agent Requests</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{activeShowings.length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{completedShowings.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </CardContent>
      </Card>
    </div>
  );

  // Main content (quick actions)
  const mainContent = (
    <Card className="h-fit">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Total Agents</span>
            <Badge variant="secondary">{agents.length}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Total Requests</span>
            <Badge variant="secondary">{showingRequests.length}</Badge>
          </div>
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Sidebar content
  const sidebar = (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Recent Activity</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div>No recent activity</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Section content generators
  const renderEmptyState = (icon: any, title: string, description: string) => (
    <Card className="text-center py-12">
      <CardContent>
        {icon}
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );

  const renderRequestsList = (requests: any[], onApproveAgent?: (id: string) => void) => (
    <div className="grid gap-4">
      {requests.map((request) => (
        <AdminRequestCard
          key={request.id}
          request={request}
          agents={agents}
          onAssign={assignToAgent}
          onUpdateStatus={() => {
            setSelectedRequest(request);
            setShowStatusModal(true);
          }}
          onApprove={approveShowingRequest}
          onApproveAgent={onApproveAgent}
        />
      ))}
    </div>
  );

  // Dashboard sections
  const sections = [
    {
      id: "unassigned",
      label: "Unassigned",
      count: unassignedRequests.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Unassigned Requests</h2>
            <p className="text-gray-600 text-sm">Requests awaiting agent assignment</p>
          </div>
          {unassignedRequests.length === 0 ? (
            renderEmptyState(
              <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
              "No unassigned requests",
              "All current requests have been assigned to agents or are pending agent requests."
            )
          ) : (
            renderRequestsList(unassignedRequests)
          )}
        </div>
      )
    },
    {
      id: "agent-requests",
      label: "Agent Requests",
      count: agentRequests.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Agent Requests</h2>
            <p className="text-gray-600 text-sm">Agents requesting assignment to showings</p>
          </div>
          {agentRequests.length === 0 ? (
            renderEmptyState(
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
              "No pending agent requests",
              "Agent assignment requests will appear here for approval."
            )
          ) : (
            renderRequestsList(agentRequests, approveAgentRequest)
          )}
        </div>
      )
    },
    {
      id: "active",
      label: "Active Showings",
      count: activeShowings.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Active Showings</h2>
            <p className="text-gray-600 text-sm">Confirmed and scheduled showings</p>
          </div>
          {activeShowings.length === 0 ? (
            renderEmptyState(
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
              "No active showings",
              "Confirmed showings will appear here."
            )
          ) : (
            renderRequestsList(activeShowings)
          )}
        </div>
      )
    },
    {
      id: "history",
      label: "History",
      count: completedShowings.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Showing History</h2>
            <p className="text-gray-600 text-sm">Completed showings</p>
          </div>
          {completedShowings.length === 0 ? (
            renderEmptyState(
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
              "No completed showings yet",
              "Completed showings will appear here."
            )
          ) : (
            renderRequestsList(completedShowings)
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <DashboardLayout
        header={header}
        stats={stats}
        mainContent={mainContent}
        sidebar={sidebar}
        sections={sections}
        defaultSection="unassigned"
      />

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
    </>
  );
};

export default AdminDashboard;
