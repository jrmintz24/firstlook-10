
import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Home, Plus, X, AlertTriangle, ChevronRight } from "lucide-react";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import FreeShowingLimitModal from "@/components/showing-limits/FreeShowingLimitModal";

interface ModernTourSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  skipNavigation?: boolean;
}

const timeSlots = [
  { value: "9:00 AM", label: "9:00 AM", popular: false },
  { value: "10:00 AM", label: "10:00 AM", popular: true },
  { value: "11:00 AM", label: "11:00 AM", popular: true },
  { value: "12:00 PM", label: "12:00 PM", popular: false },
  { value: "1:00 PM", label: "1:00 PM", popular: true },
  { value: "2:00 PM", label: "2:00 PM", popular: true },
  { value: "3:00 PM", label: "3:00 PM", popular: true },
  { value: "4:00 PM", label: "4:00 PM", popular: false },
  { value: "5:00 PM", label: "5:00 PM", popular: false },
  { value: "6:00 PM", label: "6:00 PM", popular: false }
];

const ModernTourSchedulingModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  skipNavigation = true 
}: ModernTourSchedulingModalProps) => {
  const { user } = useAuth();
  const { eligibility } = useShowingEligibility();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [properties, setProperties] = useState([{ address: "", notes: "" }]);

  const {
    showAuthModal,
    setShowAuthModal,
    showFreeShowingLimitModal,
    setShowFreeShowingLimitModal,
    isSubmitting,
    handleContinueToSubscriptions,
    handleCancelPendingShowing,
    pendingShowingAddress,
    resetForm
  } = usePropertyRequest(onClose, onSuccess, skipNavigation);

  // Determine user capabilities
  const isGuest = !user;
  const isPremium = eligibility?.eligible && eligibility.reason === 'subscribed';
  const maxProperties = isPremium ? 3 : 1;

  const handleClose = () => {
    resetForm();
    setProperties([{ address: "", notes: "" }]);
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    onClose();
  };

  const handleAddProperty = () => {
    if (properties.length < maxProperties) {
      setProperties(prev => [...prev, { address: "", notes: "" }]);
    }
  };

  const handleRemoveProperty = (index: number) => {
    if (properties.length > 1) {
      setProperties(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handlePropertyChange = (index: number, field: 'address' | 'notes', value: string) => {
    setProperties(prev => prev.map((prop, i) => 
      i === index ? { ...prop, [field]: value } : prop
    ));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !properties[0].address.trim()) {
      return;
    }

    // Convert our local state to the format expected by the hook
    const formData = {
      propertyAddress: properties[0].address,
      preferredDate1: selectedDate,
      preferredTime1: selectedTime,
      preferredDate2: "",
      preferredTime2: "",
      preferredDate3: "",
      preferredTime3: "",
      notes,
      properties,
      preferredOptions: [{ date: selectedDate, time: selectedTime }],
      selectedProperties: properties.map(p => p.address).filter(Boolean)
    };

    await handleContinueToSubscriptions();
  };

  const getMinDate = () => {
    const minDate = new Date();
    if (isGuest) {
      minDate.setHours(minDate.getHours() + 23);
    }
    return minDate.toISOString().split('T')[0];
  };

  const getDateDisplay = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    if (user || !date || !time) return true;
    
    const selectedDateTime = new Date(date);
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    let adjustedHours = hours;
    if (period === 'PM' && hours !== 12) {
      adjustedHours += 12;
    } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
    
    selectedDateTime.setHours(adjustedHours, minutes, 0, 0);
    
    const minDateTime = new Date();
    if (isGuest) {
      minDateTime.setHours(minDateTime.getHours() + 23);
    }
    return selectedDateTime >= minDateTime;
  };

  const canSubmit = selectedDate && selectedTime && properties[0].address.trim();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white border-0 shadow-2xl p-0 overflow-hidden">
          <div className="relative">
            {/* Header */}
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-light text-gray-900">
                      Schedule Your Tour
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {isGuest ? "Book your first home tour" : 
                       isPremium ? `Tour up to ${maxProperties} homes in one session` : 
                       "Schedule a home tour"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
              {/* Guest Notice */}
              {isGuest && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Guest Booking</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Tours must be scheduled 24+ hours in advance. Sign up for same-day booking!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Property Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {properties.length > 1 ? 'Properties' : 'Property'} to Tour
                    </h3>
                    {isPremium && properties.length < maxProperties && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddProperty}
                        className="border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {properties.map((property, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Property {index + 1}
                            </span>
                          </div>
                          {properties.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProperty(index)}
                              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <AddressAutocomplete
                          value={property.address}
                          onChange={(value) => handlePropertyChange(index, 'address', value)}
                          placeholder="Enter property address..."
                          className="mb-3"
                        />
                        
                        <Textarea
                          value={property.notes}
                          onChange={(e) => handlePropertyChange(index, 'notes', e.target.value)}
                          placeholder="Any specific notes for this property..."
                          className="min-h-[60px] border-gray-200 focus:border-black focus:ring-1 focus:ring-black resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  {!isPremium && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Want to tour multiple properties?</p>
                          <p className="text-xs text-gray-600 mt-1">Upgrade to tour up to 3 homes in one session</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-400 hover:border-black">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date & Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Preferred Date & Time</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date
                      </label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={getMinDate()}
                        className="h-12 border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                      />
                      {selectedDate && (
                        <p className="text-xs text-gray-500 mt-2">{getDateDisplay(selectedDate)}</p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {timeSlots
                          .filter(slot => !selectedDate || isTimeSlotAvailable(selectedDate, slot.value))
                          .map((slot) => (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setSelectedTime(slot.value)}
                              className={`p-2 text-xs rounded-lg border transition-all ${
                                selectedTime === slot.value
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              } ${slot.popular ? 'ring-1 ring-blue-200' : ''}`}
                            >
                              {slot.label}
                              {slot.popular && <span className="block text-[10px] opacity-70">Popular</span>}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {selectedDate && timeSlots.filter(slot => isTimeSlotAvailable(selectedDate, slot.value)).length === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        No available times for this date. Please select a later date.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or questions..."
                    className="min-h-[80px] border-gray-300 focus:border-black focus:ring-1 focus:ring-black resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {canSubmit ? "Ready to schedule your tour" : "Complete the form above"}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Tour"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuickSignInModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => handleContinueToSubscriptions()}
      />

      <FreeShowingLimitModal
        isOpen={showFreeShowingLimitModal}
        onClose={() => setShowFreeShowingLimitModal(false)}
        onCancelPendingShowing={handleCancelPendingShowing}
        pendingShowingAddress={pendingShowingAddress}
      />
    </>
  );
};

export default ModernTourSchedulingModal;
