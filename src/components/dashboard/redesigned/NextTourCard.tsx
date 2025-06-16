
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, MessageCircle, Navigation } from "lucide-react";
import { format } from "date-fns";

interface NextTourCardProps {
  showing?: {
    id: string;
    property_address: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    assigned_agent_name?: string;
    assigned_agent_phone?: string;
  };
  onMessageAgent: (showingId: string) => void;
}

const NextTourCard = ({ showing, onMessageAgent }: NextTourCardProps) => {
  if (!showing) {
    return (
      <Card className="p-6 text-center">
        <div className="py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming tours</h3>
          <p className="text-gray-500">Book your next property tour to continue your home search</p>
        </div>
      </Card>
    );
  }

  const formatDateTime = () => {
    if (!showing.preferred_date || !showing.preferred_time) return "Date TBD";
    
    try {
      const date = new Date(showing.preferred_date);
      const [hours, minutes] = showing.preferred_time.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      
      return format(date, "EEEE, MMMM d, h:mm a");
    } catch {
      return "Date TBD";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'agent_confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'agent_confirmed':
        return 'Agent Confirmed';
      case 'pending':
        return 'Pending Confirmation';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Next Tour</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showing.status)}`}>
              {getStatusText(showing.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium text-gray-800 mb-2">{showing.property_address}</p>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDateTime()}</span>
        </div>
      </div>

      {showing.assigned_agent_name && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">Your Agent</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {showing.assigned_agent_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{showing.assigned_agent_name}</p>
                {showing.assigned_agent_phone && (
                  <p className="text-sm text-gray-600">{showing.assigned_agent_phone}</p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMessageAgent(showing.id)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button className="flex-1">
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </div>
    </Card>
  );
};

export default NextTourCard;
