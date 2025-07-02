
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare } from "lucide-react";

interface QuickActionsProps {
  onRequestShowing: () => void;
  onMakeOffer: () => void;
}

const QuickActions = ({ onRequestShowing, onMakeOffer }: QuickActionsProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2.5 sm:space-y-3">
          <Button 
            onClick={onRequestShowing} 
            className="w-full justify-start gap-2.5 h-10 sm:h-11"
            size="sm"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Request Tour</span>
          </Button>
          
          <Button 
            onClick={onMakeOffer} 
            variant="outline" 
            className="w-full justify-start gap-2.5 h-10 sm:h-11"
            size="sm"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Make Offer</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2.5 h-10 sm:h-11"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Contact Support</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
