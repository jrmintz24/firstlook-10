
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Star, Crown, Clock, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { Link } from "react-router-dom";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useToast } from "@/hooks/use-toast";
import MessagesTab from "@/components/messaging/MessagesTab";
import { useMessages } from "@/hooks/useMessages";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TourProgressTracker from "@/components/dashboard/TourProgressTracker";
import SmartReminders from "@/components/dashboard/SmartReminders";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import TourHistoryInsights from "@/components/dashboard/TourHistoryInsights";

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
    // Check eligibility before opening the form
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
        // Don't show the old toast, user will see the updated UI notification
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
    
    // Refresh subscription status and dashboard data
    await refreshStatus();
    await fetchUserData();
    
    toast({
      title: "Welcome to FirstLook Premium! 🎉",
      description: "You can now book unlimited home tours!",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleConfirmShowingWithModal = (showing: any) => {
    handleConfirmShowing(showing);
    setShowAgreementModal(true);
  };

  const handleAgreementSignWithModal = async (name: string) => {
    await handleAgreementSign(name);
    setShowAgreementModal(false);
  };

  const handleSendMessage = async (requestId: string) => {
    // This would open a send message modal - placeholder for now
    toast({
      title: "Coming Soon",
      description: "Direct messaging will be available soon!",
    });
  };

  // Convert agreements object to array format for ShowingListTab
  const agreementsArray = Object.entries(agreements).map(([showing_request_id, signed]) => ({
    id: showing_request_id,
    showing_request_id,
    signed
  }));

  // Show loading while auth is loading or data is loading
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

  // This should rarely happen now since we redirect above
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

  // Create enhanced buyer-specific stats with more relevant information
  const buyerStats = [
    {
      value: pendingRequests.length,
      label: "Pending Tours",
      subtitle: pendingRequests.length > 0 ? "Awaiting confirmation" : "All tours confirmed",
      icon: Clock,
      iconColor: "text-amber-500",
      trend: pendingRequests.length > 0 ? {
        value: "Action needed",
        direction: 'neutral' as const
      } : undefined,
      actionable: true
    },
    {
      value: activeShowings.length,
      label: "Confirmed Tours",
      subtitle: activeShowings.length > 0 ? "Ready to tour" : "No upcoming tours",
      icon: Calendar,
      iconColor: "text-blue-500",
      trend: activeShowings.length > 0 ? {
        value: "This week",
        direction: 'up' as const
      } : undefined,
      progress: activeShowings.length > 0 ? {
        current: activeShowings.filter(s => s.status === 'scheduled').length,
        max: activeShowings.length,
        color: 'bg-blue-500'
      } : undefined
    },
    {
      value: unreadCount > 0 ? unreadCount : "0",
      label: "New Messages",
      subtitle: unreadCount > 0 ? "From your agents" : "All caught up",
      icon: MessageCircle,
      iconColor: "text-purple-500",
      trend: unreadCount > 0 ? {
        value: "Needs response",
        direction: 'neutral' as const
      } : undefined,
      actionable: true
    },
    {
      value: completedShowings.filter(s => s.status === 'completed').length,
      label: "Tours Completed",
      subtitle: completedShowings.filter(s => s.status === 'completed').length > 0 ? "Properties viewed" : "Start exploring",
      icon: MapPin,
      iconColor: "text-green-500",
      trend: completedShowings.filter(s => s.status === 'completed').length > 0 ? {
        value: "Great progress!",
        direction: 'up' as const
      } : undefined,
      progress: completedShowings.filter(s => s.status === 'completed').length > 0 ? {
        current: completedShowings.filter(s => s.status === 'completed').length,
        max: Math.max(5, completedShowings.filter(s => s.status === 'completed').length),
        color: 'bg-green-500'
      } : undefined
    }
  ];

  const handleStatClick = (statIndex: number) => {
    switch (statIndex) {
      case 0: // Pending tours
        // Switch to pending tab
        break;
      case 2: // Messages
        // Switch to messages tab
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <DashboardHeader displayName={displayName} onRequestShowing={handleRequestShowing} />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <EnhancedStatsGrid stats={buyerStats} onStatClick={handleStatClick} />

        {/* Show subscription status or upgrade CTA */}
        {isSubscribed ? (
          <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">FirstLook Premium Member</h3>
                <p className="text-sm text-gray-600">
                  You have unlimited access to home tours and VIP priority scheduling! 
                  {subscriptionTier && ` (${subscriptionTier} Plan)`}
                </p>
              </div>
            </div>
          </div>
        ) : eligibility && !eligibility.eligible && (
          <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-50 mt-1">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Showing Limit Reached</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {eligibility.reason === 'active_showing_exists' 
                      ? "You have an active showing scheduled. Complete or cancel it to book another, or upgrade to FirstLook Premium for unlimited access."
                      : "You've used your free showing. Upgrade to a FirstLook Premium membership for unlimited home tours and VIP priority scheduling."}
                  </p>
                  <Button 
                    onClick={handleUpgradeClick}
                    className="bg-gray-900 hover:bg-black text-white font-medium rounded-xl"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Feed - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ActivityFeed 
              showingRequests={allShowings} 
              userType="buyer" 
              currentUserId={currentUser?.id}
            />
          </div>
          
          {/* Smart Reminders */}
          <div>
            <SmartReminders 
              showingRequests={allShowings} 
              userType="buyer" 
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

        {/* Progress Tracker and Insights */}
        {activeShowings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TourProgressTracker 
              showing={activeShowings[0]} 
              userType="buyer" 
            />
            <TourHistoryInsights 
              completedShowings={completedShowings}
              userType="buyer"
              onRequestShowing={handleRequestShowing}
            />
          </div>
        )}

        {/* Tour History Insights for users with no active showings */}
        {activeShowings.length === 0 && (
          <div className="mb-8">
            <TourHistoryInsights 
              completedShowings={completedShowings}
              userType="buyer"
              onRequestShowing={handleRequestShowing}
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
            <TabsTrigger value="pending" className="rounded-lg font-medium">Pending Requests</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-lg font-medium">Confirmed Showings</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg font-medium">Showing History</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg font-medium">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
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
          </TabsContent>

          <TabsContent value="upcoming">
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
          </TabsContent>

          <TabsContent value="history">
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
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab 
              profile={profile}
              userEmail={currentUser?.email}
              displayName={displayName}
            />
          </TabsContent>
        </Tabs>
      </div>

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
    </div>
  );
};

export default BuyerDashboard;
