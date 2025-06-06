import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SignAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (name: string) => Promise<void>;
}

const SignAgreementModal = ({ isOpen, onClose, onSign }: SignAgreementModalProps) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Buyer Agreement</DialogTitle>
          <DialogDescription>
            Confirm your showing and agree to the temporary non-exclusive buyer agreement.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm mb-4">Type your name below to sign electronically.</p>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <Checkbox id="agree" checked={agree} onCheckedChange={() => setAgree(!agree)} />
          <label htmlFor="agree" className="text-sm">I agree to the terms of the non-exclusive buyer agreement.</label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSign} disabled={!name || !agree || saving} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Sign & Confirm
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignAgreementModal;
