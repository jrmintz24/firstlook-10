import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Ultra-simple dashboard test to isolate the issue
const SimpleDashboardTest = () => {
  const { user, loading: authLoading } = useAuth();
  
  console.log('🧪 [TEST] SimpleDashboardTest render');
  console.log('🧪 [TEST] Auth loading:', authLoading);
  console.log('🧪 [TEST] User:', user?.id, user?.email);
  
  if (authLoading) {
    return <div className="p-8">Loading auth...</div>;
  }
  
  if (!user) {
    return <div className="p-8">No user found</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Simple Dashboard Test</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
          <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        </div>
        
        <div className="mt-6 bg-green-100 p-4 rounded-lg">
          <p className="text-green-800">✅ If you can see this, the basic dashboard structure works!</p>
          <p className="text-green-700 text-sm mt-2">This means the issue is in the hooks or complex components.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboardTest;