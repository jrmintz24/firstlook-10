
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, TrendingUp, Home, FileText } from "lucide-react";

interface StatsAndMessagesProps {
  stats: {
    toursCompleted: number;
    propertiesViewed: number;
    offersMade: number;
  };
  unreadMessages: number;
  onOpenInbox: () => void;
}

const StatsAndMessages = ({ stats, unreadMessages, onOpenInbox }: StatsAndMessagesProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600">Tours Completed</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.toursCompleted}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600">Properties Viewed</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.propertiesViewed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-600">Offers Made</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.offersMade}</span>
          </div>
        </div>
      </Card>

      {/* Messages Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
          {unreadMessages > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadMessages}
            </span>
          )}
        </div>
        
        <div className="text-center py-8">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          {unreadMessages > 0 ? (
            <>
              <p className="text-lg font-medium text-gray-800 mb-2">
                {unreadMessages} Unread Message{unreadMessages > 1 ? 's' : ''}
              </p>
              <p className="text-gray-600 mb-4">Stay connected with your agent</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-800 mb-2">All Caught Up!</p>
              <p className="text-gray-600 mb-4">No new messages</p>
            </>
          )}
          
          <Button onClick={onOpenInbox} variant="outline">
            Open Inbox
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StatsAndMessages;
