import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Clock } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import ConversationsList from "./ConversationsList";
import MessageThread from "./MessageThread";
import AlternativeTimesSelector from "./AlternativeTimesSelector";

interface BuyerMessagingViewProps {
  userId: string;
  className?: string;
}

const BuyerMessagingView = ({ userId, className = "" }: BuyerMessagingViewProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { 
    loading, 
    unreadCount, 
    sendMessage, 
    getMessagesForShowing, 
    getConversations,
    markMessagesAsRead
  } = useMessages(userId);

  const conversations = getConversations();
  const selectedConversation = conversations.find(
    conv => conv.showing_request_id === selectedConversationId
  );

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      markMessagesAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markMessagesAsRead]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !selectedConversation) return false;

    // Find the agent in the conversation
    const messages = selectedConversation.messages;
    const agentMessage = messages.find(msg => 
      msg.sender_profile?.user_type === 'agent' || msg.receiver_id === userId
    );
    const agentId = agentMessage?.sender_id === userId ? agentMessage?.receiver_id : agentMessage?.sender_id;

    if (!agentId) return false;

    return await sendMessage(selectedConversationId, agentId, content);
  };

  // Check if the latest message contains alternative times
  const hasAlternativeTimes = selectedConversation?.messages.some(msg => 
    msg.content.includes('Alternative Date') || msg.content.includes('Alternative Time')
  );

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-center">
          <div className="text-sm mb-2">Loading conversations...</div>
          <div className="text-xs text-gray-600">Please wait while we fetch your messages</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Communicate with agents about your showings
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations ({conversations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[500px]">
              <ConversationsList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="space-y-4">
              {/* Alternative Times Selector */}
              {hasAlternativeTimes && (
                <AlternativeTimesSelector
                  showingRequestId={selectedConversationId}
                  messages={selectedConversation.messages}
                  onTimeSelected={handleSendMessage}
                />
              )}
              
              {/* Message Thread */}
              <MessageThread
                messages={selectedConversation.messages}
                currentUserId={userId}
                onSendMessage={handleSendMessage}
                onMarkAsRead={() => markMessagesAsRead(selectedConversationId!)}
                conversationType="property"
                propertyAddress={selectedConversation.property_address}
                showingStatus={selectedConversation.status}
              />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="text-gray-500">Choose a conversation from the left to start messaging</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerMessagingView;
