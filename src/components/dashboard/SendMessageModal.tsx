import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
}

const SendMessageModal = ({ isOpen, onClose, onSend }: SendMessageModalProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await onSend(message);
    setSending(false);
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            This will notify the buyer about the showing.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={4}
          className="mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleSend} disabled={sending || !message} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Send
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageModal;
