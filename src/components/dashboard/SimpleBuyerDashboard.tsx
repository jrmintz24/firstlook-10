
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import MakeOfferModal from "./MakeOfferModal";
import PropertyRequestForm from "@/components/PropertyRequestForm";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import RecentTours from "./RecentTours";

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

  console.log('SimpleBuyerDashboard: Auth loading:', authLoading, 'Loading:', loading, 'User:', currentUser?.email);

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
      console.log('SimpleBuyerDashboard: Fetching showing requests for user:', currentUser.id);
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
        console.log('SimpleBuyerDashboard: Loaded', data?.length || 0, 'showing requests');
        setShowingRequests(data || []);
      }
    } catch (error) {
      console.error('Exception fetching showing requests:', error);
      setShowingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  // Show loading spinner while auth is loading
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

  // Show sign in prompt if no user
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

  // Show loading spinner while fetching data
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

  console.log('SimpleBuyerDashboard: Rendering dashboard for user:', currentUser.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-white">
      <DashboardHeader 
        displayName={displayName}
        onRequestShowing={handleRequestShowing}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DashboardStats
          pendingCount={pendingRequests.length}
          activeCount={activeShowings.length}
          completedCount={completedShowings.length}
          totalCount={showingRequests.length}
        />

        <QuickActions
          onBookTour={handleRequestShowing}
          onMakeOffer={() => setShowMakeOffer(true)}
        />

        <RecentTours
          showingRequests={showingRequests}
          onBookTour={handleRequestShowing}
        />
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
