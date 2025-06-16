
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, TrendingUp, Calendar, User } from "lucide-react";

interface TourInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'suggestion';
  title: string;
  description: string;
  data?: any;
  actionable?: boolean;
}

interface TourHistoryInsightsProps {
  completedShowings: any[];
  userType: 'buyer' | 'agent';
  onRequestShowing?: () => void;
}

const TourHistoryInsights = ({ completedShowings, userType, onRequestShowing }: TourHistoryInsightsProps) => {
  const generateInsights = (): TourInsight[] => {
    const insights: TourInsight[] = [];

    if (completedShowings.length === 0) {
      return [{
        id: 'no-history',
        type: 'suggestion',
        title: 'Start Your Home Tour Journey',
        description: 'Complete your first tour to unlock personalized insights and recommendations.',
        actionable: true
      }];
    }

    // Tour frequency insight
    if (completedShowings.length >= 3) {
      insights.push({
        id: 'frequent-viewer',
        type: 'achievement',
        title: 'Active Home Hunter! 🏆',
        description: `You've completed ${completedShowings.length} tours. Your dedication to finding the perfect home shows!`,
      });
    }

    // Time-based patterns
    const recentTours = completedShowings.filter(showing => {
      const tourDate = new Date(showing.status_updated_at || showing.created_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return tourDate > monthAgo;
    });

    if (recentTours.length > 0) {
      insights.push({
        id: 'recent-activity',
        type: 'pattern',
        title: 'Recent Tour Activity',
        description: `${recentTours.length} tour${recentTours.length > 1 ? 's' : ''} completed this month. You're making great progress!`,
      });
    }

    // Agent interaction insights
    const uniqueAgents = new Set(completedShowings.map(s => s.assigned_agent_name).filter(Boolean));
    if (uniqueAgents.size > 1) {
      insights.push({
        id: 'multiple-agents',
        type: 'pattern',
        title: 'Diverse Agent Network',
        description: `You've worked with ${uniqueAgents.size} different agents, giving you varied perspectives and expertise.`,
      });
    }

    // Preferred day analysis
    const dayCount: { [key: string]: number } = {};
    completedShowings.forEach(showing => {
      if (showing.preferred_date) {
        const day = new Date(showing.preferred_date).toLocaleDateString('en-US', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });

    const mostCommonDay = Object.entries(dayCount).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonDay && mostCommonDay[1] > 1) {
      insights.push({
        id: 'preferred-day',
        type: 'pattern',
        title: 'Preferred Tour Day',
        description: `You typically tour on ${mostCommonDay[0]}s. Agents can plan accordingly for future tours.`,
      });
    }

    // Encourage next tour
    const lastTour = completedShowings[0];
    if (lastTour) {
      const daysSinceLastTour = Math.floor((new Date().getTime() - new Date(lastTour.status_updated_at || lastTour.created_at).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastTour > 7) {
        insights.push({
          id: 'next-tour',
          type: 'suggestion',
          title: 'Ready for Your Next Tour?',
          description: `It's been ${daysSinceLastTour} days since your last tour. The perfect home might be waiting!`,
          actionable: true
        });
      }
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'pattern':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'suggestion':
        return <MapPin className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      case 'pattern':
        return 'bg-blue-100 text-blue-800';
      case 'suggestion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Tour Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                    <Badge className={`text-xs ${getInsightBadgeColor(insight.type)}`}>
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  
                  {insight.actionable && insight.id === 'next-tour' && onRequestShowing && (
                    <Button size="sm" variant="outline" onClick={onRequestShowing} className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Book Another Tour
                    </Button>
                  )}
                  
                  {insight.actionable && insight.id === 'no-history' && onRequestShowing && (
                    <Button size="sm" onClick={onRequestShowing} className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      Start Your First Tour
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TourHistoryInsights;
