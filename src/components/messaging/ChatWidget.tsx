
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import MessagingInterface from "./MessagingInterface";

interface ChatWidgetProps {
  userId: string;
  unreadCount: number;
  className?: string;
}

const ChatWidget = ({ userId, unreadCount, className = "" }: ChatWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Messages</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="h-80">
            <MessagingInterface
              userId={userId}
              userType="buyer"
              compact={true}
              className="h-full border-0 rounded-none"
            />
          </div>
        </div>
      )}
      
      {/* Collapsed state preview */}
      {!isExpanded && unreadCount > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
