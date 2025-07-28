import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const RedesignedBuyerDashboard = () => {
  console.log('🔍 [DEBUG] RedesignedBuyerDashboard render count:', ++window.redesignedBuyerDashboardRenderCount || (window.redesignedBuyerDashboardRenderCount = 1));
  
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.user_metadata?.first_name || 'there'}!
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            Dashboard is loading... This is a minimal test version.
          </p>
          <div className="text-sm text-gray-500">
            User ID: {user?.id}<br/>
            Email: {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedesignedBuyerDashboard;
