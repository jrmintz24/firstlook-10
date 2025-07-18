
import { useState } from "react";
import { Calendar, Clock, CheckCircle, TrendingUp, FileText, Home, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";

// Unified components
import UnifiedDashboardLayout from "@/components/dashboard/shared/UnifiedDashboardLayout";
import UpcomingSection from "@/components/dashboard/shared/UpcomingSection";

// Existing components
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";

// Offer management components
import OfferManagementDashboard from "@/components/offer-management/OfferManagementDashboard";

// Post-showing components
import BuyerPostShowingHub from "@/components/dashboard/BuyerPostShowingHub";

// Tour scheduling modal
import ModernTourSchedulingModal from "@/components/ModernTourSchedulingModal";

// Simple favorites display
import SimpleFavoritesDisplay from "@/components/dashboard/SimpleFavoritesDisplay";

// Debug component
import PropertyLookupDebugger from "@/components/debug/PropertyLookupDebugger";
import IDXDataTester from "@/components/debug/IDXDataTester";
import DatabaseCleanup from "@/components/debug/DatabaseCleanup";

const BuyerDashboard = () => {
  // Add dummy onOpenChat handler
  const handleOpenChat = (defaultTab: 'property' | 'support' = 'property', showingId?: string) => {
    console.log('Chat opened', { defaultTab, showingId });
  };

  const {
    profile,
    loading,
    authLoading,
    currentUser,
    connectionStatus,
    pendingRequests,
    activeShowings,
    completedShowings,
    agreements,
    isSubscribed,
    refresh,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowingWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    fetchShowingRequests,
    signAgreement
  } = useBuyerDashboardLogic({ onOpenChat: handleOpenChat });

  const [activeTab, setActiveTab] = useState("requested");
  const [showSignAgreementModal, setShowSignAgreementModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showTourModal, setShowTourModal] = useState(false);
  const isMobile = useIsMobile();

  console.log('BuyerDashboard - Current user:', currentUser?.id);
  console.log('BuyerDashboard - Loading states:', { loading, authLoading });

  const handleStatClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleRequestTour = () => {
    setShowTourModal(true);
  };

  const handleTourModalSuccess = async () => {
    await refresh();
  };

  const handleSignAgreement = (request: any) => {
    setSelectedRequest(request);
    setShowSignAgreementModal(true);
  };

  const handleSignAgreementSuccess = async () => {
    if (selectedRequest && currentUser?.id) {
      const success = await signAgreement(selectedRequest.id, 'Buyer Name');
      if (success) {
        setShowSignAgreementModal(false);
        setSelectedRequest(null);
        refresh();
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg mb-4">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg mb-4">Unable to load profile</div>
          <button
            onClick={refresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile.first_name || 'Buyer';

  const dashboardTabs = [
    {
      id: "requested",
      title: "Requested",
      icon: Clock,
      count: pendingRequests.length,
      color: "bg-orange-100 text-orange-700",
      content: (
        <ShowingListTab
          title="Requested Tours"
          showings={pendingRequests}
          emptyIcon={Clock}
          emptyTitle="No Pending Tours"
          emptyDescription="You don't have any pending tour requests."
          emptyButtonText="Request a Tour"
          onRequestShowing={handleRequestTour}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleRescheduleShowing}
          onConfirmShowing={handleConfirmShowingWithModal}
          onSendMessage={handleSendMessage}
          onSignAgreement={handleSignAgreement}
          userType="buyer"
          currentUserId={currentUser?.id}
          agreements={agreements}
          onComplete={refresh}
        />
      )
    },
    {
      id: "confirmed",
      title: "Confirmed",
      icon: CheckCircle,
      count: activeShowings.length,
      color: "bg-green-100 text-green-700",
      content: (
        <ShowingListTab
          title="Confirmed Tours"
          showings={activeShowings}
          emptyIcon={CheckCircle}
          emptyTitle="No Confirmed Tours"
          emptyDescription="You don't have any confirmed tours scheduled."
          emptyButtonText="Request a Tour"
          onRequestShowing={handleRequestTour}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleRescheduleShowing}
          onSendMessage={handleSendMessage}
          userType="buyer"
          currentUserId={currentUser?.id}
          agreements={agreements}
          onComplete={refresh}
        />
      )
    },
    {
      id: "offers",
      title: "My Offers",
      icon: FileText,
      count: 0,
      color: "bg-purple-100 text-purple-700",
      content: currentUser?.id ? (
        <OfferManagementDashboard 
          buyerId={currentUser.id} 
          onCreateOffer={handleRequestTour}
        />
      ) : (
        <EmptyStateCard
          title="Unable to Load Offers"
          description="Please refresh the page to load your offers."
          buttonText="Refresh"
          onButtonClick={refresh}
          icon={FileText}
        />
      )
    },
    {
      id: "favorites",
      title: "Favorites",
      icon: Heart,
      count: 0,
      color: "bg-pink-100 text-pink-700",
      content: currentUser?.id ? (
        <SimpleFavoritesDisplay buyerId={currentUser.id} />
      ) : (
        <EmptyStateCard
          title="Unable to Load Favorites"
          description="Please refresh the page to load your favorites."
          buttonText="Refresh"
          onButtonClick={refresh}
          icon={Heart}
        />
      )
    },
    {
      id: "activity",
      title: "Activity",
      icon: TrendingUp,
      count: 0,
      color: "bg-blue-100 text-blue-700",
      content: currentUser?.id ? (
        <BuyerPostShowingHub buyerId={currentUser.id} />
      ) : (
        <EmptyStateCard
          title="Unable to Load Activity"
          description="Please refresh the page to load your activity."
          buttonText="Refresh"
          onButtonClick={refresh}
          icon={TrendingUp}
        />
      )
    },
    {
      id: "history",
      title: "History",
      icon: Calendar,
      count: completedShowings.length,
      color: "bg-gray-100 text-gray-700",
      content: (
        <ShowingListTab
          title="Tour History"
          showings={completedShowings}
          emptyIcon={Calendar}
          emptyTitle="No Tour History"
          emptyDescription="You haven't completed any tours yet."
          emptyButtonText="Request a Tour"
          onRequestShowing={handleRequestTour}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleRescheduleShowing}
          showActions={false}
          userType="buyer"
          currentUserId={currentUser?.id}
          agreements={agreements}
          onComplete={refresh}
        />
      )
    }
  ];

  const sidebar = (
    <div className="space-y-6">
      {/* Database Cleanup Tool */}
      <DatabaseCleanup />
      
      {/* IDX Data Tester */}
      <IDXDataTester />
      
      {/* Debug Component */}
      <PropertyLookupDebugger />

      {/* Upcoming Showings */}
      <UpcomingSection
        title="Upcoming Tours"
        showings={activeShowings}
        onViewAll={() => handleStatClick("confirmed")}
        maxItems={3}
      />

      {/* Recent Activity */}
      <UpcomingSection
        title="Recent Activity"
        showings={completedShowings}
        onViewAll={() => handleStatClick("history")}
        maxItems={3}
      />
    </div>
  );

  return (
    <>
      <div className="pt-6">
        <UnifiedDashboardLayout
          title={`Welcome back, ${displayName}`}
          subtitle="Find your perfect home with personalized tours"
          userType="buyer"
          displayName={displayName}
          tabs={dashboardTabs}
          sidebar={sidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          primaryAction={{
            label: "Request a Tour",
            onClick: handleRequestTour
          }}
        />
      </div>
      
      {/* Modals */}
      {selectedRequest && (
        <SignAgreementModal
          isOpen={showSignAgreementModal}
          onClose={() => setShowSignAgreementModal(false)}
          onSign={handleSignAgreementSuccess}
          showingDetails={{
            propertyAddress: selectedRequest.property_address,
            date: selectedRequest.preferred_date,
            time: selectedRequest.preferred_time,
            agentName: selectedRequest.assigned_agent_name
          }}
        />
      )}

      <ModernTourSchedulingModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        onSuccess={handleTourModalSuccess}
      />
    </>
  );
};

export default BuyerDashboard;
