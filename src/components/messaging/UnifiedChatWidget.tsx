
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, X, Minimize2, Maximize2, Users, HelpCircle } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useSupportMessages } from "@/hooks/useSupportMessages";
import { useAuth } from "@/contexts/AuthContext";
import PropertyChatsTab from "./PropertyChatsTab";
import SupportChatTab from "./SupportChatTab";

interface UnifiedChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  defaultTab?: 'property' | 'support';
}

const UnifiedChatWidget = ({ isOpen, onToggle, defaultTab = 'property' }: UnifiedChatWidgetProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMinimized, setIsMinimized] = useState(false);

  // Property messages
  const {
    unreadCount: propertyUnreadCount,
    getConversations: getPropertyConversations,
    sendMessage: sendPropertyMessage,
    markMessagesAsRead: markPropertyMessagesAsRead,
    loading: propertyLoading
  } = useMessages(user?.id || null);

  // Support messages
  const {
    unreadCount: supportUnreadCount,
    conversations: supportConversations,
    sendMessage: sendSupportMessage,
    markMessagesAsRead: markSupportMessagesAsRead,
    loading: supportLoading
  } = useSupportMessages(user?.id || null);

  const totalUnreadCount = propertyUnreadCount + supportUnreadCount;

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-black hover:bg-gray-800"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[32rem] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">Messages</h3>
          {totalUnreadCount > 0 && (
            <Badge variant="destructive" className="h-5 px-2 text-xs">
              {totalUnreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'property' | 'support')} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="property" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Property
                {propertyUnreadCount > 0 && (
                  <Badge variant="destructive" className="h-4 w-4 p-0 text-xs flex items-center justify-center">
                    {propertyUnreadCount > 9 ? '9+' : propertyUnreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Support
                {supportUnreadCount > 0 && (
                  <Badge variant="destructive" className="h-4 w-4 p-0 text-xs flex items-center justify-center">
                    {supportUnreadCount > 9 ? '9+' : supportUnreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="flex-1 px-4 pb-4 mt-2">
              <PropertyChatsTab
                conversations={getPropertyConversations()}
                onSendMessage={sendPropertyMessage}
                onMarkAsRead={markPropertyMessagesAsRead}
                loading={propertyLoading}
              />
            </TabsContent>

            <TabsContent value="support" className="flex-1 px-4 pb-4 mt-2">
              <SupportChatTab
                conversations={supportConversations}
                onSendMessage={sendSupportMessage}
                onMarkAsRead={markSupportMessagesAsRead}
                loading={supportLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default UnifiedChatWidget;
