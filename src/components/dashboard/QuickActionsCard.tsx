
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsCardProps {
  unreadCount?: number;
  onOpenMessages?: () => void;
}

const QuickActionsCard = ({ unreadCount = 0, onOpenMessages }: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <Link to="/my-offers">
              <FileText className="w-5 h-5" />
              <span className="text-sm">My Offers</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col gap-2 relative"
            onClick={onOpenMessages}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <Link to="/profile">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <Link to="/help">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm">Help</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
