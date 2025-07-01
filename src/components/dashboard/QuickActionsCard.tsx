
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="h-12 flex flex-col gap-1">
            <Link to="/offer-questionnaire">
              <FileText className="w-4 h-4" />
              <span className="text-xs">My Offers</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-12 flex flex-col gap-1 relative"
            onClick={onOpenMessages}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          <Button asChild variant="outline" size="sm" className="h-12 flex flex-col gap-1">
            <Link to="/buyer-dashboard">
              <Settings className="w-4 h-4" />
              <span className="text-xs">Settings</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm" className="h-12 flex flex-col gap-1">
            <Link to="/faq">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs">Help</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
