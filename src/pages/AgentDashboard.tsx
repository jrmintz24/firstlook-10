
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FullPageLoading, ErrorState } from "@/components/ui/loading-states";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import AgentDashboardHeader from "@/components/dashboard/agent/AgentDashboardHeader";
import AgentDashboardStats from "@/components/dashboard/agent/AgentDashboardStats";
import AgentDashboardTabs from "@/components/dashboard/agent/AgentDashboardTabs";

const AgentDashboard = () => {
  const {
    // Data
    profile,
    unassignedRequests,
    myRequests,
    activeShowings,
    
    // Loading states
    authLoading,
    isLoading,
    
    // Errors
    requestsError,
    profileError,
    
    // Modal state
    selectedRequest,
    showStatusModal,
    
    // Actions
    handleAssignToSelf,
    handleStatusUpdate,
    openStatusModal,
    closeStatusModal,
    
    // User info
    currentUser,
    isAuthenticated
  } = useAgentDashboard();

  // Show loading while auth is loading
  if (authLoading) {
    return <FullPageLoading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your agent dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle errors
  if (requestsError || profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <ErrorState 
          error={requestsError || profileError || new Error('Unknown error')}
          onRetry={() => window.location.reload()}
          title="Failed to load dashboard"
        />
      </div>
    );
  }

  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'Agent';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <AgentDashboardHeader displayName={displayName} />

      <div className="container mx-auto px-4 py-8">
        <AgentDashboardStats
          unassignedCount={unassignedRequests.length}
          myRequestsCount={myRequests.length}
          activeShowingsCount={activeShowings.length}
          completedCount={myRequests.filter(r => r.status === 'completed').length}
        />

        <AgentDashboardTabs
          unassignedRequests={unassignedRequests}
          myRequests={myRequests}
          activeShowings={activeShowings}
          profile={profile}
          currentUser={currentUser}
          displayName={displayName}
          isLoading={isLoading}
          onAssignToSelf={handleAssignToSelf}
          onUpdateStatus={openStatusModal}
        />
      </div>

      {/* Status Update Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={closeStatusModal}
          request={selectedRequest}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AgentDashboard;
