
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
    pendingRequests,
    activeShowings,
    completedShowings,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSendMessage
  } = useBuyerDashboardLogic();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading your dashboard...</div>
          <div className="text-sm text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}
          </div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
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

  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';
  
  // Get next upcoming tour
  const nextTour = activeShowings[0] || pendingRequests[0];
  
  // Calculate current journey step
  const getCurrentStep = () => {
    if (activeShowings.length > 0) return "scheduled";
    if (completedShowings.length > 0) return "completed";
    if (pendingRequests.length > 0) return "scheduled";
    return "account";
  };

  // Generate stats
  const stats = {
    toursCompleted: completedShowings.filter(s => s.status === 'completed').length,
    propertiesViewed: completedShowings.length + activeShowings.length,
    offersMade: 0 // TODO: Add offers tracking
  };

  const handleViewHistory = () => {
    setActiveTab("history");
  };

  const handleAskQuestion = () => {
    // TODO: Implement help/question functionality
    console.log("Ask question clicked");
  };

  const handleOpenInbox = () => {
    setActiveTab("messages");
  };

  const handleMakeOffer = () => {
    // TODO: Implement offer functionality
    console.log("Make offer clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <RedesignedDashboardHeader 
        displayName={displayName} 
        unreadCount={unreadCount}
      />

      {/* Main Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Journey Progress Bar */}
        <JourneyProgressBar 
          currentStep={getCurrentStep()}
          completedTours={stats.toursCompleted}
          activeShowings={activeShowings.length}
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
              unreadMessages={unreadCount}
              onOpenInbox={handleOpenInbox}
            />
          </div>
        </div>

        {/* Badges Section */}
        <BadgesSection 
          completedTours={stats.toursCompleted}
          propertiesViewed={stats.propertiesViewed}
        />
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
