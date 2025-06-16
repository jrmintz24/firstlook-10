
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  showing_request_id: string;
  property_address: string;
  status: string;
  messages: any[];
  last_message_at: string;
  unread_count: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationsList = ({
  conversations,
  selectedConversationId,
  onSelectConversation
}: ConversationsListProps) => {
  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No conversations yet</p>
            <p className="text-sm text-gray-500">Messages will appear here when you start communicating about showings</p>
          </CardContent>
        </Card>
      ) : (
        conversations.map((conversation) => (
          <Card
            key={conversation.showing_request_id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedConversationId === conversation.showing_request_id
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : ''
            }`}
            onClick={() => onSelectConversation(conversation.showing_request_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">
                    {conversation.property_address}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {conversation.unread_count > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {conversation.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ConversationsList;
