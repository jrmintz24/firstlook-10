import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuickOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const QuickOfferModal: React.FC<QuickOfferModalProps> = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}) => {
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    timeframe: 'within_week',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create offer intent
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          property_address: propertyAddress,
          offer_type: 'consultation_request',
          consultation_requested: true
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking
      const { error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          offer_intent_id: offerIntent.id,
          agent_id: agentId || null,
          property_address: propertyAddress,
          preferred_timeframe: formData.timeframe,
          buyer_name: formData.contactName,
          buyer_email: formData.email,
          buyer_phone: formData.phone,
          special_requests: formData.notes
        });

      if (bookingError) throw bookingError;

      setIsSuccess(true);
      
      toast({
        title: "Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your consultation.",
      });

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          contactName: '',
          email: '',
          phone: '',
          timeframe: 'within_week',
          notes: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting offer request:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-4">
              We'll contact you within 24 hours to schedule your consultation for {propertyAddress}.
            </p>
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">Request Offer Consultation</DialogTitle>
          <p className="text-sm text-gray-600">{propertyAddress}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                placeholder="Your name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Preferred Timeline</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: 'asap', label: 'ASAP', icon: Clock },
                { value: 'within_week', label: 'This Week', icon: Calendar },
                { value: 'within_month', label: 'This Month', icon: Calendar }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, timeframe: option.value }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.timeframe === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific questions or requirements?"
              rows={2}
              className="mt-1 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Request Consultation
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Our agent will contact you to discuss your offer strategy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOfferModal;