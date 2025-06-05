
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FullPageLoading, LoadingState, ErrorState } from "@/components/ui/loading-states";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import BuyerDashboardHeader from "@/components/dashboard/buyer/BuyerDashboardHeader";
import BuyerDashboardStats from "@/components/dashboard/buyer/BuyerDashboardStats";
import PendingRequestsTab from "@/components/dashboard/buyer/PendingRequestsTab";
import ConfirmedShowingsTab from "@/components/dashboard/buyer/ConfirmedShowingsTab";
import ShowingHistoryTab from "@/components/dashboard/buyer/ShowingHistoryTab";
import ProfileTab from "@/components/dashboard/buyer/ProfileTab";

const BuyerDashboard = () => {
  const {
    // Data
    pendingRequests,
    activeShowings,
    completedShowings,
    profile,
    
    // Loading states
    authLoading,
    requestsLoading,
    profileLoading,
    
    // Errors
    requestsError,
    profileError,
    
    // UI state
    showPropertyForm,
    setShowPropertyForm,
    
    // Actions
    handleRequestShowing,
    handleCancelShowing,
    handleRescheduleShowing,
    
    // User info
    currentUser,
    isAuthenticated
  } = useBuyerDashboard();

  // Show loading while auth is loading
  if (authLoading) {
    return <FullPageLoading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
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

  // Show loading while data is being fetched
  if (requestsLoading || profileLoading) {
    return <FullPageLoading message="Loading your dashboard..." />;
  }

  // Handle errors
  if (requestsError || profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <ErrorState 
          error={requestsError || profileError || new Error('Unknown error')}
          onRetry={() => window.location.reload()}
          title="Failed to load dashboard"
        />
      </div>
    );
  }

  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <BuyerDashboardHeader 
        displayName={displayName} 
        onRequestShowing={handleRequestShowing} 
      />

      <div className="container mx-auto px-4 py-8">
        <BuyerDashboardStats
          pendingRequests={pendingRequests.length}
          activeShowings={activeShowings.length}
          completedShowings={completedShowings.length}
        />

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Confirmed Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="history">Showing History ({completedShowings.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {requestsLoading ? (
              <LoadingState message="Loading pending requests..." />
            ) : (
              <PendingRequestsTab
                pendingRequests={pendingRequests}
                onRequestShowing={handleRequestShowing}
                onCancelShowing={handleCancelShowing}
                onRescheduleShowing={handleRescheduleShowing}
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {requestsLoading ? (
              <LoadingState message="Loading confirmed showings..." />
            ) : (
              <ConfirmedShowingsTab
                activeShowings={activeShowings}
                onRequestShowing={handleRequestShowing}
                onCancelShowing={handleCancelShowing}
                onRescheduleShowing={handleRescheduleShowing}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            {requestsLoading ? (
              <LoadingState message="Loading showing history..." />
            ) : (
              <ShowingHistoryTab
                completedShowings={completedShowings}
                onCancelShowing={handleCancelShowing}
                onRescheduleShowing={handleRescheduleShowing}
              />
            )}
          </TabsContent>

          <TabsContent value="profile">
            {profileLoading ? (
              <LoadingState message="Loading profile..." />
            ) : (
              <ProfileTab
                profile={profile}
                displayName={displayName}
                userEmail={currentUser?.email || ''}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default BuyerDashboard;
