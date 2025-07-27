
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface ShowingDetails {
  propertyAddress: string;
  date: string | null;
  time: string | null;
  agentName: string | null;
}

interface SignAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (name: string) => Promise<void>;
  showingDetails?: ShowingDetails;
}

const SignAgreementModal = ({ isOpen, onClose, onSign, showingDetails }: SignAgreementModalProps) => {
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSign = async () => {
    setSaving(true);
    await onSign(name);
    setSaving(false);
    setName('');
    setAgree(false);
    onClose();
  };

  const handleAgreeChange = (checked: boolean | "indeterminate") => {
    setAgree(checked === true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-gray-900">Confirm Your Tour</DialogTitle>
          <DialogDescription className="text-gray-600">
            Quick signature to confirm your property showing
          </DialogDescription>
        </DialogHeader>

        {showingDetails && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-800">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-sm">{showingDetails.propertyAddress}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  {showingDetails.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-purple-500" />
                      <span>
                        {new Date(showingDetails.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  
                  {showingDetails.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-purple-500" />
                      <span>{showingDetails.time}</span>
                    </div>
                  )}

                  {showingDetails.agentName && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-purple-500" />
                      <span>{showingDetails.agentName}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Electronic Signature
            </label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Type your full name" 
              className="w-full"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="agree" 
                checked={agree} 
                onCheckedChange={handleAgreeChange}
                className="mt-0.5"
              />
              <label htmlFor="agree" className="text-sm text-gray-700 leading-relaxed">
                I agree to the <strong>single-tour agreement</strong> for this property showing only. 
                No ongoing obligations.
              </label>
            </div>
            
            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 mt-2">
                <FileText className="h-3 w-3" />
                <span>View full terms</span>
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="text-xs text-gray-600 space-y-1 bg-white p-3 rounded border">
                  <p>
                    <strong>Single-Day Non-Exclusive Agreement:</strong> This allows you to tour the specified property 
                    with the assigned agent for this showing only.
                  </p>
                  <p>
                    <strong>Non-Exclusive:</strong> No obligation to work exclusively with this agent for future searches. 
                    This agreement is specific to this single tour only.
                  </p>
                  <p>
                    <strong>No Ongoing Obligations:</strong> After the tour, you have no continuing obligations unless you 
                    choose to enter into a separate agreement.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleSign} 
            disabled={!name.trim() || !agree || saving} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {saving ? 'Confirming...' : 'Confirm Tour'}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignAgreementModal;
