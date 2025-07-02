import { useState, Suspense, useCallback } from "react";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { useConsultationBookings } from "@/hooks/useConsultationBookings";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PropertyRequestWizard from "@/components/PropertyRequestWizard";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import ConnectionStatus from "@/components/dashboard/ConnectionStatus";
import { useToast } from "@/hooks/use-toast";
import { useSimpleBuyerLogic } from "@/hooks/useSimpleBuyerLogic";
import "../utils/createTestAgent";
import "../utils/debugWorkflow";

const BuyerDashboard = () => {
  const { toast } = useToast();
  
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
    loading,
    detailLoading,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    showingCounts,
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
  } = useSimpleBuyerLogic();

  // Fetch real consultation bookings data
  const { 
    bookings: consultationBookings, 
    loading: consultationsLoading,
    updateBookingStatus,
    rescheduleBooking 
  } = useConsultationBookings(currentUser?.id, 'buyer');

  // Handle any pending tour requests from signup with proper refresh callback
  const handleTourProcessed = useCallback(async () => {
    console.log('BuyerDashboard: Tour processed, refreshing data');
    try {
      await fetchShowingRequests();
      toast({
        title: "Tour Request Processed",
        description: "Your tour request has been submitted and agents will be notified.",
      });
    } catch (error) {
      console.error('Error refreshing data after tour processed:', error);
    }
  }, [fetchShowingRequests, toast]);

  usePendingTourHandler({ onTourProcessed: handleTourProcessed });

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

  // Fix the TypeScript error by properly typing the agreements record
  const agreementsRecord: Record<string, boolean> = {};

  // Transform consultation bookings to match the expected format
  const consultations = consultationBookings.map(booking => ({
    id: booking.id,
    propertyAddress: booking.offer_intents?.property_address || 'Property consultation',
    scheduledAt: booking.scheduled_at,
    consultationType: (booking.offer_intents?.consultation_type === 'phone' ? 'phone' : 'video') as 'phone' | 'video',
    agentName: 'Your Agent', // This would come from agent profile in a real implementation
    status: booking.status as 'scheduled' | 'completed' | 'cancelled'
  }));

  // Handle successful form submission - refresh data and return promise
  const handleFormSuccess = useCallback(async () => {
    console.log('BuyerDashboard: Refreshing data after form submission');
    try {
      await fetchShowingRequests();
      console.log('BuyerDashboard: Data refresh completed');
    } catch (error) {
      console.error('Error refreshing data after form submission:', error);
    }
  }, [fetchShowingRequests]);

  // Add consultation handlers
  const handleJoinConsultation = useCallback((consultationId: string) => {
    console.log('Joining consultation:', consultationId);
    // In a real implementation, this would open the video call
    toast({
      title: "Video Call Starting",
      description: "Opening video consultation...",
    });
  }, [toast]);

  const handleRescheduleConsultation = useCallback(async (consultationId: string) => {
    console.log('Rescheduling consultation:', consultationId);
    // For now, just show a message - in real implementation this would open a reschedule modal
    toast({
      title: "Reschedule Consultation",
      description: "Feature coming soon!",
    });
  }, [toast]);

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
    consultations,
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
    onSendMessage: (showing) => handleSendMessage(showing.id),
    onJoinConsultation: handleJoinConsultation,
    onRescheduleConsultation: handleRescheduleConsultation
  });

  // Convert sections array to record format for DashboardLayout
  const sections = sectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  const stats = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ModernStatsGrid
          stats={[
            {
              title: "Pending Requests",
              value: showingCounts.pending,
              targetTab: "requested"
            },
            {
              title: "Confirmed Tours", 
              value: showingCounts.active,
              targetTab: "confirmed"
            },
            {
              title: "Completed Tours",
              value: showingCounts.completed,
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

      <PropertyRequestWizard
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={handleFormSuccess}
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
