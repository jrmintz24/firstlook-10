
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  license_number?: string;
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

const UserDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch showing requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Requests error:', requestsError);
      } else {
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{profile.first_name} {profile.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg">{profile.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Type</label>
                <p className="text-lg capitalize">{profile.user_type}</p>
              </div>
              {profile.license_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">License Number</label>
                  <p className="text-lg">{profile.license_number}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No profile information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Showing Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Showing Requests</CardTitle>
          <CardDescription>
            Track your property showing requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showingRequests.length > 0 ? (
            <div className="space-y-4">
              {showingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{request.property_address}</span>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  {request.preferred_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
                      {request.preferred_time && (
                        <>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{request.preferred_time}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {request.message && (
                    <p className="text-sm text-gray-600 mt-2">{request.message}</p>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No showing requests yet. Request your first showing to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
