import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Phone, User, Plus, CheckCircle, AlertCircle, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
}

const BuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    console.log('BuyerDashboard useEffect triggered, user:', user);
    console.log('Auth loading:', authLoading);
    
    // Wait for auth to finish loading before proceeding
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    const fetchData = async () => {
      if (!user) {
        console.log('No user found after auth loaded, ending loading');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching data for user:', user.id);
        await fetchUserData();
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user) {
      console.log('No user available for fetchUserData');
      return;
    }

    try {
      console.log('Starting to fetch user data for:', user.id);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        setError(`Profile error: ${profileError.message}`);
      } else {
        setProfile(profileData);
        console.log('Profile set:', profileData);
      }

      // Fetch showing requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        setError(`Requests error: ${requestsError.message}`);
      } else {
        setShowingRequests(requestsData || []);
        console.log('Requests set:', requestsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(`Unexpected error: ${error}`);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
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
        fetchUserData(); // Refresh data
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingShowings = showingRequests.filter(req => 
    req.status === 'pending' || req.status === 'confirmed'
  );
  
  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed'
  );

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading your dashboard...</div>
          <div className="text-sm text-gray-600">
            Auth loading: {authLoading ? 'Yes' : 'No'}, Data loading: {loading ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading dashboard</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!user) {
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
              <p className="text-gray-600 mt-1">Your Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRequestShowing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Showing
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, {profile?.first_name || 'User'}!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{upcomingShowings.length}</div>
              <div className="text-gray-600">Upcoming Showings</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{showingRequests.length}</div>
              <div className="text-gray-600">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{completedShowings.length}</div>
              <div className="text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
              <div className="text-gray-600">Free Shows Left</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Showings</TabsTrigger>
            <TabsTrigger value="history">Showing History</TabsTrigger>
            <TabsTrigger value="preferences">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Showings</h2>
              <Button 
                onClick={handleRequestShowing}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Showing
              </Button>
            </div>

            {upcomingShowings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No upcoming showings</h3>
                  <p className="text-gray-500 mb-6">Ready to find your dream home? Schedule your first showing!</p>
                  <Button 
                    onClick={handleRequestShowing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Request Your Free Showing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingShowings.map((showing) => (
                  <Card key={showing.id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              variant={showing.status === 'confirmed' ? 'default' : 'secondary'}
                              className={getStatusColor(showing.status)}
                            >
                              {showing.status === 'confirmed' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              {showing.status}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            {showing.property_address}
                          </h3>
                          {showing.preferred_date && (
                            <div className="flex items-center gap-6 text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(showing.preferred_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                              </div>
                              {showing.preferred_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{showing.preferred_time}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {showing.message && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <div className="text-sm font-medium text-blue-800 mb-1">Notes</div>
                              <div className="text-blue-600 text-sm">{showing.message}</div>
                            </div>
                          )}
                          <p className="text-xs text-gray-400">
                            Requested on {new Date(showing.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRescheduleShowing(showing.id)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelShowing(showing.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Showing History</h2>
            
            {completedShowings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed showings yet</h3>
                  <p className="text-gray-500 mb-6">Your showing history will appear here once you complete your first showing.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {completedShowings.map((showing) => (
                  <Card key={showing.id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            {showing.property_address}
                          </h3>
                          {showing.preferred_date && (
                            <div className="flex items-center gap-6 text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(showing.preferred_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                              </div>
                              {showing.preferred_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{showing.preferred_time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-medium">Completed</span>
                              </div>
                            </div>
                          )}
                          {showing.message && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <div className="text-sm font-medium text-blue-800 mb-1">Notes</div>
                              <div className="text-blue-600 text-sm">{showing.message}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleRequestShowing}
                          size="sm" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Book Another Showing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-lg">{profile.first_name} {profile.last_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-lg">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Account Type</label>
                        <p className="text-lg capitalize">{profile.user_type || 'Buyer'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No profile information available.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FirstLook Benefits</CardTitle>
                  <CardDescription>Your current membership status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-green-800">Free Tier</h3>
                        <p className="text-green-600 text-sm">1 free showing remaining</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>First showing completely free</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Licensed, vetted showing partners</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>No pressure, no commitment</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Learn About Additional Services
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
