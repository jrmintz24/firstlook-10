
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  // Convert agreements record to array format expected by sections
  const agreementsArray = Object.entries(agreements).map(([showing_request_id, signed]) => ({
    id: `agreement-${showing_request_id}`,
    showing_request_id,
    signed,
    signed_at: signed ? new Date().toISOString() : null,
    agreement_type: 'single_tour',
    created_at: new Date().toISOString()
  }));

  const sections = generateBuyerDashboardSections({
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements: agreementsArray,
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

      <PropertyRequestForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />

      {/* Simple Subscribe Modal replacement */}
      {showSubscribeModal && (
        <Dialog open={showSubscribeModal} onOpenChange={() => setShowSubscribeModal(false)}>
          <DialogContent>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="mb-4">Get unlimited property tours and priority support.</p>
              <Button onClick={handleSubscriptionComplete} className="w-full">
                Subscribe Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
