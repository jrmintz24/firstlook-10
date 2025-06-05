
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Phone, User, Plus, CheckCircle, AlertCircle, Star, ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AgentRequestCard from "@/components/dashboard/AgentRequestCard";
import StatusUpdateModal from "@/components/dashboard/StatusUpdateModal";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";
import { useAgentDashboard } from "@/hooks/useAgentDashboard";

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
  user_id?: string | null;
  assigned_agent_id?: string | null;
}

const AgentDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<ShowingRequest | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const {
    profile,
    showingRequests,
    loading,
    authLoading,
    user,
    session,
    navigate,
    fetchAgentData,
    handleAssignToSelf,
    handleStatusUpdate
  } = useAgentDashboard();

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
      navigate('/');
      return;
    }

    if (user || session?.user) {
      console.log('User found, fetching agent data...');
      fetchAgentData();
    }
  }, [user, session, authLoading, navigate, fetchAgentData]);

  const handleStatusUpdateWrapper = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    await handleStatusUpdate(requestId, newStatus, estimatedDate);
    setShowStatusModal(false);
    setSelectedRequest(null);
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FirstLook
              </Link>
              <p className="text-gray-600 mt-1">Agent Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800">Agent</Badge>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, {displayName}!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{unassignedRequests.length}</div>
              <div className="text-gray-600">Unassigned Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{myRequests.length}</div>
              <div className="text-gray-600">My Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{activeShowings.length}</div>
              <div className="text-gray-600">Active Showings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{myRequests.filter(r => r.status === 'completed').length}</div>
              <div className="text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="unassigned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="unassigned">Unassigned ({unassignedRequests.length})</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests ({myRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Showings ({activeShowings.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Unassigned Requests</h2>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                {unassignedRequests.length} Available
              </Badge>
            </div>

            {unassignedRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No unassigned requests</h3>
                  <p className="text-gray-500">All current requests have been assigned to agents.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {unassignedRequests.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => handleAssignToSelf(request.id)}
                    onUpdateStatus={(status, estimatedDate) => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    showAssignButton={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {myRequests.length} Assigned
              </Badge>
            </div>

            {myRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No assigned requests</h3>
                  <p className="text-gray-500">Visit the unassigned tab to claim new showing requests.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myRequests.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => {}}
                    onUpdateStatus={() => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    showAssignButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Active Showings</h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {activeShowings.length} Confirmed
              </Badge>
            </div>

            {activeShowings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No active showings</h3>
                  <p className="text-gray-500">Confirmed showings will appear here when scheduled.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {activeShowings.map((request) => (
                  <AgentRequestCard
                    key={request.id}
                    request={request}
                    onAssign={() => {}}
                    onUpdateStatus={() => {
                      setSelectedRequest(request);
                      setShowStatusModal(true);
                    }}
                    showAssignButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Agent Profile</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your agent account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-lg">{displayName} {profile?.last_name || ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg">{currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-lg">{profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Type</label>
                      <Badge className="bg-purple-100 text-purple-800">Agent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Your showing statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Assigned</span>
                      <span className="font-semibold">{myRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">{myRequests.filter(r => r.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">In Progress</span>
                      <span className="font-semibold text-blue-600">{myRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
          onUpdateStatus={handleStatusUpdateWrapper}
        />
      )}
    </div>
  );
};

export default AgentDashboard;
