import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";

// Redesigned Components
import RedesignedDashboardHeader from "@/components/dashboard/redesigned/RedesignedDashboardHeader";
import JourneyProgressBar from "@/components/dashboard/redesigned/JourneyProgressBar";
import NextTourCard from "@/components/dashboard/redesigned/NextTourCard";
import QuickActionsRow from "@/components/dashboard/redesigned/QuickActionsRow";
import StatsAndMessages from "@/components/dashboard/redesigned/StatsAndMessages";
import WhatsNextCard from "@/components/dashboard/redesigned/WhatsNextCard";
import BadgesSection from "@/components/dashboard/redesigned/BadgesSection";
import HelpWidget from "@/components/dashboard/redesigned/HelpWidget";
import ChatWidget from "@/components/messaging/ChatWidget";

// Tour sections
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import { Clock, CheckCircle } from "lucide-react";

const RedesignedBuyerDashboard = () => {
  // Handle any pending tour requests from signup
  usePendingTourHandler();

  const {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests = [],
    activeShowings = [],
    completedShowings = [],
    unreadCount = 0,
    
    // Handlers
    handleRequestShowing,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSendMessage
  } = useBuyerDashboardLogic();

  console.log('RedesignedBuyerDashboard - Render state:', {
    authLoading,
    loading,
    hasUser: !!user,
    hasSession: !!session,
    userEmail: user?.email || session?.user?.email,
    userId: user?.id || session?.user?.id,
    profileExists: !!profile,
    profileData: profile,
    showingCounts: {
      pending: pendingRequests.length,
      active: activeShowings.length,
      completed: completedShowings.length
    }
  });

  // Show loading while auth is being determined
  if (authLoading) {
    console.log('RedesignedBuyerDashboard - Auth loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
    console.log('RedesignedBuyerDashboard - No user/session, showing sign-in message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('RedesignedBuyerDashboard - Dashboard loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Safe fallbacks for first-time users
  const displayName = profile?.first_name || 
                     currentUser?.user_metadata?.first_name || 
                     currentUser?.email?.split('@')[0] || 
                     'User';
  
  const nextTour = (activeShowings && activeShowings.length > 0) ? activeShowings[0] : 
                   (pendingRequests && pendingRequests.length > 0) ? pendingRequests[0] : null;
  
  const getCurrentStep = () => {
    const activeCount = activeShowings?.length || 0;
    const completedCount = completedShowings?.length || 0;
    const pendingCount = pendingRequests?.length || 0;
    
    if (activeCount > 0) return "scheduled";
    if (completedCount > 0) return "completed";
    if (pendingCount > 0) return "scheduled";
    return "account";
  };

  const stats = {
    toursCompleted: (completedShowings || []).filter(s => s?.status === 'completed').length,
    propertiesViewed: (completedShowings || []).length + (activeShowings || []).length,
    offersMade: 0
  };

  const handleViewHistory = () => {
    setActiveTab("history");
  };

  const handleAskQuestion = () => {
    console.log("Ask question clicked");
  };

  const handleMakeOffer = () => {
    console.log("Make offer clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <RedesignedDashboardHeader 
        displayName={displayName} 
        unreadCount={unreadCount || 0}
      />

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Journey Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <JourneyProgressBar 
            currentStep={getCurrentStep()}
            completedTours={stats.toursCompleted}
            activeShowings={activeShowings?.length || 0}
          />
        </div>

        {/* Main Content Grid - Improved layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left Column - Main Tours Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Next Tour Card */}
            <NextTourCard 
              showing={nextTour}
              onMessageAgent={handleSendMessage}
            />

            {/* Tours Grid - Split into Requested and Confirmed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requested Tours */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Requested Tours ({pendingRequests.length})
                </h3>
                <ShowingListTab
                  title=""
                  showings={pendingRequests.slice(0, 3)}
                  emptyIcon={Clock}
                  emptyTitle="No pending requests"
                  emptyDescription="Ready to find your dream home?"
                  emptyButtonText="Request Your Free Showing"
                  onRequestShowing={handleRequestShowing}
                  onCancelShowing={() => {}}
                  onRescheduleShowing={() => {}}
                  onComplete={() => {}}
                  currentUserId={currentUser?.id}
                />
                {pendingRequests.length > 3 && (
                  <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab("requested")}>
                    View All ({pendingRequests.length})
                  </Button>
                )}
              </div>

              {/* Confirmed Tours */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Confirmed Tours ({activeShowings.length})
                </h3>
                <ShowingListTab
                  title=""
                  showings={activeShowings.slice(0, 3)}
                  emptyIcon={CheckCircle}
                  emptyTitle="No confirmed tours"
                  emptyDescription="Confirmed tours will appear here"
                  emptyButtonText="Request Your Free Showing"
                  onRequestShowing={handleRequestShowing}
                  onCancelShowing={() => {}}
                  onRescheduleShowing={() => {}}
                  onConfirmShowing={handleConfirmShowingWithModal}
                  onComplete={() => {}}
                  currentUserId={currentUser?.id}
                />
                {activeShowings.length > 3 && (
                  <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab("confirmed")}>
                    View All ({activeShowings.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActionsRow 
              onBookTour={handleRequestShowing}
              onViewHistory={handleViewHistory}
              onAskQuestion={handleAskQuestion}
            />

            {/* What's Next */}
            <WhatsNextCard 
              hasUpcomingTour={!!nextTour}
              hasCompletedTours={stats.toursCompleted}
              onMakeOffer={handleMakeOffer}
            />
          </div>

          {/* Right Column - Stats (removed messages section) */}
          <div className="xl:col-span-1">
            <StatsAndMessages 
              stats={stats}
              unreadMessages={unreadCount || 0}
              onOpenInbox={() => {}} // Empty function since we handle this via ChatWidget now
            />
          </div>
        </div>

        {/* Badges Section */}
        {(stats.toursCompleted > 0 || stats.propertiesViewed > 0) && (
          <div className="mb-6 sm:mb-8">
            <BadgesSection 
              completedTours={stats.toursCompleted}
              propertiesViewed={stats.propertiesViewed}
            />
          </div>
        )}
      </div>

      {/* Chat Widget - Updated to not use onOpenInbox */}
      {currentUser?.id && (
        <ChatWidget
          userId={currentUser.id}
          unreadCount={unreadCount || 0}
          onOpenInbox={() => {}} // Empty function since messages tab no longer exists
        />
      )}

      {/* Help Widget */}
      <HelpWidget />

      {/* Modals */}
      <ErrorBoundary>
        <PropertyRequestForm
          isOpen={showPropertyForm}
          onClose={setShowPropertyForm}
        />
      </ErrorBoundary>

      {selectedShowing && (
        <SignAgreementModal
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          onSign={handleAgreementSignWithModal}
        />
      )}

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </div>
  );
};

export default RedesignedBuyerDashboard;
