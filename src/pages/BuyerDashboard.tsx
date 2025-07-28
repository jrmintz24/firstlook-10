import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedBuyerDashboard from '@/components/dashboard/UnifiedBuyerDashboard';

const BuyerDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please sign in to access your dashboard
          </h2>
          <p className="text-gray-600">
            You need to be authenticated to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Force cache bust - v2024.07.28
  return <UnifiedBuyerDashboard />;
};

export default BuyerDashboard;