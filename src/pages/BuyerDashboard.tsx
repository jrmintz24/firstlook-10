
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Star, Crown, Clock, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import MessagesTab from "@/components/messaging/MessagesTab";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { Link } from "react-router-dom";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/hooks/useMessages";
import TourProgressTracker from "@/components/dashboard/TourProgressTracker";
import TourHistoryInsights from "@/components/dashboard/TourHistoryInsights";
import FocusedStatsGrid from "@/components/dashboard/FocusedStatsGrid";
import UpdatesPanel from "@/components/dashboard/UpdatesPanel";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const { toast } = useToast();
  const { eligibility, checkEligibility } = useShowingEligibility();
  const { isSubscribed, subscriptionTier, refreshStatus } = useSubscriptionStatus();
  
  const {
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchUserData,
    fetchShowingRequests
  } = useBuyerDashboard();

  const currentUser = user || session?.user;
  const { unreadCount, sendMessage } = useMessages(currentUser?.id || '');

  const handleRequestShowing = async () => {
    const currentEligibility = await checkEligibility() as EligibilityResult | null;
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'active_showing_exists') {
        toast({
          title: "Active Showing Exists",
          description: "You already have a showing scheduled. Complete or cancel it before booking another.",
          variant: "destructive"
        });
        return;
      } else if (currentEligibility?.reason === 'free_showing_used') {
        return;
      }
    }
    
    setShowPropertyForm(true);
  };

  const handleUpgradeClick = () => {
    console.log('Upgrade button clicked', {
      userId: user?.id,
      email: user?.email,
      eligibilityReason: eligibility?.reason,
      timestamp: new Date().toISOString()
    });
    setShowSubscribeModal(true);
  };

  const handleSubscriptionComplete = async () => {
    console.log('Subscription completed from dashboard', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    });
    
    await refreshStatus();
    await fetchUserData();
    
    toast({
      title: "Welcome to FirstLook Premium! 🎉",
      description: "You can now book unlimited home tours!",
    });
  };

  const handleConfirmShowingWithModal = (showing: any) => {
    handleConfirmShowing(showing);
    setShowAgreementModal(true);
  };

  const handleAgreementSignWithModal = async (name: string) => {
    await handleAgreementSign(name);
    setShowAgreementModal(false);
  };

  const handleSendMessage = async (requestId: string) => {
    toast({
      title: "Coming Soon",
      description: "Direct messaging will be available soon!",
    });
  };

  const agreementsArray = Object.entries(agreements).map(([showing_request_id, signed]) => ({
    id: showing_request_id,
    showing_request_id,
    signed
  }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading your dashboard...</div>
          <div className="text-sm text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading dashboard data...'}
          </div>
        </div>
      </div>
    );
  }

  if (!user && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';
  const allShowings = [...pendingRequests, ...activeShowings, ...completedShowings];

  // Create focused buyer stats (only 3 most important)
  const focusedStats = [
    {
      value: pendingRequests.length + activeShowings.length,
      label: "Active Tours",
      subtitle: pendingRequests.length > 0 ? "Awaiting confirmation" : activeShowings.length > 0 ? "Ready to tour" : "No active tours",
      icon: Calendar,
      iconColor: "text-blue-500",
      status: pendingRequests.length > 0 ? 'urgent' as const : 'normal' as const,
      actionable: true
    },
    {
      value: unreadCount > 0 ? unreadCount : "0",
      label: "Messages",
      subtitle: unreadCount > 0 ? "Needs attention" : "All caught up",
      icon: MessageCircle,
      iconColor: "text-purple-500",
      status: unreadCount > 0 ? 'urgent' as const : 'normal' as const,
      actionable: true
    },
    {
      value: completedShowings.filter(s => s.status === 'completed').length,
      label: "Completed",
      subtitle: "Properties viewed",
      icon: CheckCircle,
      iconColor: "text-green-500",
      status: 'success' as const
    }
  ];

  const handleStatClick = (statIndex: number) => {
    // Handle stat clicks for navigation
  };

  // Dashboard sections for tabs
  const dashboardSections = [
    {
      id: "active",
      label: "Active Tours",
      count: pendingRequests.length + activeShowings.length,
      content: (
        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <ShowingListTab
              title="Pending Requests"
              showings={pendingRequests}
              emptyIcon={AlertCircle}
              emptyTitle="No pending requests"
              emptyDescription="Ready to find your dream home? Submit a showing request!"
              emptyButtonText="Request Your Free Showing"
              onRequestShowing={handleRequestShowing}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
              onComplete={fetchShowingRequests}
              currentUserId={currentUser?.id}
            />
          )}
          
          {activeShowings.length > 0 && (
            <ShowingListTab
              title="Confirmed Showings"
              showings={activeShowings}
              emptyIcon={Calendar}
              emptyTitle="No confirmed showings"
              emptyDescription="Once your requests are confirmed, they'll appear here."
              emptyButtonText="Request Your Free Showing"
              onRequestShowing={handleRequestShowing}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
              onConfirmShowing={handleConfirmShowingWithModal}
              agreements={agreementsArray}
              onComplete={fetchShowingRequests}
              currentUserId={currentUser?.id}
            />
          )}

          {pendingRequests.length === 0 && activeShowings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No active tours</h3>
              <p className="text-gray-500 mb-6">Ready to find your dream home?</p>
              <Button 
                onClick={handleRequestShowing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Request Your Free Showing
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: "messages",
      label: "Messages",
      count: unreadCount,
      content: currentUser?.id ? (
        <MessagesTab userId={currentUser.id} userType="buyer" />
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Sign in to view messages</h3>
          <p className="text-gray-500">Your conversations with agents will appear here</p>
        </div>
      )
    },
    {
      id: "history",
      label: "History",
      count: completedShowings.length,
      content: (
        <ShowingListTab
          title="Showing History"
          showings={completedShowings}
          emptyIcon={Star}
          emptyTitle="No completed showings yet"
          emptyDescription="Your showing history will appear here once you complete your first showing."
          emptyButtonText="Request Your Free Showing"
          onRequestShowing={handleRequestShowing}
          onCancelShowing={handleCancelShowing}
          onRescheduleShowing={handleRescheduleShowing}
          showActions={false}
          onComplete={fetchShowingRequests}
          currentUserId={currentUser?.id}
        />
      )
    },
    {
      id: "profile",
      label: "Profile",
      content: (
        <ProfileTab 
          profile={profile}
          userEmail={currentUser?.email}
          displayName={displayName}
        />
      )
    }
  ];

  // Header component
  const header = <DashboardHeader displayName={displayName} onRequestShowing={handleRequestShowing} />;

  // Stats component
  const stats = (
    <div>
      <FocusedStatsGrid stats={focusedStats} onStatClick={handleStatClick} />
      
      {/* Subscription status */}
      {isSubscribed ? (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">FirstLook Premium</h3>
              <p className="text-sm text-gray-600">Unlimited tours • VIP priority</p>
            </div>
          </div>
        </div>
      ) : eligibility && !eligibility.eligible && (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-50 mt-1">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Showing Limit Reached</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {eligibility.reason === 'active_showing_exists' 
                    ? "Complete your current showing to book another, or upgrade for unlimited access."
                    : "You've used your free showing. Upgrade for unlimited tours."}
                </p>
                <Button 
                  onClick={handleUpgradeClick}
                  size="sm"
                  className="bg-gray-900 hover:bg-black text-white font-medium rounded-lg"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Main content (tour progress for active showings)
  const mainContent = activeShowings.length > 0 ? (
    <TourProgressTracker 
      showing={activeShowings[0]} 
      userType="buyer" 
    />
  ) : (
    <TourHistoryInsights 
      completedShowings={completedShowings}
      userType="buyer"
      onRequestShowing={handleRequestShowing}
    />
  );

  // Sidebar content
  const sidebar = (
    <UpdatesPanel 
      showingRequests={allShowings} 
      userType="buyer" 
      onSendMessage={handleSendMessage}
    />
  );

  return (
    <>
      <DashboardLayout
        header={header}
        stats={stats}
        mainContent={mainContent}
        sidebar={sidebar}
        sections={dashboardSections}
        defaultSection="active"
      />

      <ErrorBoundary>
        <PropertyRequestForm
          isOpen={showPropertyForm}
          onClose={() => setShowPropertyForm(false)}
        />
      </ErrorBoundary>

      {selectedShowing && (
        <SignAgreementModal
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          onSign={handleAgreementSignWithModal}
        />
      )}

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </>
  );
};

export default BuyerDashboard;
