
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress?: string;
}

const MakeOfferModal = ({ isOpen, onClose, propertyAddress }: MakeOfferModalProps) => {
  const [offerAmount, setOfferAmount] = useState("");
  const [earnestMoney, setEarnestMoney] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate offer submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Offer Submitted!",
        description: "Your offer has been submitted and will be reviewed by the listing agent.",
      });
      
      onClose();
      // Reset form
      setOfferAmount("");
      setEarnestMoney("");
      setClosingDate("");
      setAdditionalTerms("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            {propertyAddress ? `Submit your offer for ${propertyAddress}` : "Submit your offer for this property"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offerAmount">Offer Amount ($)</Label>
            <Input
              id="offerAmount"
              type="number"
              placeholder="500000"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="earnestMoney">Earnest Money ($)</Label>
            <Input
              id="earnestMoney"
              type="number"
              placeholder="10000"
              value={earnestMoney}
              onChange={(e) => setEarnestMoney(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="closingDate">Preferred Closing Date</Label>
            <Input
              id="closingDate"
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalTerms">Additional Terms (Optional)</Label>
            <Textarea
              id="additionalTerms"
              placeholder="Any special conditions or terms..."
              value={additionalTerms}
              onChange={(e) => setAdditionalTerms(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
