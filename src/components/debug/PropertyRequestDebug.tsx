
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PropertyRequestDebug = () => {
  const { user } = useAuth();
  const [showingRequests, setShowingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShowingRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Debug: Error fetching showing requests:', error);
      } else {
        console.log('Debug: Showing requests fetched:', data);
        setShowingRequests(data || []);
      }
    } catch (err) {
      console.error('Debug: Exception fetching showing requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowingRequests();
  }, [user]);

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Property Request Debug
          <Button onClick={fetchShowingRequests} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
          <div>
            <strong>User Email:</strong> {user.email}
          </div>
          <div>
            <strong>Showing Requests Count:</strong> {showingRequests.length}
          </div>
          
          {showingRequests.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Recent Requests:</h3>
              <div className="space-y-2">
                {showingRequests.slice(0, 5).map((request: any) => (
                  <div key={request.id} className="p-2 border rounded text-sm">
                    <div><strong>Address:</strong> {request.property_address}</div>
                    <div><strong>Status:</strong> {request.status}</div>
                    <div><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showingRequests.length === 0 && !loading && (
            <div className="text-gray-500">No showing requests found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyRequestDebug;
