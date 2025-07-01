
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsCardProps {
  unreadCount?: number;
  onOpenMessages?: () => void;
  onOpenSupport?: () => void;
}

const QuickActionsCard = ({ unreadCount = 0, onOpenMessages, onOpenSupport }: QuickActionsCardProps) => {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
            <Link to="/my-offers" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Offers</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-2 text-xs relative"
            onClick={onOpenMessages}
          >
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </Button>
          
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
            <Link to="/profile" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={onOpenSupport}
          >
            <div className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Help</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
