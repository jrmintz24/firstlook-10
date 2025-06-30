
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Inbox, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationsList from "./ConversationsList";
import MessageThread from "./MessageThread";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessagingInterfaceProps {
  userId: string;
  userType: 'buyer' | 'agent';
  compact?: boolean;
  specificShowingId?: string;
  className?: string;
}

const MessagingInterface = ({ 
  userId, 
  userType, 
  compact = false, 
  specificShowingId,
  className = ""
}: MessagingInterfaceProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(specificShowingId || null);
  const [showConversationsList, setShowConversationsList] = useState(true);
  const isMobile = useIsMobile();
  
  const { 
    loading, 
    unreadCount, 
    sendMessage, 
    getMessagesForShowing, 
    getConversations,
    markMessagesAsRead
  } = useMessages(userId);

  const conversations = getConversations();
  
  // Filter to specific showing if provided
  const filteredConversations = specificShowingId 
    ? conversations.filter(conv => conv.showing_request_id === specificShowingId)
    : conversations;

  const selectedConversation = filteredConversations.find(
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
    if (isMobile) {
      setShowConversationsList(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversationsList(true);
    setSelectedConversationId(null);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !selectedConversation) return false;

    // Find the other party in the conversation by looking at all messages
    const messages = selectedConversation.messages;
    let receiverId: string | null = null;

    // Find someone who is not the current user
    for (const message of messages) {
      if (message.sender_id !== userId) {
        receiverId = message.sender_id;
        break;
      } else if (message.receiver_id !== userId) {
        receiverId = message.receiver_id;
        break;
      }
    }

    if (!receiverId) {
      console.error('Could not determine receiver ID for conversation');
      return false;
    }

    return await sendMessage(selectedConversationId, receiverId, content);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-center">
          <div className="text-sm mb-2">Loading messages...</div>
          <div className="text-xs text-gray-600">Please wait while we fetch your conversations</div>
        </div>
      </div>
    );
  }

  if (compact && specificShowingId) {
    // Compact view for showing cards
    return (
      <div className={className}>
        {selectedConversation ? (
          <MessageThread
            messages={selectedConversation.messages}
            currentUserId={userId}
            onSendMessage={handleSendMessage}
            propertyAddress={selectedConversation.property_address}
            showingStatus={selectedConversation.status}
          />
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No messages for this showing yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Mobile view - show either conversations list or message thread
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!showConversationsList && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToConversations}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {showConversationsList ? 'Messages' : selectedConversation?.property_address}
            </h2>
            {unreadCount > 0 && showConversationsList && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>

        {showConversationsList ? (
          <Card className="h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Conversations ({filteredConversations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[400px]">
              <ConversationsList
                conversations={filteredConversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </CardContent>
          </Card>
        ) : selectedConversation ? (
          <div className="h-[500px]">
            <MessageThread
              messages={selectedConversation.messages}
              currentUserId={userId}
              onSendMessage={handleSendMessage}
              propertyAddress={selectedConversation.property_address}
              showingStatus={selectedConversation.status}
            />
          </div>
        ) : (
          <Card className="h-[500px] flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Conversation</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Desktop view - side by side layout
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
          Communicate with {userType === 'buyer' ? 'agents' : 'buyers'} about your showings
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Conversations ({filteredConversations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[500px]">
              <ConversationsList
                conversations={filteredConversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <MessageThread
              messages={selectedConversation.messages}
              currentUserId={userId}
              onSendMessage={handleSendMessage}
              propertyAddress={selectedConversation.property_address}
              showingStatus={selectedConversation.status}
            />
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

export default MessagingInterface;
