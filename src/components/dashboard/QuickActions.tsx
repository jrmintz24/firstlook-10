
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Home, MessageSquare } from "lucide-react";

interface QuickActionsProps {
  onBookTour: () => void;
  onMakeOffer: () => void;
}

const QuickActions = ({ onBookTour, onMakeOffer }: QuickActionsProps) => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={onBookTour}
          className="flex items-center justify-center gap-2 h-12"
        >
          <Calendar className="w-5 h-5" />
          Book a Tour
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onMakeOffer}
          className="flex items-center justify-center gap-2 h-12"
        >
          <Home className="w-5 h-5" />
          Make an Offer
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 h-12"
        >
          <MessageSquare className="w-5 h-5" />
          Contact Agent
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
