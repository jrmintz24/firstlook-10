
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Star } from "lucide-react";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignAgreementModal from "@/components/dashboard/SignAgreementModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickStatsGrid from "@/components/dashboard/QuickStatsGrid";
import ShowingListTab from "@/components/dashboard/ShowingListTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import { Link } from "react-router-dom";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useToast } from "@/hooks/use-toast";

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const { toast } = useToast();
  const { eligibility, checkEligibility } = useShowingEligibility();
  
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
    handleAgreementSign
  } = useBuyerDashboard();

  const handleRequestShowing = async () => {
    // Check eligibility before opening the form
    const currentEligibility = await checkEligibility();
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'active_showing_exists') {
        toast({
          title: "Active Showing Exists",
          description: "You already have a showing scheduled. Complete or cancel it before booking another.",
          variant: "destructive"
        });
        return;
      } else if (currentEligibility?.reason === 'free_showing_used') {
        toast({
          title: "Subscription Required",
          description: "You've used your free showing. Subscribe to continue viewing homes!",
        });
        // Could redirect to subscriptions page here
        return;
      }
    }
    
    setShowPropertyForm(true);
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

        {/* Show eligibility status if helpful */}
        {eligibility && !eligibility.eligible && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Showing Status</h3>
                <p className="text-sm text-blue-700">
                  {eligibility.reason === 'active_showing_exists' 
                    ? "You have an active showing scheduled. Complete or cancel it to book another."
                    : eligibility.reason === 'free_showing_used'
                    ? "You've used your free showing. Subscribe to view more homes!"
                    : "Check your showing eligibility in your profile."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="upcoming">Confirmed Showings</TabsTrigger>
            <TabsTrigger value="history">Showing History</TabsTrigger>
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
    </div>
  );
};

export default BuyerDashboard;
