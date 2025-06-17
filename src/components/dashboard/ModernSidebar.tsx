
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MessageCircle, TrendingUp } from "lucide-react";

interface Activity {
  id: string;
  type: 'message' | 'update' | 'reminder';
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

interface ModernSidebarProps {
  activities?: Activity[];
  upcomingEvents?: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
  quickStats?: Array<{
    label: string;
    value: string | number;
    icon?: any;
  }>;
}

const ModernSidebar = ({ activities = [], upcomingEvents = [], quickStats = [] }: ModernSidebarProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'update': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'reminder': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      {quickStats.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {stat.icon && <stat.icon className="w-4 h-4 text-gray-600" />}
                  <span className="text-sm font-medium text-gray-900">{stat.label}</span>
                </div>
                <Badge variant="secondary" className="bg-white text-gray-900 font-semibold">
                  {stat.value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-3 border border-gray-100 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h4>
                <p className="text-xs text-gray-600">{event.date}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {event.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  {activity.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-xs text-gray-600 mb-4">Our support team is here to help you.</p>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernSidebar;
