
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickActionsProps {
  onRequestShowing: () => void;
  onMakeOffer: () => void;
}

const QuickActions = ({ onRequestShowing, onMakeOffer }: QuickActionsProps) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Button 
            onClick={onRequestShowing}
            className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 h-auto py-3 sm:py-4"
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base">Schedule Tour</div>
              <div className="text-xs sm:text-sm opacity-70 truncate">Find your next home</div>
            </div>
          </Button>
          
          <Button 
            onClick={onMakeOffer}
            className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-0 h-auto py-3 sm:py-4"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base">Make an Offer</div>
              <div className="text-xs sm:text-sm opacity-70 truncate">Start your home purchase</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
