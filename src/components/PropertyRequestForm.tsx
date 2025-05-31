
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyRequestForm = ({ isOpen, onClose }: PropertyRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    mlsId: '',
    preferredDate1: '',
    preferredTime1: '',
    preferredDate2: '',
    preferredTime2: '',
    preferredDate3: '',
    preferredTime3: '',
    notes: '',
    contactMethod: 'email',
    // Account creation fields
    firstName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const generatePassword = () => {
    // Generate a simple password based on first name + random numbers
    const randomNum = Math.floor(Math.random() * 9999);
    return `${formData.firstName}${randomNum}`;
  };

  const submitShowingRequest = async (userId: string) => {
    const propertyAddress = formData.propertyAddress || `MLS ID: ${formData.mlsId}`;
    const preferredDate = formData.preferredDate1;
    const preferredTime = formData.preferredTime1;

    const { error } = await supabase
      .from('showing_requests')
      .insert({
        user_id: userId,
        property_address: propertyAddress,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: formData.notes || null,
        status: 'pending'
      });

    if (error) {
      console.error('Error submitting showing request:', error);
      throw new Error('Failed to submit showing request');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name, email, and phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let currentUser = user;
      
      // If user is not logged in, create account
      if (!currentUser) {
        const password = generatePassword();
        
        const metadata = {
          first_name: formData.firstName,
          last_name: '', // We're only collecting first name for simplicity
          phone: formData.phone,
          user_type: 'buyer'
        };

        console.log('Creating account with:', { email: formData.email, metadata });

        const { error: signUpError } = await signUp(formData.email, password, metadata);
        
        if (signUpError) {
          console.error('Signup error:', signUpError);
          
          // If user already exists, that's actually fine - we'll just submit without auth
          if (signUpError.message?.includes('User already registered') || 
              signUpError.message?.includes('already been registered')) {
            
            // Try to create an unverified showing request using just the email
            const { error: insertError } = await supabase
              .from('showing_requests')
              .insert({
                user_id: null, // We'll handle this when they verify later
                property_address: formData.propertyAddress || `MLS ID: ${formData.mlsId}`,
                preferred_date: formData.preferredDate1 || null,
                preferred_time: formData.preferredTime1 || null,
                message: `UNVERIFIED REQUEST - Name: ${formData.firstName}, Email: ${formData.email}, Phone: ${formData.phone}. Notes: ${formData.notes || 'None'}`,
                status: 'pending_verification'
              });

            if (insertError) {
              console.error('Error creating unverified request:', insertError);
              toast({
                title: "Request Failed",
                description: "Unable to submit your request. Please try again.",
                variant: "destructive"
              });
              return;
            }

            toast({
              title: "Request Submitted! 📧",
              description: "Since you already have an account, we've submitted your request. Please check your email for verification when an agent contacts you.",
            });
            
            onClose();
            setStep(1);
            setFormData({
              propertyAddress: '',
              mlsId: '',
              preferredDate1: '',
              preferredTime1: '',
              preferredDate2: '',
              preferredTime2: '',
              preferredDate3: '',
              preferredTime3: '',
              notes: '',
              contactMethod: 'email',
              firstName: '',
              email: '',
              phone: '',
              password: ''
            });
            return;
          } else {
            toast({
              title: "Account Creation Failed",
              description: signUpError.message || "Failed to create account. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }

        // Account was created successfully, but user needs to verify email
        // Let's submit the request anyway and handle verification later
        const { error: insertError } = await supabase
          .from('showing_requests')
          .insert({
            user_id: null, // Will be linked when they verify
            property_address: formData.propertyAddress || `MLS ID: ${formData.mlsId}`,
            preferred_date: formData.preferredDate1 || null,
            preferred_time: formData.preferredTime1 || null,
            message: `PENDING VERIFICATION - Name: ${formData.firstName}, Email: ${formData.email}, Phone: ${formData.phone}. Password: ${password}. Notes: ${formData.notes || 'None'}`,
            status: 'pending_verification'
          });

        if (insertError) {
          console.error('Error creating pending request:', insertError);
          toast({
            title: "Request Failed",
            description: "Unable to submit your request. Please try again.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Request Submitted! 🎉",
          description: `Your account has been created! When an agent accepts your showing, you'll receive an email to verify your account. Your temporary password is: ${password}`,
          duration: 15000,
        });
        
      } else {
        // User is already logged in, submit normally
        await submitShowingRequest(currentUser.id);

        toast({
          title: "Request Submitted! 🎉",
          description: "We'll match you with a showing partner and send confirmation within 24 hours.",
        });
      }
      
      onClose();
      setStep(1);
      setFormData({
        propertyAddress: '',
        mlsId: '',
        preferredDate1: '',
        preferredTime1: '',
        preferredDate2: '',
        preferredTime2: '',
        preferredDate3: '',
        preferredTime3: '',
        notes: '',
        contactMethod: 'email',
        firstName: '',
        email: '',
        phone: '',
        password: ''
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            Step {step} of {user ? 3 : 4} - Let's get you scheduled for your first free private showing
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
                <Calendar className="h-5 w-5 text-blue-600" />
                Preferred Showing Times
              </CardTitle>
              <CardDescription>
                Choose up to 3 preferred time slots to increase your chances of a quick match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <Label className="font-medium">Option {num}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`date${num}`} className="text-sm">Date</Label>
                      <Input
                        id={`date${num}`}
                        type="date"
                        value={formData[`preferredDate${num}` as keyof typeof formData]}
                        onChange={(e) => handleInputChange(`preferredDate${num}`, e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`time${num}`} className="text-sm">Time</Label>
                      <select
                        id={`time${num}`}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData[`preferredTime${num}` as keyof typeof formData]}
                        onChange={(e) => handleInputChange(`preferredTime${num}`, e.target.value)}
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
            <CardContent className="space-y-4">
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button 
                  onClick={user ? handleSubmit : handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {user ? (isLoading ? "Submitting..." : "Submit Request") : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && !user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Create Your Account
              </CardTitle>
              <CardDescription>
                Almost done! Just need a few details to submit your request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🎉 Almost there!</h4>
                  <p className="text-sm text-green-700">
                    We'll create your account and you'll verify it when an agent accepts your showing request.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(3)} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account & Submitting..." : "Submit Request"}
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
