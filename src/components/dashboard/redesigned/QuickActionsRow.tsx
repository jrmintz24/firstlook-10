
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, History, HelpCircle } from "lucide-react";

interface QuickActionsRowProps {
  onBookTour: () => void;
  onViewHistory: () => void;
  onAskQuestion: () => void;
}

const QuickActionsRow = ({ onBookTour, onViewHistory, onAskQuestion }: QuickActionsRowProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={onBookTour}
          className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Calendar className="w-5 h-5" />
          Book Another Tour
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onViewHistory}
          className="flex items-center justify-center gap-2 h-12"
        >
          <History className="w-5 h-5" />
          Browse Tour History
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onAskQuestion}
          className="flex items-center justify-center gap-2 h-12"
        >
          <HelpCircle className="w-5 h-5" />
          Ask a Question
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsRow;
