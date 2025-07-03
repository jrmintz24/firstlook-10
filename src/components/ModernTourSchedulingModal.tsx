
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import PropertyRequestWizard from "@/components/PropertyRequestWizard";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { useToast } from "@/hooks/use-toast";

interface ModernTourSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  onOptimisticUpdate?: (pendingTours: any[]) => void;
  skipNavigation?: boolean;
}

const ModernTourSchedulingModal: React.FC<ModernTourSchedulingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOptimisticUpdate,
  skipNavigation = false
}) => {
  const [formData, setFormData] = useState<PropertyRequestFormData>({
    properties: [],
    preferredOptions: [],
    notes: "",
    propertyAddress: "",
    preferredDate1: "",
    preferredTime1: "",
    preferredDate2: "",
    preferredTime2: "",
    preferredDate3: "",
    preferredTime3: "",
    selectedProperties: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const { isSubmitting, submitShowingRequests } = useShowingSubmission(
    formData, 
    onSuccess,
    onOptimisticUpdate
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        properties: [],
        preferredOptions: [],
        notes: "",
        propertyAddress: "",
        preferredDate1: "",
        preferredTime1: "",
        preferredDate2: "",
        preferredTime2: "",
        preferredDate3: "",
        preferredTime3: "",
        selectedProperties: []
      });
      setIsComplete(false);
    }
  }, [isOpen]);

  const handleFormComplete = async (finalData: PropertyRequestFormData) => {
    setFormData(finalData);
    setIsComplete(true);
    
    console.log('ModernTourSchedulingModal: Form completed, submitting requests');
    
    try {
      await submitShowingRequests();
    } catch (error) {
      console.error('Error submitting showing requests:', error);
      toast({
        title: "Error",
        description: "Failed to submit your tour request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Schedule Your Tour
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Submitting Your Tour Request
                </h3>
                <p className="text-gray-600">
                  Please wait while we process your request...
                </p>
              </div>
            </div>
          ) : (
            <PropertyRequestWizard
              isOpen={isOpen}
              onClose={onClose}
              onComplete={handleFormComplete}
              skipNavigation={skipNavigation}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernTourSchedulingModal;
