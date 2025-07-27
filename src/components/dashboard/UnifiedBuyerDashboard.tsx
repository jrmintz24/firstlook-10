import React, { useState, useCallback } from 'react';
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
import CreateTestAgentConnection from '@/components/dev/CreateTestAgentConnection';
import SignAgreementModal from './SignAgreementModal';
import ModernTourSchedulingModal from '@/components/ModernTourSchedulingModal';

const UnifiedBuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
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
    agreements,
    buyerActions = {}
  } = useBuyerDashboard();
  const isMobile = useIsMobile();

  // Memoize callback functions to prevent unnecessary re-renders
  const handleRequestShowing = useCallback(() => {
    // TODO: Implement
  }, []);

  const handleScheduleTour = useCallback((propertyAddress: string, mlsId?: string) => {
    // Open modal with property info
    setSelectedProperty({
      property_address: propertyAddress,
      mls_id: mlsId
    });
    setShowScheduleModal(true);
  }, []);

  const handleScheduleModalClose = () => {
    setShowScheduleModal(false);
    setSelectedProperty(null);
  };

  const handleScheduleSuccess = async () => {
    setShowScheduleModal(false);
    setSelectedProperty(null);
    // Refresh data if needed
  };

  const memoizedHandleCancel = useCallback((id: string) => {
    handleCancelShowing(id);
  }, [handleCancelShowing]);

  const memoizedHandleReschedule = useCallback((id: string) => {
    handleRescheduleShowing(id);
  }, [handleRescheduleShowing]);

  const memoizedHandleConfirm = useCallback((request: any) => {
    handleConfirmShowing(request);
  }, [handleConfirmShowing]);

  const memoizedHandleAgreementSign = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setAgreementModalOpen(true);
  }, []);

  const handleActualAgreementSign = useCallback(async (name: string) => {
    if (!selectedShowing) {
      console.error('No selected showing for agreement signing');
      return;
    }

    try {
      console.log('Starting agreement signing process for:', selectedShowing.id);
      await handleAgreementSign(selectedShowing);
      console.log('Agreement signing completed successfully');
      
      // Close modal and clear state
      setAgreementModalOpen(false);
      setSelectedShowing(null);
    } catch (error) {
      console.error('Error in handleActualAgreementSign:', error);
      // Close modal even on error to prevent dashboard from being stuck
      setAgreementModalOpen(false);
      setSelectedShowing(null);
      // The error toast will be shown by handleAgreementSign
    }
  }, [selectedShowing, handleAgreementSign]);

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
              onRequestShowing={handleRequestShowing}
              onCancelShowing={memoizedHandleCancel}
              onRescheduleShowing={memoizedHandleReschedule}
              onConfirmShowing={memoizedHandleConfirm}
              userType="buyer"
              currentUserId={user?.id}
              agreements={agreements}
              onSignAgreement={memoizedHandleAgreementSign}
              buyerActions={buyerActions}
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
              buyerActions={buyerActions}
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
              buyerActions={buyerActions}
              showActions={false}
            />
          );
        case 'portfolio':
          return <PortfolioTab buyerId={user?.id} onScheduleTour={handleScheduleTour} />;
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
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <Card 
                  key={index} 
                  className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] border border-gray-100/60 bg-white/80 backdrop-blur-sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm ${
                        tab.color === 'orange' ? 'bg-gradient-to-br from-orange-100 to-amber-50 group-hover:from-orange-200 group-hover:to-amber-100' :
                        tab.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-indigo-50 group-hover:from-blue-200 group-hover:to-indigo-100' :
                        tab.color === 'green' ? 'bg-gradient-to-br from-green-100 to-emerald-50 group-hover:from-green-200 group-hover:to-emerald-100' :
                        'bg-gradient-to-br from-purple-100 to-pink-50 group-hover:from-purple-200 group-hover:to-pink-100'
                      }`}>
                        <Icon className={`w-7 h-7 transition-all duration-300 group-hover:scale-110 ${
                          tab.color === 'orange' ? 'text-orange-600 group-hover:text-orange-700' :
                          tab.color === 'blue' ? 'text-blue-600 group-hover:text-blue-700' :
                          tab.color === 'green' ? 'text-green-600 group-hover:text-green-700' :
                          'text-purple-600 group-hover:text-purple-700'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 tracking-tight">{tab.count}</div>
                        <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{tab.label}</div>
                      </div>
                      {/* Subtle arrow indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ${
                        tab.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                        tab.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        tab.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden backdrop-blur-sm">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-3 bg-transparent gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      group flex flex-col items-center p-4 space-y-2 rounded-xl transition-all duration-300 ease-out
                      border-2 border-transparent cursor-pointer relative overflow-hidden
                      hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                      ${isActive 
                        ? `${getTabColorClasses(tab.color, true)} shadow-md transform scale-[1.01]` 
                        : 'bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200/60 text-gray-600 hover:text-gray-800'
                      }
                    `}
                  >
                    {/* Subtle gradient overlay for depth */}
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                      tab.color === 'orange' ? 'from-orange-400 to-amber-500' :
                      tab.color === 'blue' ? 'from-blue-400 to-indigo-500' :
                      tab.color === 'green' ? 'from-green-400 to-emerald-500' :
                      'from-purple-400 to-pink-500'
                    }`} />
                    
                    <div className="flex items-center space-x-2 relative z-10">
                      <Icon className={`h-5 w-5 transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`} />
                      <span className="font-semibold tracking-tight">{tab.label}</span>
                      {tab.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs px-2.5 py-1 min-w-[24px] h-6 font-bold rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/90 text-gray-800 shadow-sm' 
                              : 'bg-white/80 text-gray-700 group-hover:bg-white group-hover:shadow-sm'
                          }`}
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs text-center transition-all duration-300 hidden md:block leading-tight ${
                      isActive ? 'opacity-90' : 'opacity-60 group-hover:opacity-75'
                    }`}>
                      {tab.description}
                    </p>
                    
                    {/* Active indicator line */}
                    {isActive && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300 ${
                        tab.color === 'orange' ? 'bg-orange-500' :
                        tab.color === 'blue' ? 'bg-blue-500' :
                        tab.color === 'green' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
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
                    onRequestShowing={handleRequestShowing}
                    onCancelShowing={memoizedHandleCancel}
                    onRescheduleShowing={memoizedHandleReschedule}
                    onConfirmShowing={memoizedHandleConfirm}
                    userType="buyer"
                    currentUserId={user?.id}
                    agreements={agreements}
                    onSignAgreement={memoizedHandleAgreementSign}
                    buyerActions={buyerActions}
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
                    onRequestShowing={handleRequestShowing}
                    onCancelShowing={memoizedHandleCancel}
                    onRescheduleShowing={memoizedHandleReschedule}
                    userType="buyer"
                    currentUserId={user?.id}
                    agreements={agreements}
                    buyerActions={buyerActions}
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
                    onRequestShowing={handleRequestShowing}
                    onCancelShowing={memoizedHandleCancel}
                    onRescheduleShowing={memoizedHandleReschedule}
                    userType="buyer"
                    currentUserId={user?.id}
                    buyerActions={buyerActions}
                    showActions={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              <PortfolioTab buyerId={user?.id} onScheduleTour={handleScheduleTour} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Development Tool */}
        <CreateTestAgentConnection />

        {/* Sign Agreement Modal */}
        <SignAgreementModal
          isOpen={agreementModalOpen}
          onClose={() => {
            setAgreementModalOpen(false);
            setSelectedShowing(null);
          }}
          onSign={handleActualAgreementSign}
          showingDetails={selectedShowing ? {
            propertyAddress: selectedShowing.property_address,
            date: selectedShowing.preferred_date,
            time: selectedShowing.preferred_time,
            agentName: selectedShowing.assigned_agent_name
          } : undefined}
        />

        {/* Tour Scheduling Modal */}
        {showScheduleModal && selectedProperty && (
          <ModernTourSchedulingModal
            isOpen={showScheduleModal}
            onClose={handleScheduleModalClose}
            onSuccess={handleScheduleSuccess}
            initialAddress={selectedProperty.property_address}
            propertyId={selectedProperty.mls_id}
            skipNavigation={true}
          />
        )}
      </div>
    </div>
  );
};

export default UnifiedBuyerDashboard;