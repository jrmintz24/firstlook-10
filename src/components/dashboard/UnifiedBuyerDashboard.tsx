import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShowingListTab from './ShowingListTab';
import { PortfolioTab } from './PortfolioTab';
import DashboardStats from './DashboardStats';
import { useBuyerDashboard } from '@/hooks/useBuyerDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboardLayout from '@/components/mobile/MobileDashboardLayout';

const UnifiedBuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { user } = useAuth();
  const { 
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    agreements
  } = useBuyerDashboard();
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


  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      description: 'Requested tours awaiting confirmation',
      count: pendingRequests?.length || 0,
      color: 'orange'
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      description: 'Scheduled tours',
      count: activeShowings?.length || 0,
      color: 'blue'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      description: 'Past tours and history',
      count: completedShowings?.length || 0,
      color: 'green'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: FolderOpen,
      description: 'Favorites, offers, and agent connections',
      count: 0, // Will be updated when favorites/offers are implemented
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
              title="Pending Tour Requests"
              showings={pendingRequests || []}
              emptyIcon={Clock}
              emptyTitle="No pending tour requests"
              emptyDescription="Start browsing properties to schedule your first tour!"
              emptyButtonText="Browse Properties"
              onRequestShowing={() => {/* TODO: Implement */}}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
              onConfirmShowing={handleConfirmShowing}
              userType="buyer"
              currentUserId={user?.id}
              agreements={agreements}
              onSignAgreement={handleAgreementSign}
              showActions={true}
            />
          );
        case 'upcoming':
          return (
            <ShowingListTab 
              title="Upcoming Tours"
              showings={activeShowings || []}
              emptyIcon={Calendar}
              emptyTitle="No upcoming tours"
              emptyDescription="No upcoming tours scheduled."
              emptyButtonText="Schedule Tour"
              onRequestShowing={() => {/* TODO: Implement */}}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
              userType="buyer"
              currentUserId={user?.id}
              agreements={agreements}
              showActions={true}
            />
          );
        case 'completed':
          return (
            <ShowingListTab 
              title="Completed Tours"
              showings={completedShowings || []}
              emptyIcon={CheckCircle}
              emptyTitle="No completed tours"
              emptyDescription="No completed tours yet. Your tour history will appear here."
              emptyButtonText="Schedule Tour"
              onRequestShowing={() => {/* TODO: Implement */}}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
              userType="buyer"
              currentUserId={user?.id}
              showActions={false}
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
        pendingRequests={pendingRequests || []}
        activeShowings={activeShowings || []}
        completedShowings={completedShowings || []}
        favorites={[]} // TODO: Implement favorites when available
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tab.color === 'orange' ? 'bg-orange-100' : tab.color === 'blue' ? 'bg-blue-100' : tab.color === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                        <Icon className={`w-6 h-6 ${tab.color === 'orange' ? 'text-orange-600' : tab.color === 'blue' ? 'text-blue-600' : tab.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                      </div>
                      <div>
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
                    title="Pending Tour Requests"
                    showings={pendingRequests || []}
                    emptyIcon={Clock}
                    emptyTitle="No pending tour requests"
                    emptyDescription="Start browsing properties to schedule your first tour!"
                    emptyButtonText="Browse Properties"
                    onRequestShowing={() => {/* TODO: Implement */}}
                    onCancelShowing={handleCancelShowing}
                    onRescheduleShowing={handleRescheduleShowing}
                    onConfirmShowing={handleConfirmShowing}
                    userType="buyer"
                    currentUserId={user?.id}
                    agreements={agreements}
                    onSignAgreement={handleAgreementSign}
                    showActions={true}
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
                    title="Upcoming Tours"
                    showings={activeShowings || []}
                    emptyIcon={Calendar}
                    emptyTitle="No upcoming tours"
                    emptyDescription="No upcoming tours scheduled."
                    emptyButtonText="Schedule Tour"
                    onRequestShowing={() => {/* TODO: Implement */}}
                    onCancelShowing={handleCancelShowing}
                    onRescheduleShowing={handleRescheduleShowing}
                    userType="buyer"
                    currentUserId={user?.id}
                    agreements={agreements}
                    showActions={true}
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
                    title="Completed Tours"
                    showings={completedShowings || []}
                    emptyIcon={CheckCircle}
                    emptyTitle="No completed tours"
                    emptyDescription="No completed tours yet. Your tour history will appear here."
                    emptyButtonText="Schedule Tour"
                    onRequestShowing={() => {/* TODO: Implement */}}
                    onCancelShowing={handleCancelShowing}
                    onRescheduleShowing={handleRescheduleShowing}
                    userType="buyer"
                    currentUserId={user?.id}
                    showActions={false}
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