
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Search, 
  Send, 
  Phone, 
  Calendar,
  AlertTriangle,
  X,
  Minimize2
} from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";

interface MessagesPanelProps {
  userId: string;
  unreadCount: number;
  className?: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

const MessagesPanel = ({ 
  userId, 
  unreadCount, 
  className = "",
  onMinimize,
  isMinimized = false
}: MessagesPanelProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { getConversations, sendMessage } = useMessages(userId);
  const conversations = getConversations();

  const filteredConversations = conversations.filter(conv =>
    conv.property_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.showing_request_id === selectedConversation);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !selectedConv) return;
    
    const otherParty = selectedConv.messages.find(msg => msg.sender_id !== userId);
    const receiverId = otherParty?.sender_id === userId ? otherParty?.receiver_id : otherParty?.sender_id;
    
    if (receiverId) {
      const success = await sendMessage(selectedConversation, receiverId, newMessage.trim());
      if (success) {
        setNewMessage("");
      }
    }
  };

  if (isMinimized) {
    return (
      <Card className={`${className} cursor-pointer hover:shadow-lg transition-all duration-200`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Messages</h3>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'No new messages'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} flex flex-col bg-white shadow-2xl rounded-2xl`}>
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Messages</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs mt-1">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex flex-1 min-h-0">
          {/* Conversations List */}
          <div className="w-1/2 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 text-sm">
                Conversations ({filteredConversations.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">No conversations yet</p>
                  <p className="text-xs text-gray-500 mt-1">Messages will appear here</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.showing_request_id}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedConversation === conversation.showing_request_id
                          ? 'bg-indigo-50 border-2 border-indigo-200'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      onClick={() => setSelectedConversation(conversation.showing_request_id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                            {conversation.property_address.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.property_address}
                            </p>
                            {conversation.unread_count > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600">
                              {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                            </p>
                          </div>
                          
                          <Badge variant="outline" className="text-xs mt-2">
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-1/2 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {selectedConv.property_address}
                      </h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {selectedConv.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConv.messages
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                            message.sender_id === userId
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender_id === userId ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-3 items-end">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 min-h-[44px] max-h-24 resize-none text-base border-2 border-gray-200 rounded-xl focus:border-indigo-500"
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
                      className="bg-indigo-600 hover:bg-indigo-700 h-11 w-11 p-0 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Conversation</h3>
                  <p className="text-sm text-gray-500">Choose a property to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesPanel;
