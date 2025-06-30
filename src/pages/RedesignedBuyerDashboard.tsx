
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { useState } from "react";
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

// Tour sections
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import { Clock, CheckCircle, Home, Calendar, TrendingUp } from "lucide-react";

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
    
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests = [],
    activeShowings = [],
    completedShowings = [],
    unreadCount = 0,
    
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg mb-4 text-gray-900">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg mb-4 text-gray-900">Loading your dashboard...</div>
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

  const handleOpenChat = (showingId: string) => {
    console.log('Opening chat for showing:', showingId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <RedesignedDashboardHeader 
        displayName={displayName} 
        unreadCount={unreadCount || 0}
      />

      {/* Main Dashboard Content - Single Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Journey Progress Bar with Better Spacing */}
        <div className="mb-8 sm:mb-10">
          <JourneyProgressBar 
            currentStep={getCurrentStep()}
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

        {/* Active Tours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Requested Tours */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Requested Tours ({pendingRequests.length})
              </h3>
            </div>
            
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
              onSendMessage={handleOpenChat}
              agreements={agreements}
            />
            
            {pendingRequests.length > 3 && (
              <Button variant="ghost" className="w-full mt-4 text-gray-700 hover:bg-gray-50" onClick={() => setActiveTab("requested")}>
                View All ({pendingRequests.length})
              </Button>
            )}
          </div>

          {/* Confirmed Tours */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Confirmed Tours ({activeShowings.length})
              </h3>
            </div>
            
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
              onSendMessage={handleOpenChat}
              agreements={agreements}
            />
            
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

        {/* What's Next */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <WhatsNextCard 
            hasUpcomingTour={!!nextTour}
            hasCompletedTours={stats.toursCompleted}
            onMakeOffer={handleMakeOffer}
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
            onOpenInbox={() => {}}
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
      </div>

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
