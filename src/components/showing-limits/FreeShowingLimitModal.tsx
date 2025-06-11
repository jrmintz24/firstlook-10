
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
}

const FreeShowingLimitModal = ({ 
  isOpen, 
  onClose, 
  onCancelPendingShowing,
  pendingShowingAddress,
  activeShowingCount = 1
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
            Free Showing Already Scheduled
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900">You already have a showing scheduled!</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Your free FirstLook showing is currently scheduled. To see additional homes, you'll need to subscribe or manage your existing booking.
                </p>
                {pendingShowingAddress && (
                  <p className="text-blue-600 text-sm font-medium mt-2">
                    Current showing: {pendingShowingAddress}
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
                    Get unlimited showings, priority scheduling, and exclusive features
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    View Plans & Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Cancel Current Option */}
              <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer" onClick={handleCancelShowing}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cancel Current Showing</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Cancel your scheduled showing to book a different property instead
                  </p>
                  <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                    Cancel & Choose Different Home
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
              <strong>Note:</strong> Your first showing with FirstLook is completely free with no commitments. 
              Additional showings require a subscription to ensure we can provide the best service to all our buyers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeShowingLimitModal;
