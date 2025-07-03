
import { useState, Suspense, useCallback, useMemo } from "react";
import { usePendingTourHandler } from "@/hooks/usePendingTourHandler";
import { useConsultationBookings } from "@/hooks/useConsultationBookings";
import { generateBuyerDashboardSections } from "@/components/dashboard/BuyerDashboardSections";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ModernTourSchedulingModal from "@/components/ModernTourSchedulingModal";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import PropertySelectionModal from "@/components/dashboard/PropertySelectionModal";
import EnhancedOfferTypeDialog from "@/components/post-showing/EnhancedOfferTypeDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import ModernStatsGrid from "@/components/dashboard/ModernStatsGrid";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import FavoritesSection from "@/components/dashboard/FavoritesSection";
import MessagesTab from "@/components/messaging/MessagesTab";
import QuickActions from "@/components/dashboard/QuickActions";
import { useToast } from "@/hooks/use-toast";
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import { useSafeMessages } from "@/hooks/useSafeMessages";
import { useBuyerFavorites } from "@/hooks/useBuyerFavorites";

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
    refreshShowingRequests
  } = useOptimizedBuyerLogic();

  // New state for property selection and offer modals
  const [showPropertySelectionModal, setShowPropertySelectionModal] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Use safe messages hook that won't break the dashboard
  const { unreadCount } = useSafeMessages(currentUser?.id || null);

  // Add favorites hook
  const { favorites } = useBuyerFavorites(currentUser?.id);

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
      await refreshShowingRequests();
      toast({
        title: "Tour Request Processed",
        description: "Your tour request has been submitted and agents will be notified.",
      });
    } catch (error) {
      console.error('Error refreshing data after tour processed:', error);
    }
  }, [refreshShowingRequests, toast]);

  usePendingTourHandler({ onTourProcessed: handleTourProcessed });

  const displayName = useMemo(() => 
    profile ? `${profile.first_name} ${profile.last_name}`.trim() : 
    currentUser?.email?.split('@')[0] || 'User', [profile, currentUser]);

  const handleOpenMessages = () => {
    setActiveTab("messages");
  };

  const handleOpenFavorites = () => {
    setActiveTab("favorites");
  };

  const handleOpenSupport = () => {
    console.log("Support requested");
  };

  // Handle make offer button click
  const handleMakeOffer = useCallback(() => {
    if (completedShowings.length === 0) {
      toast({
        title: "No Completed Tours",
        description: "You need to complete at least one tour before making an offer.",
        variant: "destructive"
      });
      return;
    }
    setShowPropertySelectionModal(true);
  }, [completedShowings.length, toast]);

  // Handle property selection from modal
  const handlePropertySelect = useCallback((showing: any) => {
    setSelectedProperty(showing);
    setShowPropertySelectionModal(false);
    setShowOfferDialog(true);
  }, []);

  // Handle offer dialog close
  const handleOfferDialogClose = useCallback(() => {
    setShowOfferDialog(false);
    setSelectedProperty(null);
    toast({
      title: "Offer Process Started",
      description: "Your offer consultation has been initiated.",
    });
  }, [toast]);

  // Handle tour completion - refresh data to move completed tours to history
  const handleTourComplete = useCallback(async () => {
    console.log('BuyerDashboard: Tour completed, refreshing data');
    try {
      await refreshShowingRequests();
      toast({
        title: "Tour Completed",
        description: "Your tour has been completed and moved to history.",
      });
    } catch (error) {
      console.error('Error refreshing data after tour completion:', error);
    }
  }, [refreshShowingRequests, toast]);

  const agreementsRecord: Record<string, boolean> = {};

  // Transform consultation bookings to match the expected format
  const consultations = consultationBookings.map(booking => ({
    id: booking.id,
    propertyAddress: booking.offer_intents?.property_address || 'Property consultation',
    scheduledAt: booking.scheduled_at,
    consultationType: (booking.offer_intents?.consultation_type === 'phone' ? 'phone' : 'video') as 'phone' | 'video',
    agentName: 'Your Agent',
    status: booking.status as 'scheduled' | 'completed' | 'cancelled'
  }));

  // Handle successful form submission - refresh data and return promise
  const handleFormSuccess = useCallback(async () => {
    console.log('BuyerDashboard: Refreshing data after form submission');
    try {
      await refreshShowingRequests();
      console.log('BuyerDashboard: Data refresh completed');
    } catch (error) {
      console.error('Error refreshing data after form submission:', error);
    }
  }, [refreshShowingRequests]);

  // Add consultation handlers
  const handleJoinConsultation = useCallback((consultationId: string) => {
    console.log('Joining consultation:', consultationId);
    toast({
      title: "Video Call Starting",
      description: "Opening video consultation...",
    });
  }, [toast]);

  const handleRescheduleConsultation = useCallback(async (consultationId: string) => {
    console.log('Rescheduling consultation:', consultationId);
    toast({
      title: "Reschedule Consultation",
      description: "Feature coming soon!",
    });
  }, [toast]);

  // Fix the agreement signing handler to match the expected signature
  const handleAgreementSign = useCallback(async (name: string) => {
    if (!selectedShowing) return;
    
    try {
      await handleAgreementSignWithModal(name);
    } catch (error) {
      console.error('Error signing agreement:', error);
    }
  }, [selectedShowing, handleAgreementSignWithModal]);

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
    fetchShowingRequests: refreshShowingRequests,
    onSendMessage: (showingId: string) => handleSendMessage(showingId),
    onJoinConsultation: handleJoinConsultation,
    onRescheduleConsultation: handleRescheduleConsultation,
    onComplete: handleTourComplete,
    onMakeOffer: handleMakeOffer
  });

  // Convert sections array to record format for DashboardLayout
  const sections = sectionsArray.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, any>);

  // Add the standalone sections that are not part of the main navigation
  sections.favorites = {
    id: "favorites",
    title: "Favorites",
    component: (
      <div className="space-y-6">
        <FavoritesSection buyerId={currentUser?.id} />
        <QuickActions 
          onRequestShowing={handleRequestShowing} 
          onMakeOffer={handleMakeOffer}
        />
      </div>
    )
  };

  sections.messages = {
    id: "messages",
    title: "Messages",
    component: (
      <div className="space-y-6">
        <MessagesTab userId={currentUser?.id || ''} userType="buyer" />
        <QuickActions 
          onRequestShowing={handleRequestShowing} 
          onMakeOffer={handleMakeOffer}
        />
      </div>
    )
  };

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
            },
            {
              title: "Favorites",
              value: favorites.length,
              targetTab: "favorites"
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
        onOpenFavorites={handleOpenFavorites}
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
        activeTab={activeTab || "requested"}
        onTabChange={setActiveTab}
      />

      <ModernTourSchedulingModal
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={handleFormSuccess}
        skipNavigation={true}
      />

      <PropertySelectionModal
        isOpen={showPropertySelectionModal}
        onClose={() => setShowPropertySelectionModal(false)}
        onPropertySelect={handlePropertySelect}
        completedShowings={completedShowings}
      />

      {selectedProperty && (
        <EnhancedOfferTypeDialog
          isOpen={showOfferDialog}
          onClose={handleOfferDialogClose}
          propertyAddress={selectedProperty.property_address}
          agentId={selectedProperty.assigned_agent_id}
          agentName={selectedProperty.assigned_agent_name}
          buyerId={currentUser?.id || ''}
          showingRequestId={selectedProperty.id}
        />
      )}

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
          onSign={handleAgreementSign}
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
