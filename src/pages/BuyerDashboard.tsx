
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ModernHeader from "@/components/dashboard/ModernHeader";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";

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

  // Convert agreements record to the expected format for sections
  const agreementsRecord = Object.fromEntries(
    Object.entries(agreements).map(([key, value]) => [key, value])
  );

  const sectionsArray = generateBuyerDashboardSections({
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements: agreementsRecord,
    currentUser,
    profile,
    displayName,
    unreadCount,
    onRequestShowing: handleRequestShowing,
    onCancelShowing: handleCancelShowing,
    onRescheduleShowing: handleRescheduleShowing,
    onConfirmShowing: handleConfirmShowingWithModal,
    onSignAgreement: (showing) => handleSignAgreementFromCard(showing.id, displayName),
    fetchShowingRequests,
    onSendMessage: (showing) => handleSendMessage(showing.id)
  });

  // Convert array to sections object expected by ModernDashboardLayout
  const sections = sectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Create header component
  const header = (
    <ModernHeader
      title="Dashboard"
      subtitle="Manage your property tours and showings"
      displayName={displayName}
      onPrimaryAction={handleRequestShowing}
      primaryActionText="Request Tour"
      userType="buyer"
      notificationCount={unreadCount}
    />
  );

  // Create tour-focused stats component
  const stats = (
    <div className="space-y-6">
      <ModernStatsGrid
        stats={[
          {
            title: "Pending Requests",
            value: pendingRequests.length,
            targetTab: "requested"
          },
          {
            title: "Confirmed Tours", 
            value: activeShowings.length,
            targetTab: "confirmed"
          },
          {
            title: "Completed Tours",
            value: completedShowings.length,
            targetTab: "history"
          }
        ]}
        onStatClick={handleStatClick}
      />
      
      <QuickActionsCard 
        unreadCount={unreadCount}
        onOpenMessages={() => console.log('Open messages')}
      />
    </div>
  );

  return (
    <>
      <ModernDashboardLayout
        header={header}
        stats={stats}
        mainContent={null}
        sidebar={null}
        sections={sections}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <PropertyRequestForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm()}
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
