
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, MapPin, Clock, ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Tour Session Booked!",
        description: "We'll contact you within 24 hours to confirm your tour session.",
      });

      // Reset form
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/subscriptions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
          
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <Home className="w-4 h-4 mr-2" />
              Tour Session
            </Badge>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Book Your Tour Session</h1>
            <p className="text-xl text-gray-600 mb-6">See up to 3 homes in one session for $149</p>
            
            <Card className="bg-blue-50 border-blue-200 mb-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$149</div>
                  <p className="text-blue-800">One-time payment • Up to 3 homes • No ongoing commitment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Tour Session Details
            </CardTitle>
            <CardDescription>
              Add up to 3 properties and your preferred tour time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Properties */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Properties to Tour ({properties.length}/3)
                  </h3>
                  {properties.length < 3 && (
                    <Button type="button" variant="outline" size="sm" onClick={addProperty}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Property
                    </Button>
                  )}
                </div>
                
                {properties.map((property, index) => (
                  <div key={property.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label htmlFor={`property-${property.id}`}>
                        Property {index + 1} {index === 0 && "*"}
                      </Label>
                      <Input
                        id={`property-${property.id}`}
                        placeholder="Enter property address"
                        value={property.address}
                        onChange={(e) => handlePropertyChange(property.id, e.target.value)}
                        required={index === 0}
                      />
                    </div>
                    {properties.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProperty(property.id)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Schedule
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preferredTime">Preferred Start Time *</Label>
                    <select
                      id="preferredTime"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
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
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Tours typically take 2-3 hours depending on the number of properties and travel time between them.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Your full name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone">Phone *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <Label htmlFor="message">Additional Notes (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific questions or requirements for this tour session?"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Book Tour Session - $149"}
              </Button>
              
              <p className="text-sm text-gray-600 text-center">
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
