
import { useAdminAuth } from "./useAdminAuth";
import { useShowingRequestsAdmin } from "./useShowingRequestsAdmin";
import { useAgentManagement } from "./useAgentManagement";

export const useAdminDashboard = () => {
  const { profile, loading: authLoading } = useAdminAuth();
  const { 
    showingRequests, 
    loading: requestsLoading, 
    handleStatusUpdate, 
    approveShowingRequest,
    fetchShowingRequests
  } = useShowingRequestsAdmin();
  const { 
    agents, 
    loading: agentsLoading, 
    assignToAgent, 
    approveAgentRequest,
    fetchAgents
  } = useAgentManagement();

  const refreshData = async () => {
    await Promise.all([fetchShowingRequests(), fetchAgents()]);
  };

  // Update the assignToAgent to refresh data after assignment
  const handleAssignToAgent = async (requestId: string, agent: any) => {
    const success = await assignToAgent(requestId, agent);
    if (success) {
      await refreshData();
    }
    return success;
  };

  // Update the approveAgentRequest to refresh data after approval
  const handleApproveAgentRequest = async (requestId: string) => {
    const success = await approveAgentRequest(requestId);
    if (success) {
      await refreshData();
    }
    return success;
  };

  const loading = authLoading || requestsLoading || agentsLoading;

  return { 
    showingRequests, 
    agents, 
    loading, 
    assignToAgent: handleAssignToAgent,
    handleStatusUpdate,
    approveShowingRequest,
    approveAgentRequest: handleApproveAgentRequest
  };
};
