
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
}

interface SmartRemindersProps {
  showingRequests: ShowingRequest[];
  userType: 'buyer' | 'agent';
}

const SmartReminders = ({ showingRequests, userType }: SmartRemindersProps) => {
  const isMobile = useIsMobile();

  // Get upcoming reminders
  const upcomingShowings = showingRequests
    .filter(showing => 
      showing.status === 'confirmed' && 
      showing.preferred_date &&
      new Date(showing.preferred_date) > new Date()
    )
    .sort((a, b) => 
      new Date(a.preferred_date!).getTime() - new Date(b.preferred_date!).getTime()
    )
    .slice(0, 3);

  const pendingShowings = showingRequests.filter(showing => showing.status === 'pending');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case 'confirmed':
        return { icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const reminders = [
    ...upcomingShowings.map(showing => ({
      id: showing.id,
      type: 'upcoming',
      title: isMobile ? 'Upcoming Tour' : 'Upcoming Showing',
      description: showing.property_address,
      date: showing.preferred_date!,
      time: showing.preferred_time,
      status: showing.status
    })),
    ...pendingShowings.slice(0, 2).map(showing => ({
      id: showing.id,
      type: 'pending',
      title: 'Pending Request',
      description: showing.property_address,
      date: showing.created_at,
      time: null,
      status: showing.status
    }))
  ].slice(0, isMobile ? 3 : 4);

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Reminders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
            No reminders at this time
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Reminders</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const statusInfo = getStatusInfo(reminder.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div 
                key={reminder.id} 
                className={`p-3 rounded-lg border ${statusInfo.bgColor} border-gray-200`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusInfo.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {reminder.title}
                        </p>
                        <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                          {reminder.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">
                        {reminder.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatDate(reminder.date)}</span>
                        {reminder.time && (
                          <>
                            <span>•</span>
                            <span>{reminder.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartReminders;
