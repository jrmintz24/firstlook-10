
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoading, LoadingState, ErrorState } from "@/components/ui/loading-states";
import { useShowingRequests, useUpdateShowingRequest } from "@/hooks/useShowingRequests";
import { useUserProfile } from "@/hooks/useUserProfile";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import BuyerDashboardHeader from "@/components/dashboard/buyer/BuyerDashboardHeader";
import BuyerDashboardStats from "@/components/dashboard/buyer/BuyerDashboardStats";
import PendingRequestsTab from "@/components/dashboard/buyer/PendingRequestsTab";
import ConfirmedShowingsTab from "@/components/dashboard/buyer/ConfirmedShowingsTab";
import ShowingHistoryTab from "@/components/dashboard/buyer/ShowingHistoryTab";
import ProfileTab from "@/components/dashboard/buyer/ProfileTab";

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { user, session, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Use our new hooks for data fetching
  const { 
    data: showingRequests = [], 
    isLoading: requestsLoading, 
    error: requestsError 
  } = useShowingRequests();
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useUserProfile();

  const updateShowingMutation = useUpdateShowingRequest();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    handlePendingTourRequest();
  }, [isAuthenticated, authLoading, navigate]);

  const handlePendingTourRequest = async () => {
    const pendingRequest = localStorage.getItem('pendingTourRequest');
    if (!pendingRequest || !user) return;

    try {
      const tourData = JSON.parse(pendingRequest);
      
      if (!tourData.properties?.length) {
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      // This would be handled by the PropertyRequestForm component
      // when it's opened, so we just clean up here
      localStorage.removeItem('pendingTourRequest');
    } catch (error) {
      console.error('Error processing pending tour request:', error);
      localStorage.removeItem('pendingTourRequest');
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleCancelShowing = async (showingId: string) => {
    updateShowingMutation.mutate({
      id: showingId,
      updates: { status: 'cancelled' }
    });
  };

  const handleRescheduleShowing = (showingId: string) => {
    // This would trigger a more complex flow - for now just show a message
    console.log('Reschedule showing:', showingId);
  };

  // Organize requests by type
  const pendingRequests = showingRequests.filter(req => isPendingRequest(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

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

  const currentUser = user || session?.user;
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
