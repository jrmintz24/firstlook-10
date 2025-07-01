import { useState, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";
import PropertyRequestWizard from "@/components/PropertyRequestWizard";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import InlineMessagesPanel from "@/components/messaging/InlineMessagesPanel";
import OptimizedDashboardSkeleton from "@/components/dashboard/OptimizedDashboardSkeleton";

// Redesigned Components - loaded lazily
import JourneyProgressBar from "@/components/dashboard/redesigned/JourneyProgressBar";
import NextTourCard from "@/components/dashboard/redesigned/NextTourCard";
import QuickActionsRow from "@/components/dashboard/redesigned/QuickActionsRow";
import StatsAndMessages from "@/components/dashboard/redesigned/StatsAndMessages";
import EnhancedWhatsNextCard from "@/components/dashboard/redesigned/EnhancedWhatsNextCard";
import BadgesSection from "@/components/dashboard/redesigned/BadgesSection";
import HelpWidget from "@/components/dashboard/redesigned/HelpWidget";

// Tour sections - loaded on demand
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import { Clock, CheckCircle, Home, Calendar, TrendingUp, MessageCircle } from "lucide-react";

import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import { useOptimizedPendingTours } from "@/hooks/useOptimizedPendingTours";
import { useEnhancedPostShowingActions } from "@/hooks/useEnhancedPostShowingActions";

const OptimizedBuyerDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'messages'>('dashboard');

  const {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    showRescheduleModal,
    setShowRescheduleModal,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    agreements,
    loading,
    detailLoading,
    authLoading,
    currentUser,
    isInitialLoad,
    pendingRequests,
    activeShowings,
    completedShowings,
    showingCounts,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    handleRescheduleShowing,
    handleRescheduleSuccess
  } = useOptimizedBuyerLogic();

  // Process pending tours without blocking initial load
  useOptimizedPendingTours(currentUser?.id || null);

  // Enhanced post-showing actions
  const {
    isSubmitting,
    scheduleAnotherTour,
    hireAgent
  } = useEnhancedPostShowingActions();

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg mb-4 text-gray-900">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg mb-4 text-gray-900">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800 text-white">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show optimized skeleton during initial load
  if (loading && isInitialLoad) {
    return <OptimizedDashboardSkeleton />;
  }

  // Memoized computed values
  const displayName = useMemo(() => 
    profile?.first_name || 
    currentUser?.user_metadata?.first_name || 
    currentUser?.email?.split('@')[0] || 
    'User', [profile, currentUser]);
  
  const nextTour = useMemo(() => 
    (activeShowings && activeShowings.length > 0) ? activeShowings[0] : 
    (pendingRequests && pendingRequests.length > 0) ? pendingRequests[0] : null, 
    [activeShowings, pendingRequests]);
  
  const getCurrentStep = useMemo(() => {
    const activeCount = activeShowings?.length || 0;
    const completedCount = completedShowings?.length || 0;
    const pendingCount = pendingRequests?.length || 0;
    
    if (activeCount > 0) return "scheduled";
    if (completedCount > 0) return "completed";
    if (pendingCount > 0) return "scheduled";
    return "account";
  }, [activeShowings, completedShowings, pendingRequests]);

  const stats = useMemo(() => ({
    toursCompleted: (completedShowings || []).filter(s => s?.status === 'completed').length,
    propertiesViewed: (completedShowings || []).length + (activeShowings || []).length,
    offersMade: 0
  }), [completedShowings, activeShowings]);

  const handleViewHistory = () => setActiveTab("history");
  const handleAskQuestion = () => console.log("Ask question clicked");
  const handleMakeOffer = () => console.log("Make offer clicked");
  const handleScheduleAnotherTour = async () => handleRequestShowing();
  const handleSeeOtherProperties = () => handleRequestShowing();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Main Navigation Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveMainTab('dashboard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeMainTab === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveMainTab('messages')}
              className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
                activeMainTab === 'messages'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeMainTab === 'dashboard' && (
          <>
            {/* Journey Progress Bar */}
            <div className="mb-8 sm:mb-10">
              <JourneyProgressBar 
                currentStep={getCurrentStep}
                completedTours={stats.toursCompleted}
                activeShowings={activeShowings?.length || 0}
              />
            </div>

            {/* Your Journey Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Journey</h2>
              </div>
              
              <NextTourCard 
                showing={nextTour}
                onMessageAgent={handleSendMessage}
              />
            </div>

            {/* Tours Grid - Show counts immediately, load details progressively */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Requested Tours ({showingCounts.pending})
                  </h3>
                </div>
                
                <Suspense fallback={<div className="h-32 bg-gray-50 rounded animate-pulse" />}>
                  {detailLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-100 rounded animate-pulse" />
                      <div className="h-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ) : (
                    <ShowingListTab
                      title=""
                      showings={pendingRequests.slice(0, 3)}
                      emptyIcon={Clock}
                      emptyTitle="No pending requests"
                      emptyDescription="Ready to find your dream home?"
                      emptyButtonText="Request Your Free Showing"
                      onRequestShowing={handleRequestShowing}
                      onCancelShowing={() => {}}
                      onRescheduleShowing={handleRescheduleShowing}
                      onConfirmShowing={handleConfirmShowingWithModal}
                      onSignAgreement={(showing) => handleSignAgreementFromCard(showing.id, displayName)}
                      onComplete={() => {}}
                      currentUserId={currentUser?.id}
                      onSendMessage={handleSendMessage}
                      agreements={agreements}
                    />
                  )}
                </Suspense>
                
                {pendingRequests.length > 3 && (
                  <Button variant="ghost" className="w-full mt-4 text-gray-700 hover:bg-gray-50" onClick={() => setActiveTab("requested")}>
                    View All ({pendingRequests.length})
                  </Button>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Confirmed Tours ({showingCounts.active})
                  </h3>
                </div>
                
                <Suspense fallback={<div className="h-32 bg-gray-50 rounded animate-pulse" />}>
                  {detailLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-100 rounded animate-pulse" />
                      <div className="h-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ) : (
                    <ShowingListTab
                      title=""
                      showings={activeShowings.slice(0, 3)}
                      emptyIcon={CheckCircle}
                      emptyTitle="No confirmed tours"
                      emptyDescription="Confirmed tours will appear here"
                      emptyButtonText="Request Your Free Showing"
                      onRequestShowing={handleRequestShowing}
                      onCancelShowing={() => {}}
                      onRescheduleShowing={handleRescheduleShowing}
                      onConfirmShowing={handleConfirmShowingWithModal}
                      onSignAgreement={(showing) => handleSignAgreementFromCard(showing.id, displayName)}
                      onComplete={() => {}}
                      currentUserId={currentUser?.id}
                      onSendMessage={handleSendMessage}
                      agreements={agreements}
                    />
                  )}
                </Suspense>
                
                {activeShowings.length > 3 && (
                  <Button variant="ghost" className="w-full mt-4 text-gray-700 hover:bg-gray-50" onClick={() => setActiveTab("confirmed")}>
                    View All ({activeShowings.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              
              <QuickActionsRow 
                onBookTour={handleRequestShowing}
                onViewHistory={handleViewHistory}
                onAskQuestion={handleAskQuestion}
              />
            </div>

            {/* Enhanced What's Next */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <EnhancedWhatsNextCard 
                buyerId={currentUser?.id}
                completedShowings={completedShowings || []}
                onMakeOffer={handleMakeOffer}
                onWorkWithAgent={() => {}}
                onScheduleAnotherTour={handleScheduleAnotherTour}
                onSeeOtherProperties={handleSeeOtherProperties}
                isLoading={isSubmitting}
              />
            </div>

            {/* Stats Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Progress</h2>
              </div>
              
              <StatsAndMessages 
                stats={stats}
                unreadMessages={unreadCount || 0}
                onOpenInbox={() => setActiveMainTab('messages')}
              />
            </div>

            {/* Badges Section */}
            {(stats.toursCompleted > 0 || stats.propertiesViewed > 0) && (
              <div className="mb-8 sm:mb-10">
                <BadgesSection 
                  completedTours={stats.toursCompleted}
                  propertiesViewed={stats.propertiesViewed}
                />
              </div>
            )}
          </>
        )}

        {/* Messages Content */}
        {activeMainTab === 'messages' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-semibold text-gray-900">Messages</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1">
                  {unreadCount} unread
                </span>
              )}
            </div>
            
            <InlineMessagesPanel />
          </div>
        )}
      </div>

      {/* Help Widget */}
      <HelpWidget />

      {/* Modals */}
      <ErrorBoundary>
        <PropertyRequestWizard
          isOpen={showPropertyForm}
          onClose={() => setShowPropertyForm(false)}
        />
      </ErrorBoundary>

      {selectedShowing && (
        <>
          <SignAgreementModal
            isOpen={showAgreementModal}
            onClose={() => setShowAgreementModal(false)}
            onSign={handleAgreementSignWithModal}
            showingDetails={{
              propertyAddress: selectedShowing.property_address,
              date: selectedShowing.preferred_date,
              time: selectedShowing.preferred_time,
              agentName: selectedShowing.assigned_agent_name
            }}
          />

          <RescheduleModal
            showingRequest={selectedShowing}
            isOpen={showRescheduleModal}
            onClose={() => setShowRescheduleModal(false)}
            onSuccess={handleRescheduleSuccess}
          />
        </>
      )}

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </div>
  );
};

export default OptimizedBuyerDashboard;
