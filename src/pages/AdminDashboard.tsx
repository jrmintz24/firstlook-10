
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, UserPlus, Clock, CheckCircle, AlertCircle, Settings, Shield } from "lucide-react";
import AdminRequestCard from "@/components/dashboard/AdminRequestCard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import ModernHeader from "@/components/dashboard/ModernHeader";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import ModernSidebar from "@/components/dashboard/ModernSidebar";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900 mb-2">Loading admin dashboard...</div>
          <div className="text-sm text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Modern admin stats
  const adminStats = [
    {
      title: "Unassigned",
      value: unassignedRequests.length,
      change: unassignedRequests.length > 0 ? { value: "Need attention", trend: 'neutral' as const } : undefined,
      icon: UserPlus,
      color: 'orange' as const
    },
    {
      title: "Agent Requests",
      value: agentRequests.length,
      change: agentRequests.length > 0 ? { value: "Pending approval", trend: 'up' as const } : undefined,
      icon: AlertCircle,
      color: 'blue' as const
    },
    {
      title: "Active Showings",
      value: activeShowings.length,
      change: activeShowings.length > 0 ? { value: "In progress", trend: 'up' as const } : undefined,
      icon: Clock,
      color: 'purple' as const
    },
    {
      title: "Completed",
      value: completedShowings.length,
      change: completedShowings.length > 0 ? { value: "Success", trend: 'up' as const } : undefined,
      icon: CheckCircle,
      color: 'green' as const
    }
  ];

  const renderEmptyState = (icon: any, title: string, description: string) => (
    <Card className="text-center py-12 border-0 shadow-sm">
      <CardContent>
        {icon}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
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

  // Dashboard sections - convert to object
  const sectionsArray = [
    {
      id: "unassigned",
      title: "Unassigned",
      count: unassignedRequests.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Unassigned Requests</h2>
            <p className="text-gray-600 text-sm">Requests awaiting agent assignment</p>
          </div>
          {unassignedRequests.length === 0 ? (
            renderEmptyState(
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
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
      title: "Agent Requests",
      count: agentRequests.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Agent Requests</h2>
            <p className="text-gray-600 text-sm">Agents requesting assignment to showings</p>
          </div>
          {agentRequests.length === 0 ? (
            renderEmptyState(
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
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
      title: "Active Showings",
      count: activeShowings.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Showings</h2>
            <p className="text-gray-600 text-sm">Confirmed and scheduled showings</p>
          </div>
          {activeShowings.length === 0 ? (
            renderEmptyState(
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
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
      title: "History",
      count: completedShowings.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Showing History</h2>
            <p className="text-gray-600 text-sm">Completed showings</p>
          </div>
          {completedShowings.length === 0 ? (
            renderEmptyState(
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />,
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

  // Convert array to object for DashboardLayout
  const sections = sectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  // Header component
  const header = (
    <ModernHeader
      title="Admin Dashboard"
      subtitle="System overview and management"
      displayName="Admin"
      userType="admin"
    />
  );

  // Stats component
  const stats = <ModernStatsGrid stats={adminStats} />;

  // Main content
  const mainContent = (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-600">Monitor and manage all showing requests and agent activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">System Health</h3>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-medium">{showingRequests.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Agents</span>
                <span className="font-medium">{agents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">
                  {showingRequests.length > 0 ? Math.round((completedShowings.length / showingRequests.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Quick Actions</h3>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Manage Agents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Sidebar content
  const sidebar = (
    <ModernSidebar 
      quickStats={[
        { label: "Total Agents", value: agents.length, icon: User },
        { label: "Pending", value: unassignedRequests.length + agentRequests.length, icon: Clock },
        { label: "Success Rate", value: `${showingRequests.length > 0 ? Math.round((completedShowings.length / showingRequests.length) * 100) : 0}%`, icon: CheckCircle }
      ]}
      activities={[
        ...unassignedRequests.slice(0, 2).map(req => ({
          id: req.id,
          type: 'reminder' as const,
          title: 'Unassigned Request',
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
