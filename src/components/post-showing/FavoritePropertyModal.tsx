
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface FavoritePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes?: string) => Promise<void>;
  propertyAddress: string;
  isSubmitting?: boolean;
}

const FavoritePropertyModal = ({
  isOpen,
  onClose,
  onSave,
  propertyAddress,
  isSubmitting = false
}: FavoritePropertyModalProps) => {
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    await onSave(notes.trim() || undefined);
    setNotes("");
    onClose();
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Save to Favorites
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Save <strong>{propertyAddress}</strong> to your favorites for easy access later.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you like about this property? Any concerns or questions?"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Add any thoughts about the property, things you liked, or questions for later.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Saving..." : "Save to Favorites"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritePropertyModal;
