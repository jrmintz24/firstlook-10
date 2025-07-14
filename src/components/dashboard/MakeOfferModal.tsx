
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  propertyAddress
}) => {
  const handleMakeOffer = () => {
    // TODO: Implement offer creation workflow
    console.log('Making offer for:', propertyAddress);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Make an Offer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Ready to make an offer on <strong>{propertyAddress}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Our offer creation tool will guide you through the process step by step.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMakeOffer}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
