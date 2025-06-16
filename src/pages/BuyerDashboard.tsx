import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Star, Crown } from "lucide-react";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickStatsGrid from "@/components/dashboard/QuickStatsGrid";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import { SubscribeModal } from "@/components/subscription/SubscribeModal";
import { Link } from "react-router-dom";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useToast } from "@/hooks/use-toast";
import MessagesTab from "@/components/messaging/MessagesTab";

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

  // Show loading while auth is loading or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = user || session?.user;
  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <DashboardHeader displayName={displayName} onRequestShowing={handleRequestShowing} />

      <div className="container mx-auto px-4 py-8">
        <QuickStatsGrid 
          pendingCount={pendingRequests.length}
          activeCount={activeShowings.length}
          completedCount={completedShowings.length}
        />

        {/* Show subscription status or upgrade CTA */}
        {isSubscribed ? (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">FirstLook Premium Member</h3>
                <p className="text-sm text-purple-700">
                  You have unlimited access to home tours and VIP priority scheduling! 
                  {subscriptionTier && ` (${subscriptionTier} Plan)`}
                </p>
              </div>
            </div>
          </div>
        ) : eligibility && !eligibility.eligible && (
          <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">Showing Limit Reached</h3>
                  <p className="text-sm text-orange-700 mb-4">
                    {eligibility.reason === 'active_showing_exists' 
                      ? "You have an active showing scheduled. Complete or cancel it to book another, or upgrade to FirstLook Premium for unlimited access."
                      : "You've used your free showing. Upgrade to a FirstLook Premium membership for unlimited home tours and VIP priority scheduling."}
                  </p>
                  <Button 
                    onClick={handleUpgradeClick}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="upcoming">Confirmed Showings</TabsTrigger>
            <TabsTrigger value="history">Showing History</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
              agreements={agreements}
              onComplete={fetchShowingRequests}
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
            />
          </TabsContent>

          <TabsContent value="messages">
            {currentUser?.id ? (
              <MessagesTab userId={currentUser.id} userType="buyer" />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Please sign in to view messages</p>
              </div>
            )}
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
