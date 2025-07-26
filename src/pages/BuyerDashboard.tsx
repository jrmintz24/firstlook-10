
import { useState } from "react";
import { Calendar, Clock, CheckCircle, TrendingUp, FileText, Home, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBuyerDashboardLogic } from "@/hooks/useBuyerDashboardLogic";
import EnhancedDashboardStats from "@/components/dashboard/EnhancedDashboardStats";
import EnhancedDashboardSkeleton from "@/components/dashboard/EnhancedDashboardSkeleton";

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

// Mobile components
import MobileDashboardLayout from "@/components/mobile/MobileDashboardLayout";

const BuyerDashboard = () => {
  // Add dummy onOpenChat handler
  const handleOpenChat = (defaultTab: 'property' | 'support' = 'property', showingId?: string) => {
    // Chat functionality placeholder
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

  if (authLoading || loading) {
    return <EnhancedDashboardSkeleton />;
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

  // Debug confirmed tours
  console.log(`[BuyerDashboard] Confirmed tab - activeShowings:`, {
    count: activeShowings.length,
    showings: activeShowings.map(s => ({ id: s.id, status: s.status, address: s.property_address }))
  });

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

  // Mobile vs Desktop rendering
  if (isMobile) {
    console.log('[BuyerDashboard] Mobile render:', {
      pendingRequestsCount: pendingRequests.length,
      activeShowingsCount: activeShowings.length,
      completedShowingsCount: completedShowings.length,
      activeTab,
      loading,
      authLoading,
      hasCurrentUser: !!currentUser
    });
    return (
      <>
        <MobileDashboardLayout
          user={currentUser}
          pendingRequests={pendingRequests}
          activeShowings={activeShowings}
          completedShowings={completedShowings}
          favorites={[]} // TODO: Get favorites from data
          onRequestTour={handleRequestTour}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        >
          {/* Tab-specific content for mobile */}
          {(() => {
            console.log('[BuyerDashboard] Mobile tab content:', {
              activeTab,
              availableTabs: dashboardTabs.map(t => t.id),
              foundTab: !!dashboardTabs.find(tab => tab.id === activeTab),
              tabContent: dashboardTabs.find(tab => tab.id === activeTab)?.id
            });
            return null;
          })()}
          {(() => {
            const activeTabData = dashboardTabs.find(tab => tab.id === activeTab);
            console.log('[BuyerDashboard] Active tab data:', {
              activeTab,
              activeTabData,
              hasContent: !!activeTabData?.content
            });
            
            if (!activeTabData) {
              return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16" />
                  </div>
                  <p className="text-gray-600">Tab not found: {activeTab}</p>
                  <p className="text-sm text-gray-500 mt-2">Available tabs: {dashboardTabs.map(t => t.id).join(', ')}</p>
                </div>
              );
            }
            
            return activeTabData.content;
          })()}
        </MobileDashboardLayout>
        
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
  }

  // Create stats for the dashboard
  const dashboardStats = [
    {
      id: "requested",
      title: "Requested Tours",
      value: pendingRequests.length,
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
      onClick: () => handleStatClick("requested")
    },
    {
      id: "confirmed",
      title: "Confirmed Tours",
      value: activeShowings.length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      onClick: () => handleStatClick("confirmed")
    },
    {
      id: "completed",
      title: "Completed Tours",
      value: completedShowings.length,
      icon: Calendar,
      color: "bg-gray-100 text-gray-700",
      onClick: () => handleStatClick("history")
    }
  ];

  // Desktop rendering
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
        
        {/* Enhanced Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
          <EnhancedDashboardStats stats={dashboardStats} />
        </div>
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
