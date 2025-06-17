
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Home, MessageSquare, User, TrendingUp, Clock, CheckCircle } from "lucide-react";
import MakeOfferModal from "./MakeOfferModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
}

const SimpleBuyerDashboard = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { toast } = useToast();

  const currentUser = user || session?.user;
  const displayName = currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    fetchShowingRequests();
  }, [currentUser, authLoading]);

  const fetchShowingRequests = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        setShowingRequests(data || []);
      }
    } catch (error) {
      console.error('Exception fetching showing requests:', error);
      setShowingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Please sign in to view your dashboard</div>
          <Link to="/buyer-auth">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FirstLook
              </Link>
              <p className="text-gray-600 mt-1 font-medium">Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">
                Buyer
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="font-medium">Welcome, {displayName}!</span>
              </div>
              <Button 
                onClick={() => setShowPropertyForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                New Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <div className="text-sm text-gray-600">Pending Tours</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeShowings.length}</div>
                <div className="text-sm text-gray-600">Confirmed Tours</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedShowings.length}</div>
                <div className="text-sm text-gray-600">Completed Tours</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{showingRequests.length}</div>
                <div className="text-sm text-gray-600">Total Properties</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setShowPropertyForm(true)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <Calendar className="w-5 h-5" />
              Book a Tour
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowMakeOffer(true)}
              className="flex items-center justify-center gap-2 h-12"
            >
              <Home className="w-5 h-5" />
              Make an Offer
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-12"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Agent
            </Button>
          </div>
        </Card>

        {/* Recent Tours */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Tours</h2>
          {showingRequests.length > 0 ? (
            <div className="space-y-4">
              {showingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{request.property_address}</div>
                    <div className="text-sm text-gray-600">
                      {request.preferred_date && request.preferred_time ? 
                        `${request.preferred_date} at ${request.preferred_time}` : 
                        'Date TBD'
                      }
                    </div>
                    {request.assigned_agent_name && (
                      <div className="text-sm text-gray-600">Agent: {request.assigned_agent_name}</div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tours yet!</p>
              <Button onClick={() => setShowPropertyForm(true)}>
                Book Your First Tour
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <MakeOfferModal 
        isOpen={showMakeOffer} 
        onClose={() => setShowMakeOffer(false)} 
      />
      
      <PropertyRequestForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
};

export default SimpleBuyerDashboard;
