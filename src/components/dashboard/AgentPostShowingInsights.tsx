
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  FileText, 
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Star,
  DollarSign,
  Eye,
  UserCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgentPostShowingInsightsProps {
  agentId: string;
  timeframe?: 'week' | 'month' | 'quarter';
}

interface ShowingInsight {
  showing_id: string;
  property_address: string;
  buyer_name: string;
  buyer_id: string;
  completed_at: string;
  actions_taken: string[];
  buyer_engagement_score: number;
  followup_recommended: boolean;
  favorite_notes?: string;
  offer_details?: any;
  agent_hired?: boolean;
  contact_attempts?: number;
}

const AgentPostShowingInsights = ({ 
  agentId, 
  timeframe = 'month' 
}: AgentPostShowingInsightsProps) => {
  const [insights, setInsights] = useState<ShowingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalShowings: 0,
    activeEngagement: 0,
    conversionRate: 0,
    averageActionsPerShowing: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPostShowingInsights();
  }, [agentId, timeframe]);

  const fetchPostShowingInsights = async () => {
    try {
      setLoading(true);

      // Calculate date range based on timeframe
      const now = new Date();
      const daysBack = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      // Get completed showings for this agent
      const { data: showings, error: showingsError } = await supabase
        .from('showing_requests')
        .select(`
          id,
          property_address,
          status_updated_at,
          user_id,
          profiles!inner(first_name, last_name)
        `)
        .eq('assigned_agent_id', agentId)
        .eq('status', 'completed')
        .gte('status_updated_at', startDate.toISOString());

      if (showingsError) throw showingsError;

      // Get post-showing actions for these showings
      const showingIds = showings?.map(s => s.id) || [];
      
      const { data: actions, error: actionsError } = await supabase
        .from('post_showing_actions')
        .select('*')
        .in('showing_request_id', showingIds);

      if (actionsError) throw actionsError;

      // Get property favorites with notes
      const { data: favorites, error: favoritesError } = await supabase
        .from('property_favorites')
        .select('showing_request_id, notes, created_at')
        .in('showing_request_id', showingIds);

      if (favoritesError) throw favoritesError;

      // Get agent connections/hirings
      const { data: agentConnections, error: connectionsError } = await supabase
        .from('buyer_agent_matches')
        .select('showing_request_id, created_at, status')
        .in('showing_request_id', showingIds);

      if (connectionsError) throw connectionsError;

      // Get offer-related actions with details
      const { data: offers, error: offersError } = await supabase
        .from('post_showing_actions')
        .select('showing_request_id, action_details, created_at')
        .in('showing_request_id', showingIds)
        .in('action_type', ['made_offer', 'request_offer_assistance']);

      if (offersError) throw offersError;

      // Combine data into insights
      const combinedInsights: ShowingInsight[] = (showings || []).map(showing => {
        const showingActions = actions?.filter(a => a.showing_request_id === showing.id) || [];
        const showingFavorites = favorites?.filter(f => f.showing_request_id === showing.id) || [];
        const showingConnections = agentConnections?.filter(c => c.showing_request_id === showing.id) || [];
        const showingOffers = offers?.filter(o => o.showing_request_id === showing.id) || [];

        const actionTypes = [
          ...showingActions.map(a => a.action_type),
          ...showingFavorites.map(() => 'favorite_property'),
          ...showingConnections.map(() => 'connect_with_agent')
        ];

        // Get additional details
        const favoriteWithNotes = showingFavorites.find(f => f.notes);
        const agentHired = showingConnections.some(c => c.status === 'active');
        const offerDetails = showingOffers[0]?.action_details;
        const contactAttempts = showingActions.filter(a => 
          a.action_type.includes('attempted_contact')
        ).length;

        const engagementScore = Math.min(100, actionTypes.length * 25);
        const followupRecommended = engagementScore >= 50 || actionTypes.includes('connect_with_agent') || showingOffers.length > 0;

        return {
          showing_id: showing.id,
          property_address: showing.property_address,
          buyer_name: `${showing.profiles?.first_name || ''} ${showing.profiles?.last_name || ''}`.trim() || 'Unknown',
          buyer_id: showing.user_id,
          completed_at: showing.status_updated_at,
          actions_taken: actionTypes,
          buyer_engagement_score: engagementScore,
          followup_recommended: followupRecommended,
          favorite_notes: favoriteWithNotes?.notes,
          offer_details: offerDetails,
          agent_hired: agentHired,
          contact_attempts: contactAttempts
        };
      });

      // Calculate analytics
      const totalActions = combinedInsights.reduce((sum, insight) => sum + insight.actions_taken.length, 0);
      const activeEngagementCount = combinedInsights.filter(i => i.buyer_engagement_score >= 50).length;
      
      setAnalytics({
        totalShowings: combinedInsights.length,
        activeEngagement: activeEngagementCount,
        conversionRate: combinedInsights.length > 0 ? (activeEngagementCount / combinedInsights.length) * 100 : 0,
        averageActionsPerShowing: combinedInsights.length > 0 ? totalActions / combinedInsights.length : 0
      });

      setInsights(combinedInsights);

    } catch (error) {
      console.error('Error fetching post-showing insights:', error);
      toast({
        title: "Error",
        description: "Unable to load post-showing insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'favorite_property': return <Heart className="w-3 h-3" />;
      case 'connect_with_agent': return <UserCheck className="w-3 h-3" />;
      case 'hired_agent': return <Star className="w-3 h-3" />;
      case 'request_showing': return <Calendar className="w-3 h-3" />;
      case 'scheduled_more_tours': return <Calendar className="w-3 h-3" />;
      case 'make_offer': 
      case 'made_offer': return <DollarSign className="w-3 h-3" />;
      case 'request_offer_assistance': return <FileText className="w-3 h-3" />;
      case 'attempted_contact_sms': return <MessageCircle className="w-3 h-3" />;
      case 'attempted_contact_call': return <Phone className="w-3 h-3" />;
      case 'attempted_contact_email': return <Mail className="w-3 h-3" />;
      case 'asked_questions': return <MessageCircle className="w-3 h-3" />;
      default: return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post-showing insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Post-Showing Analytics ({timeframe})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analytics.totalShowings}</div>
              <div className="text-sm text-gray-600">Completed Tours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">{analytics.activeEngagement}</div>
              <div className="text-sm text-gray-600">Active Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{analytics.conversionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-900">{analytics.averageActionsPerShowing.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Actions/Tour</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Showing Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Buyer Engagement by Showing</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No completed showings in the selected timeframe</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.showing_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.property_address}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{insight.buyer_name}</span>
                        <span>•</span>
                        <span>{new Date(insight.completed_at).toLocaleDateString()}</span>
                        {insight.agent_hired && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Your Client
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getEngagementColor(insight.buyer_engagement_score)} border-0`}>
                        {insight.buyer_engagement_score}% engaged
                      </Badge>
                      {insight.followup_recommended && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Follow up
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Tags */}
                  {insight.actions_taken.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {insight.actions_taken.map((action, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                          {getActionIcon(action)}
                          <span>{action.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mb-3">No post-showing actions taken yet</p>
                  )}

                  {/* Detailed Action Information */}
                  <div className="space-y-2">
                    {insight.favorite_notes && (
                      <div className="p-2 bg-pink-50 border border-pink-200 rounded text-xs">
                        <div className="flex items-center gap-1 font-medium text-pink-700 mb-1">
                          <Heart className="w-3 h-3" />
                          Favorited with notes:
                        </div>
                        <p className="text-pink-600">"{insight.favorite_notes}"</p>
                      </div>
                    )}

                    {insight.offer_details && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="flex items-center gap-1 font-medium text-green-700 mb-1">
                          <DollarSign className="w-3 h-3" />
                          Offer Interest:
                        </div>
                        <p className="text-green-600">
                          {insight.offer_details.offer_type ? `Type: ${insight.offer_details.offer_type}` : 'Requested offer assistance'}
                        </p>
                      </div>
                    )}

                    {insight.contact_attempts > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MessageCircle className="w-3 h-3" />
                        <span>{insight.contact_attempts} contact attempt{insight.contact_attempts > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                    {insight.offer_details && (
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        <FileText className="w-3 h-3 mr-1" />
                        View Offer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPostShowingInsights;
