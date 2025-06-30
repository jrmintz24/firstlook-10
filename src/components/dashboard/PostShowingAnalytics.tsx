
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar,
  Target,
  Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PostShowingAnalyticsProps {
  agentId?: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
}

interface AnalyticsData {
  actionTypeDistribution: Array<{ name: string; value: number; color: string }>;
  engagementOverTime: Array<{ date: string; actions: number; showings: number }>;
  topPerformingProperties: Array<{ address: string; actions: number; engagement: number }>;
  conversionMetrics: {
    showingToFavorite: number;
    showingToAgentConnect: number;
    showingToOffer: number;
    overallEngagement: number;
  };
}

const PostShowingAnalytics = ({ 
  agentId, 
  timeframe = 'month' 
}: PostShowingAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    actionTypeDistribution: [],
    engagementOverTime: [],
    topPerformingProperties: [],
    conversionMetrics: {
      showingToFavorite: 0,
      showingToAgentConnect: 0,
      showingToOffer: 0,
      overallEngagement: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [agentId, timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const daysBack = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'quarter' ? 90 : 365;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      // Build query based on whether we have an agentId
      let showingsQuery = supabase
        .from('showing_requests')
        .select('id, property_address, status_updated_at')
        .eq('status', 'completed')
        .gte('status_updated_at', startDate.toISOString());

      if (agentId) {
        showingsQuery = showingsQuery.eq('assigned_agent_id', agentId);
      }

      const { data: showings, error: showingsError } = await showingsQuery;

      if (showingsError) throw showingsError;

      const showingIds = showings?.map(s => s.id) || [];

      // Get all post-showing actions
      const { data: actions, error: actionsError } = await supabase
        .from('post_showing_actions')
        .select('*')
        .in('showing_request_id', showingIds);

      if (actionsError) throw actionsError;

      // Get favorites and agent connections
      const { data: favorites } = await supabase
        .from('property_favorites')
        .select('*')
        .in('showing_request_id', showingIds);

      const { data: agentConnections } = await supabase
        .from('buyer_agent_matches')
        .select('*')
        .in('showing_request_id', showingIds);

      // Process action type distribution
      const actionCounts: Record<string, number> = {};
      
      actions?.forEach(action => {
        actionCounts[action.action_type] = (actionCounts[action.action_type] || 0) + 1;
      });

      actionCounts['favorite_property'] = favorites?.length || 0;
      actionCounts['connect_with_agent'] = agentConnections?.length || 0;

      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
      const actionTypeDistribution = Object.entries(actionCounts).map(([name, value], index) => ({
        name: name.replace(/_/g, ' '),
        value,
        color: colors[index % colors.length]
      }));

      // Process engagement over time
      const engagementOverTime = processEngagementOverTime(showings || [], actions || [], favorites || [], agentConnections || []);

      // Calculate conversion metrics
      const totalShowings = showings?.length || 0;
      const conversionMetrics = {
        showingToFavorite: totalShowings > 0 ? ((favorites?.length || 0) / totalShowings) * 100 : 0,
        showingToAgentConnect: totalShowings > 0 ? ((agentConnections?.length || 0) / totalShowings) * 100 : 0,
        showingToOffer: totalShowings > 0 ? ((actions?.filter(a => a.action_type === 'make_offer').length || 0) / totalShowings) * 100 : 0,
        overallEngagement: totalShowings > 0 ? (((actions?.length || 0) + (favorites?.length || 0) + (agentConnections?.length || 0)) / totalShowings) * 100 : 0
      };

      // Process top performing properties
      const propertyActions: Record<string, { actions: number; showingId: string }> = {};
      
      (showings || []).forEach(showing => {
        const showingActions = (actions || []).filter(a => a.showing_request_id === showing.id).length;
        const showingFavorites = (favorites || []).filter(f => f.showing_request_id === showing.id).length;
        const showingConnections = (agentConnections || []).filter(c => c.showing_request_id === showing.id).length;
        
        const totalActions = showingActions + showingFavorites + showingConnections;
        
        if (totalActions > 0) {
          propertyActions[showing.property_address] = {
            actions: totalActions,
            showingId: showing.id
          };
        }
      });

      const topPerformingProperties = Object.entries(propertyActions)
        .sort(([,a], [,b]) => b.actions - a.actions)
        .slice(0, 5)
        .map(([address, data]) => ({
          address,
          actions: data.actions,
          engagement: Math.min(100, data.actions * 25)
        }));

      setAnalytics({
        actionTypeDistribution,
        engagementOverTime,
        topPerformingProperties,
        conversionMetrics
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processEngagementOverTime = (showings: any[], actions: any[], favorites: any[], connections: any[]) => {
    const dateMap: Record<string, { actions: number; showings: number }> = {};

    // Group showings by date
    showings.forEach(showing => {
      const date = new Date(showing.status_updated_at).toLocaleDateString();
      if (!dateMap[date]) {
        dateMap[date] = { actions: 0, showings: 0 };
      }
      dateMap[date].showings += 1;
    });

    // Add actions for each date
    [...actions, ...favorites, ...connections].forEach(item => {
      const showing = showings.find(s => s.id === item.showing_request_id);
      if (showing) {
        const date = new Date(showing.status_updated_at).toLocaleDateString();
        if (dateMap[date]) {
          dateMap[date].actions += 1;
        }
      }
    });

    return Object.entries(dateMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, data]) => ({ date, ...data }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversion Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Favorited</span>
            </div>
            <div className="text-2xl font-bold">{analytics.conversionMetrics.showingToFavorite.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Agent Connect</span>
            </div>
            <div className="text-2xl font-bold">{analytics.conversionMetrics.showingToAgentConnect.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Offers</span>
            </div>
            <div className="text-2xl font-bold">{analytics.conversionMetrics.showingToOffer.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Overall</span>
            </div>
            <div className="text-2xl font-bold">{analytics.conversionMetrics.overallEngagement.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList>
          <TabsTrigger value="distribution">Action Types</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="properties">Top Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Action Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.actionTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.actionTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.engagementOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="showings" stroke="#3B82F6" name="Showings" />
                  <Line type="monotone" dataKey="actions" stroke="#10B981" name="Actions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topPerformingProperties.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topPerformingProperties.map((property, index) => (
                    <div key={property.address} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{property.address}</p>
                          <p className="text-sm text-gray-600">{property.actions} actions taken</p>
                        </div>
                      </div>
                      <Badge className={`${property.engagement >= 75 ? 'bg-green-100 text-green-800' : 
                        property.engagement >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {property.engagement}% engagement
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No property data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostShowingAnalytics;
