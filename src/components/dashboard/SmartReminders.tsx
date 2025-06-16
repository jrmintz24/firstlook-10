
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle, Calendar, Phone, MapPin } from "lucide-react";

interface Reminder {
  id: string;
  type: 'urgent' | 'info' | 'success';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
}

interface SmartRemindersProps {
  showingRequests: any[];
  userType: 'buyer' | 'agent';
  onSendMessage?: (requestId: string) => void;
}

const SmartReminders = ({ showingRequests, userType, onSendMessage }: SmartRemindersProps) => {
  const generateReminders = (): Reminder[] => {
    const reminders: Reminder[] = [];
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    showingRequests.forEach(request => {
      // Tour tomorrow reminder
      if (request.preferred_date && ['confirmed', 'scheduled'].includes(request.status)) {
        const tourDate = new Date(request.preferred_date);
        if (tourDate.toDateString() === tomorrow.toDateString()) {
          reminders.push({
            id: `tour-tomorrow-${request.id}`,
            type: 'urgent',
            title: 'Tour Tomorrow!',
            description: `Your tour at ${request.property_address} is at ${request.preferred_time || 'TBD'}`,
            icon: <Calendar className="h-4 w-4" />,
            action: request.assigned_agent_phone ? {
              label: 'Contact Agent',
              onClick: () => window.open(`tel:${request.assigned_agent_phone}`)
            } : undefined
          });
        }
      }

      // Pending confirmation reminder
      if (request.status === 'confirmed' && userType === 'buyer') {
        reminders.push({
          id: `sign-agreement-${request.id}`,
          type: 'info',
          title: 'Agreement Pending',
          description: `Sign tour agreement for ${request.property_address}`,
          icon: <AlertCircle className="h-4 w-4" />
        });
      }

      // New agent assignment
      if (request.assigned_agent_name && request.status === 'agent_assigned' && userType === 'buyer') {
        reminders.push({
          id: `new-agent-${request.id}`,
          type: 'success',
          title: 'Agent Assigned!',
          description: `${request.assigned_agent_name} will handle your tour`,
          icon: <CheckCircle className="h-4 w-4" />,
          action: onSendMessage ? {
            label: 'Send Message',
            onClick: () => onSendMessage(request.id)
          } : undefined
        });
      }

      // Prep reminders for tours today/tomorrow
      if (request.preferred_date && ['confirmed', 'scheduled'].includes(request.status)) {
        const tourDate = new Date(request.preferred_date);
        const isToday = tourDate.toDateString() === now.toDateString();
        const isTomorrow = tourDate.toDateString() === tomorrow.toDateString();
        
        if (isToday || isTomorrow) {
          reminders.push({
            id: `prep-${request.id}`,
            type: 'info',
            title: `Tour ${isToday ? 'Today' : 'Tomorrow'} Prep`,
            description: 'Bring ID, questions ready, arrive 5 mins early',
            icon: <Clock className="h-4 w-4" />
          });
        }
      }
    });

    return reminders.slice(0, 5); // Limit to 5 reminders
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const reminders = generateReminders();

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Smart Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className={`p-3 rounded-lg ${getTypeStyles(reminder.type)}`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${getTypeColor(reminder.type)}`}>
                  {reminder.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{reminder.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  {reminder.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                      onClick={reminder.action.onClick}
                    >
                      {reminder.action.label}
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

export default SmartReminders;
