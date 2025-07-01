
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowLeft } from "lucide-react";
import MessageThread from "./MessageThread";

interface PropertyConversation {
  showing_request_id: string;
  property_address: string;
  status: string;
  messages: any[];
  last_message_at: string;
  unread_count: number;
}

interface PropertyChatsTabProps {
  conversations: PropertyConversation[];
  onSendMessage: (showingId: string, receiverId: string, content: string) => Promise<boolean>;
  onMarkAsRead: (showingId: string) => void;
  loading: boolean;
}

const PropertyChatsTab = ({ conversations, onSendMessage, onMarkAsRead, loading }: PropertyChatsTabProps) => {
  const [selectedConversation, setSelectedConversation] = useState<PropertyConversation | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{selectedConversation.property_address}</p>
            <p className="text-xs text-gray-500">Property Chat</p>
          </div>
        </div>
        
        <MessageThread
          messages={selectedConversation.messages}
          onSendMessage={(content, receiverId) => 
            onSendMessage(selectedConversation.showing_request_id, receiverId, content)
          }
          onMarkAsRead={() => onMarkAsRead(selectedConversation.showing_request_id)}
          conversationType="property"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <MapPin className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Property Chats</h3>
            <p className="text-sm text-gray-500">
              Property conversations will appear here after you tour properties
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.showing_request_id}
                onClick={() => setSelectedConversation(conversation)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {conversation.property_address}
                      </p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 px-2 text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.messages.length > 0 
                        ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) + '...'
                        : 'No messages yet'
                      }
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={conversation.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {conversation.status}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(conversation.last_message_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PropertyChatsTab;
