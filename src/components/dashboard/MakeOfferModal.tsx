
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
}

const MakeOfferModal = ({
  isOpen,
  onClose,
  propertyAddress
}: MakeOfferModalProps) => {
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!offerAmount) {
      toast({
        title: "Offer Amount Required",
        description: "Please enter an offer amount.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // This would typically submit to a backend API
      console.log('Making offer:', { propertyAddress, offerAmount, message });
      
      toast({
        title: "Offer Submitted",
        description: "Your offer has been submitted for review.",
      });

      onClose();
    } catch (error) {
      console.error('Error making offer:', error);
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Make an Offer
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {propertyAddress || "Select a property"}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Offer Amount *
            </label>
            <Input
              type="number"
              placeholder="Enter offer amount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Message (optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any additional details or conditions..."
              className="min-h-[80px]"
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !offerAmount}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Submitting..." : "Submit Offer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeOfferModal;
