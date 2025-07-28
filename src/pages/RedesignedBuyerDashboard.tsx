import React, { useState, useCallback, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import ShowingListTab from '@/components/dashboard/ShowingListTab';
import { PortfolioTab } from '@/components/dashboard/PortfolioTab';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboardLayout from '@/components/mobile/MobileDashboardLayout';
import CreateTestAgentConnection from '@/components/dev/CreateTestAgentConnection';
import SignAgreementModal from '@/components/dashboard/SignAgreementModal';
import ModernTourSchedulingModal from "@/components/ModernTourSchedulingModal";
import ModernOfferModal from "@/components/offer-workflow/ModernOfferModal";
import { supabase } from '@/integrations/supabase/client';

const RedesignedBuyerDashboard = () => {
  console.log('🔍 [DEBUG] RedesignedBuyerDashboard render count:', ++window.redesignedBuyerDashboardRenderCount || (window.redesignedBuyerDashboardRenderCount = 1));
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPropertyAddress, setOfferPropertyAddress] = useState<string>('');
  const [offersCount, setOffersCount] = useState(0);
  const isMobile = useIsMobile();
  
  // Get all data and handlers from optimized hook
  const {
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    showingCounts,
    agreements,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowingWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    showAgreementModal,
    setShowAgreementModal,
    selectedShowing,
    handleAgreementSignWithModal,
    fetchData
  } = useOptimizedBuyerLogic();

  // Fetch offers count
  const fetchOffersCount = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { count, error } = await supabase
        .from('offer_intents')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id);

      if (error) {
        console.error('Error fetching offers count:', error);
        return;
      }

      setOffersCount(count || 0);
    } catch (error) {
      console.error('Error fetching offers count:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOffersCount();
  }, [fetchOffersCount]);

  // Handler functions for ShowingListTab
  const handleRequestShowing = useCallback(() => {
    setShowScheduleModal(true);
  }, []);

  const memoizedHandleCancel = useCallback((id: string) => {
    handleCancelShowing(id);
  }, [handleCancelShowing]);

  const memoizedHandleReschedule = useCallback((id: string) => {
    handleRescheduleShowing(id);
  }, [handleRescheduleShowing]);

  const memoizedHandleConfirm = useCallback((request: any) => {
    handleConfirmShowingWithModal(request);
  }, [handleConfirmShowingWithModal]);

  const memoizedHandleAgreementSign = useCallback((showing: any) => {
    const displayName = user?.user_metadata?.first_name || 'User';
    handleSignAgreementFromCard(showing.id, displayName);
  }, [handleSignAgreementFromCard, user]);

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
    // Refresh data after successful tour request
    await fetchData();
  };

  const handleMakeOffer = useCallback((propertyAddress: string) => {
    console.log(`Making offer for property: ${propertyAddress}`);
    setOfferPropertyAddress(propertyAddress);
    setShowOfferModal(true);
  }, []);

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
      count: offersCount,
      color: 'purple'
    }
  ];

  // Mobile layout rendering
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
              onRequestShowing={handleRequestShowing}
              onCancelShowing={memoizedHandleCancel}
              onRescheduleShowing={memoizedHandleReschedule}
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
              onRequestShowing={handleRequestShowing}
              onCancelShowing={memoizedHandleCancel}
              onRescheduleShowing={memoizedHandleReschedule}
              userType="buyer"
              currentUserId={user?.id}
              showActions={false}
            />
          );
        case 'portfolio':
          return <PortfolioTab buyerId={user?.id} onScheduleTour={handleScheduleTour} onCreateOffer={() => handleMakeOffer('')} />;
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
        onRequestTour={handleRequestShowing}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      >
        {renderMobileTabContent()}
      </MobileDashboardLayout>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'there'}! 
          </h1>
          <p className="text-lg text-gray-600">Your property tour dashboard</p>
        </div>
        
        {/* Status Info - Enhanced */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-800 font-medium">Dashboard Active & Optimized</p>
          </div>
          <div className="text-sm text-gray-700 flex gap-4">
            <span>Status: {loading ? '🔄 Loading' : '✅ Ready'}</span>
            <span>Tours: <AnimatedNumber value={showingCounts?.pending || 0} className="font-semibold" /> pending</span>
            <span>Scheduled: <AnimatedNumber value={showingCounts?.active || 0} className="font-semibold" /> active</span>
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
                  className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 shadow-md"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                        tab.color === 'orange' ? 'from-orange-400 to-orange-600' :
                        tab.color === 'blue' ? 'from-blue-400 to-blue-600' :
                        tab.color === 'green' ? 'from-green-400 to-green-600' :
                        'from-purple-400 to-purple-600'
                      } flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <AnimatedNumber 
                          value={tab.count} 
                          className="text-2xl font-bold text-gray-900"
                          enableGlow={tab.count > 0}
                          glowColor={
                            tab.color === 'orange' ? 'rgba(251, 146, 60, 0.4)' :
                            tab.color === 'blue' ? 'rgba(59, 130, 246, 0.4)' :
                            tab.color === 'green' ? 'rgba(34, 197, 94, 0.4)' :
                            'rgba(147, 51, 234, 0.4)'
                          }
                        />
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
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
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
                  showActions={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
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
                  showActions={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
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
                  showActions={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioTab 
              buyerId={user?.id} 
              onScheduleTour={handleScheduleTour} 
              onCreateOffer={() => handleMakeOffer('')} 
            />
          </TabsContent>
        </Tabs>

        {/* Development Tool */}
        <CreateTestAgentConnection />
        
        {/* Modal Components with conditional rendering to prevent infinite loops */}
        {showAgreementModal && (
          <SignAgreementModal
            isOpen={showAgreementModal}
            onClose={() => setShowAgreementModal(false)}
            showingId={selectedShowing?.id}
            onSignSuccess={() => {
              setShowAgreementModal(false);
              fetchData();
            }}
          />
        )}
        
        {showScheduleModal && (
          <ModernTourSchedulingModal
            isOpen={showScheduleModal}
            onClose={handleScheduleModalClose}
            selectedProperty={selectedProperty}
            onSuccess={handleScheduleSuccess}
          />
        )}
        
        {showOfferModal && (
          <ModernOfferModal
            isOpen={showOfferModal}
            onClose={() => {
              setShowOfferModal(false);
              setOfferPropertyAddress('');
              fetchData();
              fetchOffersCount(); // Refresh offers count
            }}
            propertyAddress={offerPropertyAddress}
            buyerId={user?.id || ''}
          />
        )}
      </div>
    </div>
  );
};

export default RedesignedBuyerDashboard;
