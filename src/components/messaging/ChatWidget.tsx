
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import MessagingInterface from "./MessagingInterface";

interface ChatWidgetProps {
  userId: string;
  unreadCount: number;
  onOpenInbox: () => void;
}

const ChatWidget = ({ userId, unreadCount, onOpenInbox }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOpenFullInbox = () => {
    setIsOpen(false);
    onOpenInbox();
  };

  return (
    <>
      {/* Chat Toggle Button - Improved design */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 relative group"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center px-1 animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {unreadCount > 0 ? `${unreadCount} new messages` : "Open chat"}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </Button>
      </div>

      {/* Chat Panel - Improved design and mobile responsive */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized 
            ? 'h-14 w-80' 
            : 'h-[500px] w-80 sm:w-96'
        } max-w-[calc(100vw-3rem)]`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">Messages</span>
                {unreadCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs font-medium">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenFullInbox}
                  className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Open full inbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          {!isMinimized && (
            <div className="h-[440px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <MessagingInterface
                  userId={userId}
                  userType="buyer"
                  compact={true}
                  className="h-full border-0 rounded-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
