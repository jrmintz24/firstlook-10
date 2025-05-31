
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyRequestForm = ({ isOpen, onClose }: PropertyRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    mlsId: '',
    preferredDates: [null, null, null] as (Date | null)[],
    preferredTimes: ['', '', ''],
    notes: '',
    contactMethod: 'email'
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (index: number, date: Date | undefined) => {
    setFormData(prev => {
      const newDates = [...prev.preferredDates];
      newDates[index] = date || null;
      return { ...prev, preferredDates: newDates };
    });
  };

  const handleTimeChange = (index: number, time: string) => {
    setFormData(prev => {
      const newTimes = [...prev.preferredTimes];
      newTimes[index] = time;
      return { ...prev, preferredTimes: newTimes };
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.propertyAddress && !formData.mlsId) {
      toast({
        title: "Property Required",
        description: "Please provide either a property address or MLS ID",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted! 🎉",
      description: "We'll match you with a showing partner and send confirmation within 24 hours.",
    });
    onClose();
    setStep(1);
    setFormData({
      propertyAddress: '',
      mlsId: '',
      preferredDates: [null, null, null],
      preferredTimes: ['', '', ''],
      notes: '',
      contactMethod: 'email'
    });
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🏠 Request Your Free Showing
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3 - Let's get you scheduled for your first free private showing
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Property Information
              </CardTitle>
              <CardDescription>
                Tell us which property you'd like to see
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  placeholder="123 Main St, Washington, DC 20001"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                />
              </div>
              <div className="text-center text-gray-500">— OR —</div>
              <div>
                <Label htmlFor="mlsId">MLS ID</Label>
                <Input
                  id="mlsId"
                  placeholder="DC1234567"
                  value={formData.mlsId}
                  onChange={(e) => handleInputChange('mlsId', e.target.value)}
                />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <DollarSign className="h-3 w-3 mr-1" />
                Your first showing is 100% FREE
              </Badge>
              <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                Preferred Showing Times
              </CardTitle>
              <CardDescription>
                Choose up to 3 preferred time slots to increase your chances of a quick match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <Label className="font-medium text-blue-900">Option {index + 1}</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor={`date${index}`} className="text-sm text-gray-700">Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-12",
                              !formData.preferredDates[index] && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.preferredDates[index] ? (
                              format(formData.preferredDates[index]!, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.preferredDates[index] || undefined}
                            onSelect={(date) => handleDateChange(index, date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor={`time${index}`} className="text-sm text-gray-700">Preferred Time</Label>
                      <select
                        id={`time${index}`}
                        className="w-full h-12 px-3 rounded-md border border-input bg-background text-sm"
                        value={formData.preferredTimes[index]}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Additional Details
              </CardTitle>
              <CardDescription>
                Any special requests or notes for your showing partner?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific areas you'd like to focus on, accessibility needs, or questions about the property..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We'll match you with a licensed showing partner</li>
                    <li>• You'll receive confirmation within 24 hours</li>
                    <li>• Your showing partner will coordinate access</li>
                    <li>• Enjoy your free, no-pressure viewing!</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyRequestForm;
