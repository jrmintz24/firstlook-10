
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
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

const RedesignedBuyerDashboard = () => {
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
    profileData: profile
  });

  // Show loading while auth is being determined
  if (authLoading) {
    console.log('RedesignedBuyerDashboard - Auth loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Redirect if no auth
  if (!user && !session) {
    console.log('RedesignedBuyerDashboard - No user/session, showing sign-in message');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while dashboard data is being fetched
  if (loading) {
    console.log('RedesignedBuyerDashboard - Dashboard loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
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
  
  // Get next upcoming tour - safely handle empty arrays
  const nextTour = (activeShowings && activeShowings.length > 0) ? activeShowings[0] : 
                   (pendingRequests && pendingRequests.length > 0) ? pendingRequests[0] : null;
  
  // Calculate current journey step - handle undefined arrays
  const getCurrentStep = () => {
    const activeCount = activeShowings?.length || 0;
    const completedCount = completedShowings?.length || 0;
    const pendingCount = pendingRequests?.length || 0;
    
    if (activeCount > 0) return "scheduled";
    if (completedCount > 0) return "completed";
    if (pendingCount > 0) return "scheduled";
    return "account";
  };

  // Generate stats - safely handle undefined arrays
  const stats = {
    toursCompleted: (completedShowings || []).filter(s => s?.status === 'completed').length,
    propertiesViewed: (completedShowings || []).length + (activeShowings || []).length,
    offersMade: 0 // TODO: Add offers tracking
  };

  const handleViewHistory = () => {
    setActiveTab("history");
  };

  const handleAskQuestion = () => {
    console.log("Ask question clicked");
  };

  const handleOpenInbox = () => {
    setActiveTab("messages");
  };

  const handleMakeOffer = () => {
    console.log("Make offer clicked");
  };

  console.log('RedesignedBuyerDashboard - Rendering with:', { 
    displayName, 
    nextTour: !!nextTour, 
    stats,
    dataLength: {
      pending: pendingRequests?.length,
      active: activeShowings?.length,
      completed: completedShowings?.length
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <RedesignedDashboardHeader 
        displayName={displayName} 
        unreadCount={unreadCount || 0}
      />

      {/* Main Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Journey Progress Bar */}
        <JourneyProgressBar 
          currentStep={getCurrentStep()}
          completedTours={stats.toursCompleted}
          activeShowings={activeShowings?.length || 0}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Tour Card */}
            <NextTourCard 
              showing={nextTour}
              onMessageAgent={handleSendMessage}
            />

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

          {/* Right Column - Stats & Messages */}
          <div className="space-y-6">
            <StatsAndMessages 
              stats={stats}
              unreadMessages={unreadCount || 0}
              onOpenInbox={handleOpenInbox}
            />
          </div>
        </div>

        {/* Badges Section - only show if user has some activity */}
        {(stats.toursCompleted > 0 || stats.propertiesViewed > 0) && (
          <BadgesSection 
            completedTours={stats.toursCompleted}
            propertiesViewed={stats.propertiesViewed}
          />
        )}
      </div>

      {/* Help Widget */}
      <HelpWidget />

      {/* Modals */}
      <ErrorBoundary>
        <PropertyRequestForm
          isOpen={showPropertyForm}
          onClose={() => setShowPropertyForm(false)}
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
