import React, { useState, useCallback } from "react";
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import OptimizedDashboardSkeleton from "@/components/dashboard/OptimizedDashboardSkeleton";
import OptimizedShowingCard from "@/components/dashboard/OptimizedShowingCard";
import ModernTourSchedulingModal from "@/components/ModernTourSchedulingModal";

// Create missing header component
const RedesignedDashboardHeader = ({ userName, unreadCount, onOpenChat }: {
  userName: string;
  unreadCount: number;
  onOpenChat: (tab: 'property' | 'support', showingId?: string) => void;
}) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {userName}!</h1>
        {unreadCount > 0 && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {unreadCount} new messages
          </div>
        )}
      </div>
    </div>
  </div>
);

// Create missing stats component
const StatsAndMessages = ({ stats, unreadCount, onOpenChat }: {
  stats: Array<{ label: string; value: number; onClick: () => void }>;
  unreadCount: number;
  onOpenChat: () => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {stats.map((stat, index) => (
      <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" onClick={stat.onClick}>
        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </div>
    ))}
  </div>
);

// Create missing next tour component
const NextTourCard = ({ showings, onViewDetails }: {
  showings: any[];
  onViewDetails: (id: string) => void;
}) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Tour</h3>
    {showings.length > 0 ? (
      <div className="space-y-2">
        <div className="font-medium">{showings[0].property_address}</div>
        <div className="text-sm text-gray-600">
          {showings[0].preferred_date} at {showings[0].preferred_time}
        </div>
      </div>
    ) : (
      <div className="text-gray-600">No upcoming tours</div>
    )}
  </div>
);

// Create missing enhanced what's next component
const EnhancedWhatsNextCard = ({ onRequestTour, onUpgrade, eligibility, isSubscribed }: {
  onRequestTour: () => void;
  onUpgrade: () => void;
  eligibility: any;
  isSubscribed: boolean;
}) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
    <div className="space-y-3">
      <button 
        onClick={onRequestTour}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Request Another Tour
      </button>
      {!isSubscribed && (
        <button 
          onClick={onUpgrade}
          className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200"
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  </div>
);

const RecentTours = ({ pendingRequests, activeShowings, completedShowings, onChatWithAgent, onReschedule, onMakeOffer, onConfirmShowing }: {
  pendingRequests: any[];
  activeShowings: any[];
  completedShowings: any[];
  onChatWithAgent: (id: string) => void;
  onReschedule: (id: string) => void;
  onMakeOffer: (address: string) => void;
  onConfirmShowing: (showing: any) => void;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-900">Recent Tours</h2>
    <div className="space-y-3">
      {[...pendingRequests, ...activeShowings, ...completedShowings].slice(0, 5).map((showing) => (
        <div key={showing.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="font-medium">{showing.property_address}</div>
          <div className="text-sm text-gray-600 mt-1">Status: {showing.status}</div>
        </div>
      ))}
    </div>
  </div>
);

const RedesignedBuyerDashboard = () => {
  const {
    profile,
    showingCounts,
    loading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    unreadCount,
    handleUpgradeClick,
    handleConfirmShowingWithModal,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    handleSignAgreementFromCard
  } = useOptimizedBuyerLogic();

  const [activeTab, setActiveTab] = useState("requested");
  const [showTourModal, setShowTourModal] = useState(false);

  const handleOpenChat = useCallback((defaultTab: 'property' | 'support', showingId?: string) => {
    console.log(`Opening chat with tab: ${defaultTab}, showing ID: ${showingId}`);
    alert('Chat feature not fully implemented yet.');
  }, []);

  const handleMakeOffer = useCallback((propertyAddress: string) => {
    console.log(`Making offer for property: ${propertyAddress}`);
    alert('Make offer feature not fully implemented yet.');
  }, []);

  const handleRequestShowing = useCallback(() => {
    setShowTourModal(true);
  }, []);

  const handleTourModalSuccess = useCallback(async () => {
    // Refresh data after successful tour request
    window.location.reload();
  }, []);

  const handleSignAgreementFixed = useCallback((showing: any) => {
    const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || 'User';
    handleSignAgreementFromCard(showing.id, displayName);
  }, [handleSignAgreementFromCard, profile, currentUser]);

  return (
    <>
      <ModernDashboardLayout
        header={
          <RedesignedDashboardHeader 
            userName={profile?.first_name || "Buyer"}
            unreadCount={unreadCount}
            onOpenChat={handleOpenChat}
          />
        }
        stats={
          <StatsAndMessages 
            stats={[
              { label: "Requested", value: showingCounts.pending, onClick: () => handleStatClick("requested") },
              { label: "Active Tours", value: showingCounts.active, onClick: () => handleStatClick("active") },
              { label: "Completed", value: showingCounts.completed, onClick: () => handleStatClick("completed") }
            ]}
            unreadCount={unreadCount}
            onOpenChat={() => handleOpenChat('support')}
          />
        }
        mainContent={
          loading ? (
            <OptimizedDashboardSkeleton />
          ) : (
            <RecentTours
              pendingRequests={pendingRequests}
              activeShowings={activeShowings}
              completedShowings={completedShowings}
              onChatWithAgent={handleSendMessage}
              onReschedule={handleRescheduleShowing}
              onMakeOffer={handleMakeOffer}
              onConfirmShowing={handleConfirmShowingWithModal}
            />
          )
        }
        sidebar={
          <div className="space-y-6">
            <NextTourCard 
              showings={[...pendingRequests, ...activeShowings]}
              onViewDetails={(id) => console.log('View details:', id)}
            />
            <EnhancedWhatsNextCard 
              onRequestTour={handleRequestShowing}
              onUpgrade={handleUpgradeClick}
              eligibility={eligibility}
              isSubscribed={isSubscribed}
            />
          </div>
        }
        sections={{
          requested: {
            id: "requested",
            title: "Requested",
            count: showingCounts.pending,
            content: (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <OptimizedShowingCard
                    key={request.id}
                    showing={request}
                    onConfirm={() => handleConfirmShowingWithModal(request)}
                    onCancel={() => handleCancelShowing(request.id)}
                    onReschedule={() => handleRescheduleShowing(request.id)}
                    onSendMessage={() => handleSendMessage(request.id)}
                    onSignAgreement={handleSignAgreementFixed}
                    userType="buyer"
                  />
                ))}
              </div>
            )
          },
          active: {
            id: "active",
            title: "Active Tours",
            count: showingCounts.active,
            content: (
              <div className="space-y-4">
                {activeShowings.map((showing) => (
                  <OptimizedShowingCard
                    key={showing.id}
                    showing={showing}
                    onReschedule={() => handleRescheduleShowing(showing.id)}
                    onCancel={() => handleCancelShowing(showing.id)}
                    onSendMessage={() => handleSendMessage(showing.id)}
                    onSignAgreement={handleSignAgreementFixed}
                    userType="buyer"
                  />
                ))}
              </div>
            )
          },
          completed: {
            id: "completed",
            title: "Completed",
            count: showingCounts.completed,
            content: (
              <div className="space-y-4">
                {completedShowings.map((showing) => (
                  <OptimizedShowingCard
                    key={showing.id}
                    showing={showing}
                    onCancel={() => handleCancelShowing(showing.id)}
                    onReschedule={() => handleRescheduleShowing(showing.id)}
                    onSendMessage={() => handleSendMessage(showing.id)}
                    onSignAgreement={handleSignAgreementFixed}
                    userType="buyer"
                  />
                ))}
              </div>
            )
          }
        }}
        defaultSection="requested"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userId={currentUser?.id}
      />

      <ModernTourSchedulingModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        onSuccess={handleTourModalSuccess}
        skipNavigation={true}
      />
    </>
  );
};

export default RedesignedBuyerDashboard;
