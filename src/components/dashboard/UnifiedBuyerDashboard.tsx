import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowingListTab } from './ShowingListTab';
import { PortfolioTab } from './PortfolioTab';
import { DashboardStats } from './DashboardStats';
import { useBuyerDashboard } from '@/hooks/useBuyerDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboardLayout from '@/components/mobile/MobileDashboardLayout';

const UnifiedBuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { user } = useAuth();
  const { data, loading, error } = useBuyerDashboard(user?.id);
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">Unable to load dashboard. Please refresh the page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      description: 'Requested tours awaiting confirmation',
      count: data?.pendingCount || 0,
      color: 'orange'
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      description: 'Scheduled tours',
      count: data?.upcomingCount || 0,
      color: 'blue'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      description: 'Past tours and history',
      count: data?.completedCount || 0,
      color: 'green'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: FolderOpen,
      description: 'Favorites, offers, and agent connections',
      count: (data?.favoritesCount || 0) + (data?.offersCount || 0),
      color: 'purple'
    }
  ];

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      orange: isActive 
        ? 'bg-orange-100 text-orange-700 border-orange-300' 
        : 'text-orange-600 hover:bg-orange-50',
      blue: isActive 
        ? 'bg-blue-100 text-blue-700 border-blue-300' 
        : 'text-blue-600 hover:bg-blue-50',
      green: isActive 
        ? 'bg-green-100 text-green-700 border-green-300' 
        : 'text-green-600 hover:bg-green-50',
      purple: isActive 
        ? 'bg-purple-100 text-purple-700 border-purple-300' 
        : 'text-purple-600 hover:bg-purple-50'
    };
    return colorMap[color as keyof typeof colorMap] || '';
  };

  // Render mobile version
  if (isMobile) {
    const renderMobileTabContent = () => {
      switch (activeTab) {
        case 'pending':
          return (
            <ShowingListTab 
              userType="buyer" 
              statusFilter="pending"
              emptyStateMessage="No pending tour requests. Start browsing properties to schedule your first tour!"
              emptyStateAction="Browse Properties"
            />
          );
        case 'upcoming':
          return (
            <ShowingListTab 
              userType="buyer" 
              statusFilter="confirmed"
              emptyStateMessage="No upcoming tours scheduled."
              showEnhancedView={true}
            />
          );
        case 'completed':
          return (
            <ShowingListTab 
              userType="buyer" 
              statusFilter="completed"
              emptyStateMessage="No completed tours yet. Your tour history will appear here."
              showPostShowingActions={true}
            />
          );
        case 'portfolio':
          return <PortfolioTab buyerId={user?.id} />;
        default:
          return <div>Tab content not found</div>;
      }
    };

    return (
      <MobileDashboardLayout
        user={user}
        pendingRequests={data?.pendingRequests || []}
        activeShowings={data?.activeShowings || []}
        completedShowings={data?.completedShowings || []}
        favorites={data?.favorites || []}
        onRequestTour={() => {/* TODO: Implement */}}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      >
        {renderMobileTabContent()}
      </MobileDashboardLayout>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'there'}
          </h1>
          <p className="text-gray-600">
            Track your home tour journey and manage your property interests
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats data={data} />
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white rounded-lg shadow-sm">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-2 bg-transparent">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      flex flex-col items-center p-4 space-y-2 rounded-lg transition-all duration-200
                      data-[state=active]:shadow-sm border-2 border-transparent
                      ${getTabColorClasses(tab.color, isActive)}
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 min-w-[20px] h-5"
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-center opacity-75 hidden md:block">
                      {tab.description}
                    </p>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="pending" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Pending Tour Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShowingListTab 
                    userType="buyer" 
                    statusFilter="pending"
                    emptyStateMessage="No pending tour requests. Start browsing properties to schedule your first tour!"
                    emptyStateAction="Browse Properties"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Tours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShowingListTab 
                    userType="buyer" 
                    statusFilter="confirmed"
                    emptyStateMessage="No upcoming tours scheduled."
                    showEnhancedView={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Completed Tours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShowingListTab 
                    userType="buyer" 
                    statusFilter="completed"
                    emptyStateMessage="No completed tours yet. Your tour history will appear here."
                    showPostShowingActions={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              <PortfolioTab buyerId={user?.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedBuyerDashboard;