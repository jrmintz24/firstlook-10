import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";

const RedesignedBuyerDashboard = () => {
  console.log('🔍 [DEBUG] RedesignedBuyerDashboard render count:', ++window.redesignedBuyerDashboardRenderCount || (window.redesignedBuyerDashboardRenderCount = 1));
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  
  // TEST: Add useOptimizedBuyerLogic hook
  const {
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    showingCounts
  } = useOptimizedBuyerLogic();

  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      count: showingCounts?.pending || 0,
      color: 'orange'
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      count: showingCounts?.active || 0,
      color: 'blue'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: showingCounts?.completed || 0,
      color: 'green'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: FolderOpen,
      count: 0,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.user_metadata?.first_name || 'there'}!
        </h1>
        
        {/* Debug Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <p className="text-gray-600 mb-2">DEBUG: Dashboard with basic UI components</p>
          <div className="text-sm text-gray-500">
            Loading: {loading ? 'Yes' : 'No'} | 
            Pending: {showingCounts?.pending || 0} | 
            Active: {showingCounts?.active || 0} | 
            Completed: {showingCounts?.completed || 0}
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-gray-900">{tab.count}</div>
                        <div className="text-sm text-gray-600">{tab.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Basic Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pending Tours</h3>
                <p className="text-gray-600">Found {pendingRequests?.length || 0} pending requests</p>
                {pendingRequests?.slice(0, 3).map((request, i) => (
                  <div key={i} className="mt-2 p-2 bg-gray-50 rounded">
                    Property: {request.property_address || 'N/A'}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Tours</h3>
                <p className="text-gray-600">Found {activeShowings?.length || 0} upcoming tours</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Completed Tours</h3>
                <p className="text-gray-600">Found {completedShowings?.length || 0} completed tours</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                <p className="text-gray-600">Portfolio features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RedesignedBuyerDashboard;
