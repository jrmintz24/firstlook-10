
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMessages } from "@/hooks/useMessages";

interface ChatWidgetProps {
  userId: string;
  unreadCount: number;
  className?: string;
}

const ChatWidget = ({ userId, unreadCount, className = "" }: ChatWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const { getConversations, sendMessage } = useMessages(userId);
  const conversations = getConversations();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const conversation = conversations.find(c => c.showing_request_id === selectedConversation);
    if (!conversation) return;

    const otherParty = conversation.messages.find(msg => msg.sender_id !== userId);
    const receiverId = otherParty?.sender_id === userId ? otherParty?.receiver_id : otherParty?.sender_id;
    
    if (receiverId) {
      const success = await sendMessage(selectedConversation, receiverId, newMessage.trim());
      if (success) {
        setNewMessage("");
      }
    }
  };

  if (!isExpanded) {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'No new messages'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Messages</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="h-96 flex">
          {/* Conversations List */}
          <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.showing_request_id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.showing_request_id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation.showing_request_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.property_address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <Badge className="bg-red-500 text-white text-xs ml-2">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Thread */}
          <div className="w-1/2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {conversations
                    .find(c => c.showing_request_id === selectedConversation)
                    ?.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                            message.sender_id === userId
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-100 p-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 min-h-[36px] max-h-20 resize-none text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 h-9 w-9 p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWidget;
