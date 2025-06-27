
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

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

  const handleSign = async () => {
    setSaving(true);
    await onSign(name);
    setSaving(false);
    setName('');
    setAgree(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tour Agreement</DialogTitle>
          <DialogDescription>
            Please review the tour details and sign the non-exclusive buyer agreement to confirm your showing.
          </DialogDescription>
        </DialogHeader>

        {showingDetails && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Tour Details</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{showingDetails.propertyAddress}</span>
                </div>
                
                {showingDetails.date && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>
                      {new Date(showingDetails.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                
                {showingDetails.time && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span>{showingDetails.time}</span>
                  </div>
                )}

                {showingDetails.agentName && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4 text-purple-500" />
                    <span>Agent: {showingDetails.agentName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Agreement Terms</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Single-Day Non-Exclusive Tour Agreement:</strong> This agreement allows you to tour the specified property 
              with the assigned agent for this single showing only.
            </p>
            <p>
              <strong>Non-Exclusive:</strong> You are not obligated to work exclusively with this agent for future property searches 
              or purchases. This agreement is specific to this single tour only.
            </p>
            <p>
              <strong>Tour Scope:</strong> The agreement covers the property viewing, agent guidance, and any questions you may have 
              about the property during the scheduled tour time.
            </p>
            <p>
              <strong>No Ongoing Obligations:</strong> After the tour, you have no continuing obligations to the agent unless you 
              choose to enter into a separate agreement.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Electronic Signature - Type your full name
            </label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your full name to sign electronically" 
              className="w-full"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="agree" 
              checked={agree} 
              onCheckedChange={setAgree}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700 leading-relaxed">
              I have read and agree to the terms of this single-day non-exclusive tour agreement. 
              I understand this agreement is limited to the specified property tour only and creates 
              no ongoing obligations.
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSign} 
            disabled={!name.trim() || !agree || saving} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {saving ? 'Signing...' : 'Sign Agreement & Confirm Tour'}
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
