
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle, Calendar, Phone, MessageCircle, Bell } from "lucide-react";

interface UpdateItem {
  id: string;
  type: 'activity' | 'reminder';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
}

interface UpdatesPanelProps {
  showingRequests: any[];
  userType: 'buyer' | 'agent';
  onSendMessage?: (requestId: string) => void;
}

const UpdatesPanel = ({ showingRequests, userType, onSendMessage }: UpdatesPanelProps) => {
  const generateUpdates = (): UpdateItem[] => {
    const updates: UpdateItem[] = [];
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    showingRequests.forEach(request => {
      // High priority: Tours tomorrow
      if (request.preferred_date && ['confirmed', 'scheduled'].includes(request.status)) {
        const tourDate = new Date(request.preferred_date);
        if (tourDate.toDateString() === tomorrow.toDateString()) {
          updates.push({
            id: `tour-tomorrow-${request.id}`,
            type: 'reminder',
            priority: 'high',
            title: 'Tour Tomorrow!',
            description: `${request.property_address} at ${request.preferred_time || 'TBD'}`,
            icon: <Calendar className="h-4 w-4 text-orange-500" />,
            action: request.assigned_agent_phone ? {
              label: 'Contact Agent',
              onClick: () => window.open(`tel:${request.assigned_agent_phone}`)
            } : undefined
          });
        }
      }

      // Medium priority: New assignments
      if (request.assigned_agent_name && request.status === 'agent_assigned' && userType === 'buyer') {
        updates.push({
          id: `new-agent-${request.id}`,
          type: 'activity',
          priority: 'medium',
          title: 'Agent Assigned',
          description: `${request.assigned_agent_name} will handle your tour`,
          timestamp: request.status_updated_at,
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          action: onSendMessage ? {
            label: 'Send Message',
            onClick: () => onSendMessage(request.id)
          } : undefined
        });
      }

      // Low priority: Recent activity
      if (request.status === 'completed') {
        updates.push({
          id: `completed-${request.id}`,
          type: 'activity',
          priority: 'low',
          title: 'Tour Completed',
          description: `Visited ${request.property_address}`,
          timestamp: request.status_updated_at,
          icon: <CheckCircle className="h-4 w-4 text-blue-500" />
        });
      }
    });

    // Sort by priority and recency
    return updates
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return 0;
      })
      .slice(0, 5); // Limit to 5 most important updates
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const updates = generateUpdates();

  if (updates.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-500" />
            Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">All caught up!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          Updates
          {updates.filter(u => u.priority === 'high').length > 0 && (
            <Badge className="bg-red-100 text-red-800 text-xs">
              {updates.filter(u => u.priority === 'high').length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {updates.map((update) => (
            <div key={update.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {update.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{update.title}</h4>
                    <Badge className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                  {update.timestamp && (
                    <p className="text-xs text-gray-400">
                      {new Date(update.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {update.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs h-6"
                      onClick={update.action.onClick}
                    >
                      {update.action.label}
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

export default UpdatesPanel;
