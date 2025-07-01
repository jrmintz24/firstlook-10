
import { useState, Suspense } from "react";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import InlineMessagesPanel from "@/components/messaging/InlineMessagesPanel";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import ConnectionStatus from "@/components/dashboard/ConnectionStatus";

const BuyerDashboard = () => {
  const {
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
    handleRescheduleSuccess,
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  // Add the pending tour handler to process any pending tour requests
  usePendingTourHandler();

  console.log('BuyerDashboard: Pending tour handler initialized');

  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
                     currentUser?.email?.split('@')[0] || 'User';

  const handleOpenMessages = () => {
    setActiveTab("messages");
  };

  const handleOpenSupport = () => {
    // We can add support functionality here later
    console.log("Support requested");
  };

  const agreementsRecord = Object.fromEntries(
    Object.entries(agreements).map(([key, value]) => [key, value])
  );

  // Show loading skeleton while data is being fetched
  if (loading || authLoading) {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardSkeleton />
      </Suspense>
    );
  }

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

  // Add the messages section to the dashboard
  const messagesSection = {
    id: "messages",
    title: "Messages",
    component: <InlineMessagesPanel />
  };

  const sections = sectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  // Add messages section
  sections.messages = messagesSection;

  const stats = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
        <ConnectionStatus userId={currentUser?.id || null} />
      </div>
      
      <QuickActionsCard 
        unreadCount={unreadCount}
        onOpenMessages={handleOpenMessages}
        onOpenSupport={handleOpenSupport}
      />
    </div>
  );

  return (
    <>
      <DashboardLayout
        header={null}
        stats={stats}
        mainContent={null}
        sidebar={null}
        sections={sections}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <PropertyRequestForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />

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

      {showRescheduleModal && selectedShowing && (
        <RescheduleModal
          showingRequest={selectedShowing}
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </>
  );
};

export default BuyerDashboard;
