
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";
import AgentDashboardHeader from "@/components/dashboard/agent/AgentDashboardHeader";
import AgentDashboardStats from "@/components/dashboard/agent/AgentDashboardStats";
import UnassignedRequestsTab from "@/components/dashboard/agent/UnassignedRequestsTab";
import MyRequestsTab from "@/components/dashboard/agent/MyRequestsTab";
import ActiveShowingsTab from "@/components/dashboard/agent/ActiveShowingsTab";
import AgentProfileTab from "@/components/dashboard/agent/AgentProfileTab";
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
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

const AgentDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ShowingRequest | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AgentDashboard useEffect triggered');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Session:', session);
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user/session found, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    if (user || session?.user) {
      console.log('User found, fetching agent data...');
      fetchAgentData();
    }
  }, [user, session, authLoading, navigate]);

  const fetchAgentData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No current user available for fetchAgentData');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting to fetch agent data for:', currentUser.id);
      
      // Fetch profile to verify agent status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError || !profileData || profileData.user_type !== 'agent') {
        console.log('User is not an agent or profile not found');
        toast({
          title: "Access Denied",
          description: "You need to be an agent to access this dashboard.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProfile(profileData);

      // Fetch all showing requests for agents
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
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
      console.error('Error fetching agent data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleAssignToSelf = async (requestId: string) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) return;

    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          assigned_agent_id: currentUser.id,
          assigned_agent_name: `${profile.first_name} ${profile.last_name}`,
          assigned_agent_phone: profile.phone,
          assigned_agent_email: currentUser.email,
          status: 'under_review'
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error assigning request:', error);
        toast({
          title: "Error",
          description: "Failed to assign request. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Request Assigned",
          description: "You have been assigned to this showing request.",
        });
        fetchAgentData(); // Refresh data
      }
    } catch (error) {
      console.error('Error assigning request:', error);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    try {
      const updates: any = { status: newStatus };
      if (estimatedDate) {
        updates.estimated_confirmation_date = estimatedDate;
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Status Updated",
          description: "The request status has been updated successfully.",
        });
        fetchAgentData(); // Refresh data
        setShowStatusModal(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Organize requests by type
  const unassignedRequests = showingRequests.filter(req => 
    isPendingRequest(req.status as ShowingStatus) && !req.assigned_agent_id
  );
  const myRequests = showingRequests.filter(req => 
    req.assigned_agent_id === (user?.id || session?.user?.id)
  );
  const activeShowings = myRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  // Show loading while auth is loading or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading agent dashboard...</div>
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
          <div className="text-lg mb-4">Please sign in to view your agent dashboard</div>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = user || session?.user;
  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'Agent';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <AgentDashboardHeader displayName={displayName} />

      <div className="container mx-auto px-4 py-8">
        <AgentDashboardStats
          unassignedCount={unassignedRequests.length}
          myRequestsCount={myRequests.length}
          activeShowingsCount={activeShowings.length}
          completedCount={myRequests.filter(r => r.status === 'completed').length}
        />

        <Tabs defaultValue="unassigned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="unassigned">Unassigned ({unassignedRequests.length})</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned">
            <UnassignedRequestsTab
              unassignedRequests={unassignedRequests}
              onAssignToSelf={handleAssignToSelf}
              onUpdateStatus={(requestId) => {
                const request = showingRequests.find(r => r.id === requestId);
                if (request) {
                  setSelectedRequest(request);
                  setShowStatusModal(true);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="my-requests">
            <MyRequestsTab
              myRequests={myRequests}
              onUpdateStatus={(requestId) => {
                const request = showingRequests.find(r => r.id === requestId);
                if (request) {
                  setSelectedRequest(request);
                  setShowStatusModal(true);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="active">
            <ActiveShowingsTab
              activeShowings={activeShowings}
              onUpdateStatus={(requestId) => {
                const request = showingRequests.find(r => r.id === requestId);
                if (request) {
                  setSelectedRequest(request);
                  setShowStatusModal(true);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="profile">
            <AgentProfileTab
              profile={profile}
              currentUser={currentUser}
              displayName={displayName}
              myRequests={myRequests}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AgentDashboard;
