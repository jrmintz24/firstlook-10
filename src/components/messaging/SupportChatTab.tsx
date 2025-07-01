
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Clock, ArrowLeft, Plus } from "lucide-react";
import MessageThread from "./MessageThread";

interface SupportConversation {
  id: string;
  subject: string | null;
  status: string;
  priority: string;
  messages: any[];
  last_message_at: string;
  unread_count: number;
  admin_id: string | null;
}

interface SupportChatTabProps {
  conversations: SupportConversation[];
  onSendMessage: (conversationId: string, content: string, subject?: string) => Promise<boolean>;
  onMarkAsRead: (conversationId: string) => void;
  loading: boolean;
}

const SupportChatTab = ({ conversations, onSendMessage, onMarkAsRead, loading }: SupportChatTabProps) => {
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const handleNewChat = () => {
    setShowNewChat(true);
    setSelectedConversation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (selectedConversation || showNewChat) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedConversation(null);
              setShowNewChat(false);
            }}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">
              {selectedConversation ? (selectedConversation.subject || 'Support Chat') : 'New Support Chat'}
            </p>
            <p className="text-xs text-gray-500">
              {selectedConversation ? `Status: ${selectedConversation.status}` : 'Start a new conversation'}
            </p>
          </div>
        </div>
        
        <MessageThread
          messages={selectedConversation?.messages || []}
          onSendMessage={(content) => {
            if (selectedConversation) {
              return onSendMessage(selectedConversation.id, content);
            } else {
              // New conversation
              return onSendMessage('new', content, 'Support Request');
            }
          }}
          onMarkAsRead={() => selectedConversation && onMarkAsRead(selectedConversation.id)}
          conversationType="support"
          isNewConversation={showNewChat && !selectedConversation}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button
          onClick={handleNewChat}
          className="w-full bg-black hover:bg-gray-800 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <HelpCircle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Support Chats</h3>
            <p className="text-sm text-gray-500">
              Start a new chat to get help from our support team
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {conversation.subject || 'Support Chat'}
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
                      <Badge 
                        variant={conversation.status === 'open' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                      <Badge 
                        variant={conversation.priority === 'urgent' ? 'destructive' : 'outline'} 
                        className="text-xs"
                      >
                        {conversation.priority}
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

export default SupportChatTab;
