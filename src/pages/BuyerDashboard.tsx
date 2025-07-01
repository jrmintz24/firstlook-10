
import { useState } from "react";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import UnifiedChatWidget from "@/components/messaging/UnifiedChatWidget";

const BuyerDashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDefaultTab, setChatDefaultTab] = useState<'property' | 'support'>('property');

  const {
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
    fetchShowingRequests
  } = useBuyerDashboardLogic();

  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
                     currentUser?.email?.split('@')[0] || 'User';

  const handleOpenMessages = () => {
    setChatDefaultTab('property');
    setChatOpen(true);
  };

  const handleOpenSupport = () => {
    setChatDefaultTab('support');
    setChatOpen(true);
  };

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

  const stats = (
    <div className="space-y-4">
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
        onOpenMessages={handleOpenMessages}
        onOpenSupport={handleOpenSupport}
      />
    </div>
  );

  return (
    <>
      <DashboardLayout
        header={null} // Remove the redundant header
        stats={stats}
        mainContent={null}
        sidebar={null}
        sections={sections}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Unified Chat Widget */}
      <UnifiedChatWidget
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        defaultTab={chatDefaultTab}
      />

      <PropertyRequestForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm()}
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
    </>
  );
};

export default BuyerDashboard;
