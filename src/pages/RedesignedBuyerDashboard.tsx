import React, { useState, useCallback } from "react";
import { useOptimizedBuyerLogic } from "@/hooks/useOptimizedBuyerLogic";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import RedesignedDashboardHeader from "@/components/dashboard/RedesignedDashboardHeader";
import StatsAndMessages from "@/components/dashboard/StatsAndMessages";
import RecentTours from "@/components/dashboard/RecentTours";
import OptimizedDashboardSkeleton from "@/components/dashboard/OptimizedDashboardSkeleton";
import NextTourCard from "@/components/dashboard/NextTourCard";
import EnhancedWhatsNextCard from "@/components/dashboard/EnhancedWhatsNextCard";
import OptimizedShowingCard from "@/components/dashboard/OptimizedShowingCard";

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
    handleRequestShowing,
    handleUpgradeClick,
    handleConfirmShowingWithModal,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    handleSignAgreementFromCard
  } = useOptimizedBuyerLogic();

  const [activeTab, setActiveTab] = useState("requested");

  const handleOpenChat = useCallback((defaultTab: 'property' | 'support', showingId?: string) => {
    // Placeholder for chat opening logic
    console.log(`Opening chat with tab: ${defaultTab}, showing ID: ${showingId}`);
    alert('Chat feature not fully implemented yet.');
  }, []);

  const handleMakeOffer = useCallback((propertyAddress: string) => {
    // Placeholder for make offer logic
    console.log(`Making offer for property: ${propertyAddress}`);
    alert('Make offer feature not fully implemented yet.');
  }, []);

  return (
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
                  onMessage={() => handleSendMessage(request.id)}
                  onSignAgreement={handleSignAgreementFromCard}
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
                  onMessage={() => handleSendMessage(showing.id)}
                  onSignAgreement={handleSignAgreementFromCard}
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
                  onMessage={() => handleSendMessage(showing.id)}
                  onSignAgreement={handleSignAgreementFromCard}
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
  );
};

export default RedesignedBuyerDashboard;
