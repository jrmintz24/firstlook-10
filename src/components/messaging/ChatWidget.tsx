
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import MessagingInterface from "./MessagingInterface";

interface ChatWidgetProps {
  userId: string;
  unreadCount: number;
  onOpenInbox: () => void;
}

const ChatWidget = ({ userId, unreadCount, onOpenInbox }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 z-40 bg-white rounded-lg shadow-xl border transition-all duration-300 ${
          isMinimized ? 'h-12' : 'h-96 w-80'
        }`}>
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Messages</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 h-6 w-6"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="h-80 overflow-hidden">
              <MessagingInterface
                userId={userId}
                userType="buyer"
                compact={true}
                className="h-full"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
