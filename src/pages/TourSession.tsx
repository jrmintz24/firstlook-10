
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Home, MapPin, Clock, ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AddressAutocomplete from "@/components/AddressAutocomplete";

interface Property {
  id: string;
  address: string;
}

const TourSession = () => {
  const [formData, setFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    message: ""
  });
  const [properties, setProperties] = useState<Property[]>([
    { id: "1", address: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertyChange = (id: string, address: string) => {
    setProperties(prev => 
      prev.map(prop => prop.id === id ? { ...prop, address } : prop)
    );
  };

  const addProperty = () => {
    if (properties.length < 3) {
      setProperties(prev => [...prev, { id: Date.now().toString(), address: "" }]);
    }
  };

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      setProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Tour Session Booked!",
        description: "We'll contact you within 24 hours to confirm your tour session.",
      });

      setFormData({
        preferredDate: "",
        preferredTime: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        message: ""
      });
      setProperties([{ id: "1", address: "" }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/subscriptions">
            <Button variant="ghost" className="mb-4 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-3">Book Your Tour Session</h1>
            <p className="text-lg text-gray-600 mb-6">See up to 3 homes in one session</p>
            
            <div className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-light mb-1">$149</div>
                <p className="text-xs opacity-90">One-time payment • No ongoing commitment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="w-5 h-5" />
              Tour Session Details
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Add up to 3 properties and your preferred tour time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Properties */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Properties to Tour ({properties.length}/3)
                  </h3>
                  {properties.length < 3 && (
                    <Button type="button" variant="outline" size="sm" onClick={addProperty} className="border border-gray-300 hover:border-black text-sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Property
                    </Button>
                  )}
                </div>
                
                {properties.map((property, index) => (
                  <div key={property.id} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <AddressAutocomplete
                        value={property.address}
                        onChange={(value) => handlePropertyChange(property.id, value)}
                        placeholder="Enter property address"
                        label={`Property ${index + 1} ${index === 0 ? "*" : ""}`}
                        id={`property-${property.id}`}
                      />
                    </div>
                    {properties.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProperty(property.id)}
                        className="h-12 w-12 border border-gray-300 hover:border-red-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Schedule
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDate" className="text-sm font-medium text-gray-900 mb-2 block">
                      Preferred Date *
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-10 border border-gray-300 focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-900 mb-2 block">
                      Preferred Start Time *
                    </Label>
                    <select
                      id="preferredTime"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black bg-white text-sm"
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <strong>Note:</strong> Tours typically take 2-3 hours depending on the number of properties and travel time between them.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactName" className="text-sm font-medium text-gray-900 mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className="h-10 border border-gray-300 focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-900 mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="h-10 border border-gray-300 focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-900 mb-2 block">
                      Phone *
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      className="h-10 border border-gray-300 focus:border-black"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-900 mb-2 block">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Any specific questions or requirements for this tour session?"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={3}
                  className="border border-gray-300 focus:border-black resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Book Tour Session - $149"}
              </Button>
              
              <p className="text-xs text-gray-600 text-center">
                You'll be contacted within 24 hours to confirm your tour session and arrange payment
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourSession;
