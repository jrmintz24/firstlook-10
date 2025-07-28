import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";

const RedesignedBuyerDashboard = () => {
  console.log('🔍 [DEBUG] RedesignedBuyerDashboard render count:', ++window.redesignedBuyerDashboardRenderCount || (window.redesignedBuyerDashboardRenderCount = 1));
  
  const { user } = useAuth();
  
  // TEST: Add useOptimizedBuyerLogic hook
  const {
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    showingCounts
  } = useOptimizedBuyerLogic();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.user_metadata?.first_name || 'there'}!
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            Dashboard with useOptimizedBuyerLogic hook test.
          </p>
          <div className="text-sm text-gray-500">
            User ID: {user?.id}<br/>
            Email: {user?.email}<br/>
            Loading: {loading ? 'Yes' : 'No'}<br/>
            Pending: {showingCounts?.pending || 0}<br/>
            Active: {showingCounts?.active || 0}<br/>
            Completed: {showingCounts?.completed || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedesignedBuyerDashboard;
