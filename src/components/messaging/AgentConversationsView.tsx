import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, MapPin, Calendar, User, Filter } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import MessageThread from "./MessageThread";
import { formatDistanceToNow } from "date-fns";

interface AgentConversationsViewProps {
  agentId: string;
}

const AgentConversationsView = ({ agentId }: AgentConversationsViewProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { 
    loading, 
    unreadCount, 
    sendMessage, 
    getMessagesForShowing, 
    getConversations 
  } = useMessages(agentId);

  const conversations = getConversations();

  // Filter conversations based on search and status
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.property_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedConversation = conversations.find(
    conv => conv.showing_request_id === selectedConversationId
  );

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !selectedConversation) {
      console.error('No conversation selected');
      return false;
    }

    console.log('Sending message for conversation:', selectedConversation);
    console.log('Agent ID:', agentId);
    console.log('Messages in conversation:', selectedConversation.messages);

    // Find the buyer in the conversation - look for messages where sender is not the current agent
    let buyerId: string | null = null;
    
    for (const message of selectedConversation.messages) {
      if (message.sender_id !== agentId) {
        buyerId = message.sender_id;
        break;
      }
      if (message.receiver_id !== agentId) {
        buyerId = message.receiver_id;
        break;
      }
    }

    console.log('Found buyer ID:', buyerId);
    
    if (!buyerId) {
      console.error('Could not find buyer ID in conversation');
      return false;
    }

    try {
      const success = await sendMessage(selectedConversationId, buyerId, content);
      console.log('Message send result:', success);
      return success;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Property Conversations</h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by property address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[600px]">
              <div className="space-y-3">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No conversations found</p>
                    <p className="text-sm text-gray-500">
                      {searchTerm || statusFilter !== "all" 
                        ? "Try adjusting your filters" 
                        : "Messages will appear here when buyers start communicating"
                      }
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'pending': return 'bg-yellow-100 text-yellow-800';
                        case 'confirmed': return 'bg-green-100 text-green-800';
                        case 'completed': return 'bg-blue-100 text-blue-800';
                        case 'cancelled': return 'bg-red-100 text-red-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <Card
                        key={conversation.showing_request_id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedConversationId === conversation.showing_request_id
                            ? 'ring-2 ring-purple-500 bg-purple-50'
                            : ''
                        }`}
                        onClick={() => {
                          console.log('Selecting conversation:', conversation.showing_request_id);
                          setSelectedConversationId(conversation.showing_request_id);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
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
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                              {conversation.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              Buyer
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <MessageThread
              messages={selectedConversation.messages}
              currentUserId={agentId}
              onSendMessage={handleSendMessage}
              propertyAddress={selectedConversation.property_address}
              showingStatus={selectedConversation.status}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="text-gray-500">Choose a property conversation from the left to start messaging</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentConversationsView;
