
import React, { useCallback } from "react";
import { Clock, Calendar, CheckCircle } from "lucide-react";
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import AgreementModal from "@/components/dashboard/SignAgreementModal";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import PropertyRequestWizard from "@/components/PropertyRequestWizard";

const OptimizedBuyerDashboard = () => {
  const {
    // State
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
    
    // Data
    profile,
    selectedShowing,
    agreements,
    loading,
    detailLoading,
    authLoading,
    currentUser,
    isInitialLoad,
    pendingRequests,
    activeShowings,
    completedShowings,
    showingCounts,
    unreadCount,
    eligibility,
    isSubscribed,
    
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
    handleRescheduleSuccess,
  } = useOptimizedBuyerLogic();

  const displayName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
                     currentUser?.email?.split('@')[0] || 'User';

  const agreementsByShowing = agreements.reduce((acc: Record<string, boolean>, agreement: any) => {
    acc[agreement.showing_request_id] = agreement.signed;
    return acc;
  }, {});

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  // Fix the function signature to match ShowingListTab expectations
  const handleSignAgreementWrapper = useCallback((showing: any) => {
    handleSignAgreementFromCard(showing.id, showing.user_name || 'Buyer');
  }, [handleSignAgreementFromCard]);

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (loading && isInitialLoad) {
    return <div>Loading dashboard data...</div>;
  }

  const sections = {
    requested: {
      id: "requested",
      title: "Requested Tours",
      showings: pendingRequests,
      emptyIcon: Clock,
      emptyTitle: "No tour requests yet",
      emptyDescription: "Ready to explore DC's best properties? Request your first tour!",
      emptyButtonText: eligibility?.eligible ? "Request Tour" : (eligibility?.reason === 'monthly_limit_exceeded' ? "Upgrade to Pro" : "Request Tour"),
    },
    active: {
      id: "active", 
      title: "Active Tours",
      showings: activeShowings,
      emptyIcon: Calendar,
      emptyTitle: "No confirmed tours",
      emptyDescription: "Your confirmed tours will appear here. Request a tour to get started!",
      emptyButtonText: eligibility?.eligible ? "Request Tour" : (eligibility?.reason === 'monthly_limit_exceeded' ? "Upgrade to Pro" : "Request Tour"),
    },
    completed: {
      id: "completed",
      title: "Tour History", 
      showings: completedShowings,
      emptyIcon: CheckCircle,
      emptyTitle: "No completed tours yet",
      emptyDescription: "Your tour history will appear here after you complete some tours.",
      emptyButtonText: eligibility?.eligible ? "Request Tour" : (eligibility?.reason === 'monthly_limit_exceeded' ? "Upgrade to Pro" : "Request Tour"),
    }
  };

  const renderSection = (sectionId: string) => {
    const section = sections[sectionId as keyof typeof sections];
    if (!section) return null;

    return (
      <ShowingListTab
        title={section.title}
        showings={section.showings}
        emptyIcon={section.emptyIcon}
        emptyTitle={section.emptyTitle}
        emptyDescription={section.emptyDescription}
        emptyButtonText={section.emptyButtonText}
        onRequestShowing={handleRequestShowing}
        onCancelShowing={handleCancelShowing}
        onRescheduleShowing={handleRescheduleShowing}
        onConfirmShowing={handleConfirmShowingWithModal}
        onSendMessage={handleSendMessage}
        onSignAgreement={handleSignAgreementWrapper}
        currentUserId={currentUser?.id}
        agreements={agreementsByShowing}
        eligibility={eligibility}
        onUpgradeClick={handleUpgradeClick}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {displayName}!
        </h1>
        <div className="mt-4">
          <nav className="space-x-4">
            {Object.keys(sections).map((sectionId) => (
              <button
                key={sectionId}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === sectionId
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleTabChange(sectionId)}
              >
                {sections[sectionId as keyof typeof sections].title} ({showingCounts[sectionId as keyof typeof showingCounts]})
              </button>
            ))}
          </nav>
          <div className="mt-6">{renderSection(activeTab)}</div>
        </div>
      </div>

      <AgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        onSign={handleAgreementSignWithModal}
        showingDetails={selectedShowing ? {
          propertyAddress: selectedShowing.property_address,
          date: selectedShowing.preferred_date,
          time: selectedShowing.preferred_time,
          agentName: selectedShowing.assigned_agent_name
        } : undefined}
      />

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSuccess={handleRescheduleSuccess}
        showingRequest={selectedShowing}
      />

      <PropertyRequestWizard
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default OptimizedBuyerDashboard;
