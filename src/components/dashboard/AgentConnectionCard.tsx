
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MessageCircle, MapPin, Calendar, User } from "lucide-react";

interface AgentConnectionCardProps {
  connection: {
    id: string;
    created_at: string;
    match_source: string;
    agent: {
      id: string;
      first_name: string;
      last_name: string;
      phone?: string;
      photo_url?: string;
      agent_details?: any;
    };
    showing_request?: {
      property_address: string;
      preferred_date?: string;
      preferred_time?: string;
      status: string;
    };
  };
  onContactAgent?: (agentId: string, method: 'phone' | 'email' | 'message') => void;
}

const AgentConnectionCard = ({ connection, onContactAgent }: AgentConnectionCardProps) => {
  const { agent, showing_request } = connection;
  const agentName = `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Agent';
  const initials = `${agent.first_name?.[0] || ''}${agent.last_name?.[0] || ''}`.toUpperCase() || 'A';

  const handleContact = (method: 'phone' | 'email' | 'message') => {
    if (onContactAgent) {
      onContactAgent(agent.id, method);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Agent Avatar */}
          <Avatar className="h-16 w-16 border-2 border-purple-200">
            <AvatarImage src={agent.photo_url} alt={agentName} />
            <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Agent Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{agentName}</h3>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Connected Agent
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(connection.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Property Context */}
            {showing_request && (
              <div className="bg-white/70 border border-purple-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Connected through:</span>
                </div>
                <div className="text-sm text-gray-900 font-medium mb-1">
                  {showing_request.property_address}
                </div>
                {showing_request.preferred_date && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(showing_request.preferred_date).toLocaleDateString()}
                      {showing_request.preferred_time && ` at ${showing_request.preferred_time}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-2">
              {agent.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContact('phone')}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {agent.phone}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('message')}
                className="border-purple-200 hover:bg-purple-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('email')}
                className="border-purple-200 hover:bg-purple-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            {/* Agent Details */}
            {agent.agent_details?.specialties && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {agent.agent_details.specialties.slice(0, 3).map((specialty: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentConnectionCard;
