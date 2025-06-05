import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";
import BuyerDashboardHeader from "@/components/dashboard/buyer/BuyerDashboardHeader";
import BuyerDashboardStats from "@/components/dashboard/buyer/BuyerDashboardStats";
import PendingRequestsTab from "@/components/dashboard/buyer/PendingRequestsTab";
import ConfirmedShowingsTab from "@/components/dashboard/buyer/ConfirmedShowingsTab";
import ShowingHistoryTab from "@/components/dashboard/buyer/ShowingHistoryTab";
import ProfileTab from "@/components/dashboard/buyer/ProfileTab";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
}

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('BuyerDashboard useEffect triggered');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Session:', session);
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user/session found after auth loaded, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    if (user || session?.user) {
      console.log('User found, fetching data...');
      fetchUserData();
      handlePendingTourRequest();
    }
  }, [user, session, authLoading, navigate]);

  const handlePendingTourRequest = async () => {
    const pendingRequest = localStorage.getItem('pendingTourRequest');
    if (!pendingRequest) return;

    try {
      const tourData = JSON.parse(pendingRequest);
      const currentUser = user || session?.user;
      
      if (!currentUser || !tourData.properties?.length) {
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      console.log('Processing pending tour request:', tourData);

      const requests = tourData.properties.map((property: string) => ({
        user_id: currentUser.id,
        property_address: property,
        preferred_date: tourData.preferredDates?.[0]?.date || null,
        preferred_time: tourData.preferredDates?.[0]?.time || null,
        message: tourData.notes || null,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('showing_requests')
        .insert(requests);

      if (error) {
        console.error('Error creating pending showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to process your pending tour request.",
          variant: "destructive"
        });
      } else {
        localStorage.removeItem('pendingTourRequest');
        toast({
          title: "Tour Request Submitted!",
          description: `Your tour request for ${requests.length} property${requests.length > 1 ? 'ies' : ''} has been submitted successfully!`,
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error processing pending tour request:', error);
      localStorage.removeItem('pendingTourRequest');
    }
  };

  const fetchUserData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No current user available for fetchUserData');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting to fetch user data for:', currentUser.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          console.log('No profile found, using user metadata');
          const defaultProfile = {
            id: currentUser.id,
            first_name: currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || 'User',
            last_name: currentUser.user_metadata?.last_name || '',
            phone: currentUser.user_metadata?.phone || '',
            user_type: 'buyer'
          };
          setProfile(defaultProfile);
        }
      } else if (profileData) {
        setProfile(profileData);
        console.log('Profile set:', profileData);
      }

      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
        console.log('Requests set:', requestsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleFormSuccess = () => {
    // Refresh the data when form is successfully submitted
    fetchUserData();
  };

  const handleCancelShowing = async (showingId: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', showingId);

      if (error) {
        console.error('Error cancelling showing:', error);
        toast({
          title: "Error",
          description: "Failed to cancel showing. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Showing Cancelled",
          description: "Your showing has been cancelled successfully.",
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error cancelling showing:', error);
    }
  };

  const handleRescheduleShowing = (showingId: string) => {
    toast({
      title: "Reschedule Request Sent",
      description: "Your showing partner will contact you with new available times.",
    });
  };

  // Organize requests by type - cast status to ShowingStatus for utility functions
  const pendingRequests = showingRequests.filter(req => isPendingRequest(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

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
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="upcoming">Confirmed Showings</TabsTrigger>
            <TabsTrigger value="history">Showing History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <PendingRequestsTab
              pendingRequests={pendingRequests}
              onRequestShowing={handleRequestShowing}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
            />
          </TabsContent>

          <TabsContent value="upcoming">
            <ConfirmedShowingsTab
              activeShowings={activeShowings}
              onRequestShowing={handleRequestShowing}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
            />
          </TabsContent>

          <TabsContent value="history">
            <ShowingHistoryTab
              completedShowings={completedShowings}
              onCancelShowing={handleCancelShowing}
              onRescheduleShowing={handleRescheduleShowing}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab
              profile={profile}
              displayName={displayName}
              userEmail={currentUser?.email || ''}
            />
          </TabsContent>
        </Tabs>
      </div>

      <PropertyRequestForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default BuyerDashboard;
