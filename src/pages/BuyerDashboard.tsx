
import ErrorBoundary from "@/components/ErrorBoundary";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FocusedStatsGrid from "@/components/dashboard/FocusedStatsGrid";
import UpdatesPanel from "@/components/dashboard/UpdatesPanel";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { generateBuyerStats } from "@/utils/dashboardStats";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";

const BuyerDashboard = () => {
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
    agreements,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleUpgradeClick,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchShowingRequests
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
  const allShowings = [...pendingRequests, ...activeShowings, ...completedShowings];

  // Generate focused buyer stats
  const focusedStats = generateBuyerStats(pendingRequests, activeShowings, completedShowings, unreadCount);

  // Generate dashboard sections
  const dashboardSections = generateBuyerDashboardSections({
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements,
    currentUser,
    profile,
    displayName,
    unreadCount,
    onRequestShowing: handleRequestShowing,
    onCancelShowing: handleCancelShowing,
    onRescheduleShowing: handleRescheduleShowing,
    onConfirmShowing: handleConfirmShowingWithModal,
    fetchShowingRequests,
    onSendMessage: handleSendMessage
  });

  // Header component
  const header = <DashboardHeader displayName={displayName} onRequestShowing={handleRequestShowing} />;

  // Stats component with subscription status
  const stats = (
    <div>
      <FocusedStatsGrid stats={focusedStats} onStatClick={handleStatClick} />
      <SubscriptionStatus 
        isSubscribed={isSubscribed}
        eligibility={eligibility}
        onUpgradeClick={handleUpgradeClick}
      />
    </div>
  );

  // Main content
  const mainContent = (
    <WelcomeDashboard 
      userType="buyer"
      displayName={displayName}
      onRequestShowing={handleRequestShowing}
      hasActiveShowings={activeShowings.length > 0}
      completedCount={completedShowings.filter(s => s.status === 'completed').length}
      pendingCount={pendingRequests.length}
    />
  );

  // Sidebar content
  const sidebar = (
    <UpdatesPanel 
      showingRequests={allShowings} 
      userType="buyer" 
      onSendMessage={handleSendMessage}
    />
  );

  return (
    <>
      <DashboardLayout
        header={header}
        stats={stats}
        mainContent={mainContent}
        sidebar={sidebar}
        sections={dashboardSections}
        defaultSection="active"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
    </>
  );
};

export default BuyerDashboard;
