
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Video, MapPin } from "lucide-react";

interface ConsultationCardProps {
  id: string;
  propertyAddress: string;
  scheduledAt: string;
  consultationType: 'phone' | 'video';
  agentName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  onJoinCall?: () => void;
  onReschedule?: () => void;
}

const ConsultationCard = ({
  id,
  propertyAddress,
  scheduledAt,
  consultationType,
  agentName = "Your Agent",
  status,
  onJoinCall,
  onReschedule
}: ConsultationCardProps) => {
  const scheduledDate = new Date(scheduledAt);
  const isToday = scheduledDate.toDateString() === new Date().toDateString();
  const isPast = scheduledDate < new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {consultationType === 'phone' ? (
              <Phone className="h-4 w-4 text-blue-600" />
            ) : (
              <Video className="h-4 w-4 text-purple-600" />
            )}
            <span className="font-medium text-sm">
              {consultationType === 'phone' ? 'Phone' : 'Video'} Consultation
            </span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{propertyAddress}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className={isToday ? "font-medium text-blue-600" : "text-gray-600"}>
                {formatDate(scheduledDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{formatTime(scheduledDate)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            with {agentName}
          </div>
        </div>

        {status === 'scheduled' && !isPast && (
          <div className="flex gap-2">
            {consultationType === 'video' && onJoinCall && (
              <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={onJoinCall}
              >
                Join Video Call
              </Button>
            )}
            {onReschedule && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={onReschedule}
              >
                Reschedule
              </Button>
            )}
          </div>
        )}

        {isToday && status === 'scheduled' && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">
              📅 Today's consultation - Don't forget!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationCard;
