
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Calendar, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FreeShowingLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancelPendingShowing: () => Promise<void>;
  pendingShowingAddress?: string;
  activeShowingCount?: number;
  toursUsed?: number;
  toursLimit?: number;
}

const FreeShowingLimitModal = ({ 
  isOpen, 
  onClose, 
  onCancelPendingShowing,
  pendingShowingAddress,
  activeShowingCount = 1,
  toursUsed = 5,
  toursLimit = 5
}: FreeShowingLimitModalProps) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/subscriptions');
    onClose();
  };

  const handleCancelShowing = async () => {
    await onCancelPendingShowing();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-purple-600" />
            Monthly Tour Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900">You've used all your tours this month!</h3>
                <p className="text-blue-700 text-sm mt-1">
                  You've completed {toursUsed} of {toursLimit} free tours this month. To schedule additional tours, you'll need to subscribe or wait until next month.
                </p>
                {pendingShowingAddress && (
                  <p className="text-blue-600 text-sm font-medium mt-2">
                    Recent tour: {pendingShowingAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">What would you like to do?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Subscribe Option */}
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer" onClick={handleSubscribe}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Subscribe to FirstLook</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get unlimited tours, priority scheduling, and exclusive features
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    View Plans & Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Wait for Next Month Option */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wait for Next Month</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Your tour quota will reset next month and you'll get 5 new free tours
                  </p>
                  <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50" onClick={onClose}>
                    I'll Wait for Next Month
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              Maybe Later
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              <strong>Free Plan:</strong> You get 5 tours per month with FirstLook at no cost. 
              For unlimited tours and priority scheduling, consider upgrading to our Pro plan.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeShowingLimitModal;
