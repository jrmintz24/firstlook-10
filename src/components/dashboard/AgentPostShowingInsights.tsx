
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
  AlertCircle
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
  completed_at: string;
  actions_taken: string[];
  buyer_engagement_score: number;
  followup_recommended: boolean;
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

      // Get property favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from('property_favorites')
        .select('*')
        .in('showing_request_id', showingIds);

      if (favoritesError) throw favoritesError;

      // Get agent connections
      const { data: agentConnections, error: connectionsError } = await supabase
        .from('buyer_agent_matches')
        .select('*')
        .in('showing_request_id', showingIds);

      if (connectionsError) throw connectionsError;

      // Combine data into insights
      const combinedInsights: ShowingInsight[] = (showings || []).map(showing => {
        const showingActions = actions?.filter(a => a.showing_request_id === showing.id) || [];
        const showingFavorites = favorites?.filter(f => f.showing_request_id === showing.id) || [];
        const showingConnections = agentConnections?.filter(c => c.showing_request_id === showing.id) || [];

        const actionTypes = [
          ...showingActions.map(a => a.action_type),
          ...showingFavorites.map(() => 'favorite_property'),
          ...showingConnections.map(() => 'connect_with_agent')
        ];

        const engagementScore = Math.min(100, actionTypes.length * 25);
        const followupRecommended = engagementScore >= 50 || actionTypes.includes('connect_with_agent');

        return {
          showing_id: showing.id,
          property_address: showing.property_address,
          buyer_name: `${showing.profiles?.first_name || ''} ${showing.profiles?.last_name || ''}`.trim() || 'Unknown',
          completed_at: showing.status_updated_at,
          actions_taken: actionTypes,
          buyer_engagement_score: engagementScore,
          followup_recommended: followupRecommended
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
      case 'connect_with_agent': return <User className="w-3 h-3" />;
      case 'request_showing': return <Calendar className="w-3 h-3" />;
      case 'make_offer': return <FileText className="w-3 h-3" />;
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

                  {insight.actions_taken.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {insight.actions_taken.map((action, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                          {getActionIcon(action)}
                          <span>{action.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No post-showing actions taken yet</p>
                  )}
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
