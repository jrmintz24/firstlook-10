
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Heart, 
  User, 
  FileText, 
  Calendar,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { useAgentPostShowingNotifications } from "@/hooks/useAgentPostShowingNotifications";

interface AgentNotificationsPanelProps {
  agentId: string;
}

const AgentNotificationsPanel = ({ agentId }: AgentNotificationsPanelProps) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useAgentPostShowingNotifications(agentId);

  const [expanded, setExpanded] = useState(false);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'favorite_property': return <Heart className="w-4 h-4 text-red-500" />;
      case 'connect_with_agent': return <User className="w-4 h-4 text-purple-500" />;
      case 'make_offer': return <FileText className="w-4 h-4 text-green-500" />;
      case 'request_showing': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionMessage = (actionType: string, buyerName: string, propertyAddress: string) => {
    switch (actionType) {
      case 'favorite_property':
        return `${buyerName} favorited ${propertyAddress}`;
      case 'connect_with_agent':
        return `${buyerName} wants to connect with you about ${propertyAddress}`;
      case 'make_offer':
        return `${buyerName} is interested in making an offer on ${propertyAddress}`;
      case 'request_showing':
        return `${buyerName} requested another showing for ${propertyAddress}`;
      default:
        return `${buyerName} took action on ${propertyAddress}`;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading notifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Post-Showing Activity
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent buyer activity</p>
          </div>
        ) : (
          <ScrollArea className={expanded ? "h-96" : "h-48"}>
            <div className="space-y-3">
              {notifications.slice(0, expanded ? undefined : 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActionIcon(notification.action_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                      {getActionMessage(
                        notification.action_type,
                        notification.buyer_name,
                        notification.property_address
                      )}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(notification.created_at)}
                      </span>
                      
                      {notification.action_details?.notes && (
                        <Badge variant="outline" className="text-xs">
                          Has notes
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="flex-shrink-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              
              {!expanded && notifications.length > 5 && (
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(true)}
                    className="text-blue-600"
                  >
                    View {notifications.length - 5} more notifications
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentNotificationsPanel;
