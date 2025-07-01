
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowLeft, MessageSquare } from "lucide-react";
import MessageThread from "./MessageThread";
import NewConversationComposer from "./NewConversationComposer";

interface PropertyConversation {
  showing_request_id: string;
  property_address: string;
  status: string;
  messages: any[];
  last_message_at: string;
  unread_count: number;
}

interface ShowingData {
  id: string;
  property_address: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
}

interface PropertyChatsTabProps {
  conversations: PropertyConversation[];
  onSendMessage: (showingId: string, receiverId: string, content: string) => Promise<boolean>;
  onMarkAsRead: (showingId: string) => void;
  loading: boolean;
  targetShowingId?: string;
  showingData?: ShowingData;
  userId: string;
}

const PropertyChatsTab = ({ 
  conversations, 
  onSendMessage, 
  onMarkAsRead, 
  loading,
  targetShowingId,
  showingData,
  userId
}: PropertyChatsTabProps) => {
  const [selectedConversation, setSelectedConversation] = useState<PropertyConversation | null>(null);
  const [showNewComposer, setShowNewComposer] = useState(false);

  // Handle targeted showing
  useEffect(() => {
    if (targetShowingId && showingData) {
      // Check if conversation already exists
      const existingConversation = conversations.find(c => c.showing_request_id === targetShowingId);
      
      if (existingConversation) {
        // Open existing conversation
        setSelectedConversation(existingConversation);
        setShowNewComposer(false);
      } else {
        // Show new message composer
        setShowNewComposer(true);
        setSelectedConversation(null);
      }
    }
  }, [targetShowingId, showingData, conversations]);

  const handleBackToList = () => {
    setSelectedConversation(null);
    setShowNewComposer(false);
  };

  const handleNewMessageSuccess = () => {
    setShowNewComposer(false);
    // The conversation list will refresh automatically due to the message hook
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  // Show new conversation composer
  if (showNewComposer && showingData) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <p className="font-medium text-sm">New Message</p>
            <p className="text-xs text-gray-500">Start conversation with agent</p>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <NewConversationComposer
            showingData={showingData}
            onSendMessage={onSendMessage}
            onSuccess={handleNewMessageSuccess}
            userId={userId}
          />
        </div>
      </div>
    );
  }

  // Show existing conversation
  if (selectedConversation) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
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

  // Show conversation list or empty state
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Property Chats</h3>
            <p className="text-sm text-gray-500">
              Property conversations will appear here after you message agents about showings
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.showing_request_id}
                onClick={() => setSelectedConversation(conversation)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <p className="font-medium text-sm truncate">
                        {conversation.property_address}
                      </p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 px-2 text-xs ml-auto">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    
                    {conversation.messages.length > 0 && (
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {conversation.messages[conversation.messages.length - 1].content.substring(0, 60)}
                        {conversation.messages[conversation.messages.length - 1].content.length > 60 ? '...' : ''}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={conversation.status === 'completed' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
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
