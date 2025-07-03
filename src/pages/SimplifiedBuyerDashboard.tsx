
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ShowingRequestCard } from "@/components/dashboard/ShowingRequestCard";
import { PropertyRequestWizard } from "@/components/PropertyRequestWizard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStableBuyerData } from "@/hooks/useStableBuyerData";
import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import { OptimizedDashboardSkeleton } from "@/components/dashboard/OptimizedDashboardSkeleton";

const SimplifiedBuyerDashboard = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { 
    pendingRequests, 
    activeShowings, 
    completedShowings, 
    loading, 
    currentUser,
    forceRefresh
  } = useStableBuyerData();

  if (loading) {
    return <OptimizedDashboardSkeleton />;
  }

  const handleRequestSuccess = async () => {
    console.log('Tour request submitted, refreshing data...');
    await forceRefresh();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <DashboardHeader />
          <div className="flex items-center gap-4">
            <ConnectionStatus 
              isConnected={false} // WebSocket is failing, show polling status
              onRefresh={forceRefresh}
            />
            <Button onClick={() => setIsRequestModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Request Tour
            </Button>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <ShowingRequestCard 
                  key={request.id} 
                  request={request}
                  onUpdate={forceRefresh}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Showings */}
        {activeShowings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Scheduled Tours</h2>
            <div className="grid gap-4">
              {activeShowings.map((request) => (
                <ShowingRequestCard 
                  key={request.id} 
                  request={request}
                  onUpdate={forceRefresh}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Showings */}
        {completedShowings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tour History</h2>
            <div className="grid gap-4">
              {completedShowings.slice(0, 5).map((request) => (
                <ShowingRequestCard 
                  key={request.id} 
                  request={request}
                  onUpdate={forceRefresh}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingRequests.length === 0 && activeShowings.length === 0 && completedShowings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No tours yet</h3>
            <p className="text-gray-500 mb-4">Get started by requesting your first property tour!</p>
            <Button onClick={() => setIsRequestModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Request Your First Tour
            </Button>
          </div>
        )}

        <PropertyRequestWizard
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSuccess={handleRequestSuccess}
        />
      </div>
    </DashboardLayout>
  );
};

export default SimplifiedBuyerDashboard;
