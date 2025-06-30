
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import SubscribeModal from "@/components/SubscribeModal";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";

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
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    subscriptionTier,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleUpgradeClick,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
                     currentUser?.email?.split('@')[0] || 'User';

  const sections = generateBuyerDashboardSections({
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
    onSendMessage: handleSendMessage,
    onSignAgreement: handleSignAgreementFromCard
  });

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <ModernDashboardLayout
        sections={sections}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onStatClick={handleStatClick}
        userType="buyer"
        displayName={displayName}
        eligibility={eligibility}
        isSubscribed={isSubscribed}
        subscriptionTier={subscriptionTier}
        onUpgrade={handleUpgradeClick}
      />

      {showPropertyForm && (
        <PropertyRequestForm
          onClose={() => setShowPropertyForm(false)}
          onSuccess={fetchShowingRequests}
        />
      )}

      {showSubscribeModal && (
        <SubscribeModal
          isOpen={showSubscribeModal}
          onClose={() => setShowSubscribeModal(false)}
          onSuccess={handleSubscriptionComplete}
        />
      )}

      {showAgreementModal && selectedShowing && (
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
      )}
    </>
  );
};

export default BuyerDashboard;
