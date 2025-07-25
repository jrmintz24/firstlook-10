
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { useToast } from "@/hooks/use-toast";

const InlineMessagesPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const {
    loading,
    unreadCount,
    getConversations,
    sendMessage,
    markMessagesAsRead
  } = useMessages(user?.id || null);

  const conversations = getConversations();
  const selectedConv = conversations.find(c => c.showing_request_id === selectedConversation);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id || sending) return;
    
    setSending(true);
    
    try {
      // Find the agent/other party from the conversation messages
      const messages = selectedConv?.messages || [];
      let receiverId: string | null = null;
      
      // Look for the other party (not the current user)
      for (const message of messages) {
        if (message.sender_id !== user.id) {
          receiverId = message.sender_id;
          break;
        }
        if (message.receiver_id !== user.id) {
          receiverId = message.receiver_id;
          break;
        }
      }
      
      if (receiverId) {
        const success = await sendMessage(selectedConversation, receiverId, newMessage.trim());
        if (success) {
          setNewMessage("");
          toast({
            title: "Message Sent",
            description: "Your message has been sent successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Unable to determine message recipient.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markMessagesAsRead(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Mobile view - show conversation or list
  const isMobile = window.innerWidth < 768;
  
  if (isMobile && selectedConversation) {
    return (
      <Card className="h-96">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToList} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h3 className="font-medium text-sm truncate">
                {selectedConv?.property_address || 'Property Chat'}
              </h3>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedConv?.messages
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.sender_id === user?.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[44px] max-h-24 resize-none"
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
                disabled={!newMessage.trim() || sending}
                className="bg-black hover:bg-gray-800 h-11 w-11 p-0 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop: Side by side layout */}
      <div className={`grid ${selectedConversation ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 h-96`}>
        {/* Conversations List */}
        <Card className={selectedConversation && !isMobile ? 'hidden md:block' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-medium">Conversations</h3>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Messages about your property tours will appear here
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.showing_request_id}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation === conversation.showing_request_id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleConversationSelect(conversation.showing_request_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate mb-1">
                          {conversation.property_address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                        </p>
                        {conversation.messages.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {conversation.messages[conversation.messages.length - 1]?.content}
                          </p>
                        )}
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
          </CardContent>
        </Card>

        {/* Message Thread - Desktop */}
        {selectedConversation && !isMobile && (
          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="font-medium truncate">
                {selectedConv?.property_address || 'Property Chat'}
              </h3>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-80">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedConv?.messages
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          message.sender_id === user?.id
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-[44px] max-h-24 resize-none"
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
                    disabled={!newMessage.trim() || sending}
                    className="bg-black hover:bg-gray-800 h-11 w-11 p-0 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Placeholder for desktop when no conversation selected */}
      {!selectedConversation && conversations.length > 0 && (
        <div className="hidden md:flex items-center justify-center h-32 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">Select a conversation</p>
            <p className="text-sm text-gray-400">Choose a property to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineMessagesPanel;
