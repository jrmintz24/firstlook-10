
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, MessageCircle, UserPlus } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'request' | 'assignment' | 'confirmation' | 'completion' | 'message';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface ActivityFeedProps {
  showingRequests: any[];
  userType: 'buyer' | 'agent';
  currentUserId?: string;
}

const ActivityFeed = ({ showingRequests, userType, currentUserId }: ActivityFeedProps) => {
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    showingRequests.forEach(request => {
      // Tour request activity
      activities.push({
        id: `request-${request.id}`,
        type: 'request',
        title: 'Tour Requested',
        description: `Tour requested for ${request.property_address}`,
        timestamp: request.created_at,
        status: request.status
      });

      // Agent assignment activity
      if (request.assigned_agent_name && request.status_updated_at) {
        activities.push({
          id: `assignment-${request.id}`,
          type: 'assignment',
          title: userType === 'buyer' ? 'Agent Assigned' : 'Tour Accepted',
          description: userType === 'buyer' 
            ? `${request.assigned_agent_name} assigned to your tour`
            : `You accepted tour for ${request.property_address}`,
          timestamp: request.status_updated_at,
          status: request.status
        });
      }

      // Tour completion activity
      if (request.status === 'completed' && request.status_updated_at) {
        activities.push({
          id: `completion-${request.id}`,
          type: 'completion',
          title: 'Tour Completed',
          description: `Tour completed at ${request.property_address}`,
          timestamp: request.status_updated_at,
          status: request.status
        });
      }
    });

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'assignment':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'confirmation':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'completion':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activities = generateActivities();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    {activity.status && (
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
