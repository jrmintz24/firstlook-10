import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail,
  Star,
  DollarSign,
  Home,
  Eye,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  buyer_id: string;
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  connection_date: string;
  status: 'active' | 'inactive';
  total_tours: number;
  favorite_properties: number;
  offers_made: number;
  last_activity: string;
  recent_properties: string[];
}

interface MyClientsTabProps {
  agentId: string;
}

const MyClientsTab: React.FC<MyClientsTabProps> = ({ agentId }) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (agentId) {
      fetchMyClients();
    }
  }, [agentId]);

  const fetchMyClients = async () => {
    console.log('[MyClientsTab] Starting fetchMyClients for agent:', agentId);
    if (!agentId) {
      console.error('[MyClientsTab] No agentId provided!');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);

      // Get buyers who have hired this agent - try buyer_agent_matches first, then agent_referrals
      let agentMatches = [];
      
      // Try buyer_agent_matches table first
      try {
        const { data, error } = await supabase
          .from('buyer_agent_matches')
          .select('buyer_id, created_at')
          .eq('agent_id', agentId);
        
        if (error) throw error;
        agentMatches = data?.map(match => ({
          buyer_id: match.buyer_id,
          created_at: match.created_at,
          status: 'active' // buyer_agent_matches doesn't have status field, assume active
        })) || [];
        console.log('[MyClientsTab] Found agent matches in buyer_agent_matches:', agentMatches.length);
      } catch (matchesError) {
        console.warn('[MyClientsTab] buyer_agent_matches error, trying agent_referrals:', matchesError);
        
        // Fallback to agent_referrals table
        try {
          const { data, error } = await supabase
            .from('agent_referrals')
            .select('buyer_id, created_at, status')
            .eq('agent_id', agentId)
            .eq('referral_type', 'hire_agent')
            .eq('status', 'active');
          
          if (error) throw error;
          agentMatches = data?.map(referral => ({
            buyer_id: referral.buyer_id,
            created_at: referral.created_at,
            status: referral.status
          })) || [];
          console.log('[MyClientsTab] Found agent matches in agent_referrals:', agentMatches.length);
        } catch (referralError) {
          console.warn('[MyClientsTab] agent_referrals also failed:', referralError);
          agentMatches = [];
        }
      }

      console.log('[MyClientsTab] Agent matches result:', agentMatches);
      console.log('[MyClientsTab] Agent matches detailed:', JSON.stringify(agentMatches, null, 2));

      // Also get frequent buyers (3+ tours with this agent) - just get user IDs first
      const { data: frequentBuyers, error: frequentError } = await supabase
        .from('showing_requests')
        .select('user_id')
        .eq('assigned_agent_id', agentId)
        .eq('status', 'completed');

      console.log('[MyClientsTab] Frequent buyers result:', { frequentBuyers, frequentError });
      if (frequentError) throw frequentError;

      // Count tours per buyer
      const buyerTourCounts = frequentBuyers?.reduce((acc, showing) => {
        acc[showing.user_id] = (acc[showing.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      console.log('[MyClientsTab] Buyer tour counts:', buyerTourCounts);

      // Extract unique buyer IDs from agent matches
      const matchedBuyerIds = new Set(agentMatches?.map(m => m.buyer_id) || []);
      console.log('[MyClientsTab] Matched buyer IDs from agent_referrals/buyer_agent_matches:', Array.from(matchedBuyerIds));

      // Get frequent buyers (1+ tours for now to test) who aren't already matched
      const frequentBuyerIds = Object.entries(buyerTourCounts)
        .filter(([_, count]) => count >= 1) // Lowered threshold for testing
        .map(([buyerId]) => buyerId)
        .filter(buyerId => !matchedBuyerIds.has(buyerId));

      console.log('[MyClientsTab] Additional frequent buyer IDs:', frequentBuyerIds);

      // Combine matched clients and frequent buyers
      const allClientIds = [
        ...Array.from(matchedBuyerIds), // Convert Set to Array
        ...frequentBuyerIds
      ];

      console.log('[MyClientsTab] All client IDs:', allClientIds);

      if (allClientIds.length === 0) {
        console.log('[MyClientsTab] No clients found');
        setClients([]);
        return;
      }

      // Get detailed client data
      const clientsData: ClientData[] = [];

      console.log('[MyClientsTab] Processing client IDs:', allClientIds);
      for (const clientId of allClientIds) {
        console.log('[MyClientsTab] Processing client:', clientId);
        
        // Get client profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone')
          .eq('id', clientId)
          .single();

        if (profileError) {
          console.warn('[MyClientsTab] Profile error for client', clientId, ':', profileError);
          continue;
        }

        // Get tour count
        const { data: tours, error: toursError } = await supabase
          .from('showing_requests')
          .select('id, property_address, status_updated_at')
          .eq('user_id', clientId)
          .eq('assigned_agent_id', agentId);

        // Get favorites count (handle if table doesn't exist)
        let favorites = null;
        try {
          const { data, error } = await supabase
            .from('property_favorites')
            .select('id')
            .eq('user_id', clientId);
          if (error) throw error;
          favorites = data;
        } catch (favoritesError) {
          console.warn('[MyClientsTab] Favorites error:', favoritesError);
          favorites = [];
        }

        // Get offers count (handle if table doesn't exist)
        let offers = null;
        try {
          const { data, error } = await supabase
            .from('post_showing_actions')
            .select('id')
            .eq('buyer_id', clientId)
            .in('action_type', ['made_offer', 'request_offer_assistance']);
          if (error) throw error;
          offers = data;
        } catch (offersError) {
          console.warn('[MyClientsTab] Offers error:', offersError);
          offers = [];
        }

        // Get connection date
        const match = agentMatches?.find(m => m.buyer_id === clientId);
        const connectionDate = match?.created_at || tours?.[0]?.status_updated_at || new Date().toISOString();

        // Get last activity
        const lastActivity = tours?.reduce((latest, tour) => {
          return new Date(tour.status_updated_at) > new Date(latest) ? tour.status_updated_at : latest;
        }, connectionDate);

        clientsData.push({
          buyer_id: clientId,
          buyer_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
          buyer_email: profile.email,
          buyer_phone: profile.phone,
          connection_date: connectionDate,
          status: match?.status || 'active',
          total_tours: tours?.length || 0,
          favorite_properties: favorites?.length || 0,
          offers_made: offers?.length || 0,
          last_activity: lastActivity || connectionDate,
          recent_properties: (tours?.slice(-3).map(t => t.property_address) || [])
        });
      }

      // Sort by last activity (most recent first)
      clientsData.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());

      console.log('[MyClientsTab] Final clients data:', clientsData);
      console.log('[MyClientsTab] Setting', clientsData.length, 'clients');
      setClients(clientsData);
      console.log('[MyClientsTab] Clients set successfully');

    } catch (error) {
      console.error('Error fetching my clients:', error);
      toast({
        title: "Error",
        description: "Unable to load your clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClient = (client: ClientData) => {
    // TODO: Implement messaging functionality
    toast({
      title: "Message Client",
      description: `Opening message thread with ${client.buyer_name}`,
    });
  };

  const handleScheduleTour = (client: ClientData) => {
    // TODO: Implement tour scheduling
    toast({
      title: "Schedule Tour",
      description: `Opening tour scheduler for ${client.buyer_name}`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your clients...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Yet</h3>
            <p className="text-gray-500 mb-4">
              Clients appear here when buyers hire you or complete multiple tours with you.
            </p>
            <p className="text-sm text-gray-400">
              Keep providing great service and clients will start appearing here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Clients ({clients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Card key={client.buyer_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{client.buyer_name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>Client since {new Date(client.connection_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={client.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {client.status}
                    </Badge>
                  </div>

                  {/* Client Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium text-blue-900">{client.total_tours}</div>
                      <div className="text-xs text-blue-600">Tours</div>
                    </div>
                    <div className="p-2 bg-pink-50 rounded">
                      <div className="text-sm font-medium text-pink-900">{client.favorite_properties}</div>
                      <div className="text-xs text-pink-600">Favorites</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-900">{client.offers_made}</div>
                      <div className="text-xs text-green-600">Offers</div>
                    </div>
                  </div>

                  {/* Recent Properties */}
                  {client.recent_properties.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">Recent Properties:</div>
                      <div className="space-y-1">
                        {client.recent_properties.slice(0, 2).map((address, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                            <Home className="w-3 h-3" />
                            <span className="truncate">{address}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs h-7"
                      onClick={() => handleMessageClient(client)}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs h-7"
                      onClick={() => handleScheduleTour(client)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Tour
                    </Button>
                  </div>

                  {/* Contact Info */}
                  {(client.buyer_email || client.buyer_phone) && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="space-y-1">
                        {client.buyer_email && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{client.buyer_email}</span>
                          </div>
                        )}
                        {client.buyer_phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{client.buyer_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Last Activity */}
                  <div className="mt-2 text-xs text-gray-500">
                    Last activity: {new Date(client.last_activity).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyClientsTab;