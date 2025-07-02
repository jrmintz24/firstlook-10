
import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Home, Plus, X, ChevronRight, AlertCircle } from "lucide-react";
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
  { value: "9:00 AM", label: "9:00 AM", recommended: false },
  { value: "10:00 AM", label: "10:00 AM", recommended: true },
  { value: "11:00 AM", label: "11:00 AM", recommended: true },
  { value: "12:00 PM", label: "12:00 PM", recommended: false },
  { value: "1:00 PM", label: "1:00 PM", recommended: true },
  { value: "2:00 PM", label: "2:00 PM", recommended: true },
  { value: "3:00 PM", label: "3:00 PM", recommended: true },
  { value: "4:00 PM", label: "4:00 PM", recommended: false },
  { value: "5:00 PM", label: "5:00 PM", recommended: false },
  { value: "6:00 PM", label: "6:00 PM", recommended: false }
];

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }
  
  return days;
};

const ModernTourSchedulingModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  skipNavigation = true 
}: ModernTourSchedulingModalProps) => {
  const { user } = useAuth();
  const { eligibility } = useShowingEligibility();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
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
  const isPaidUser = eligibility?.eligible && eligibility.reason === 'subscribed';
  const maxProperties = isPaidUser ? 3 : 1;
  const maxPreferredTimes = 3;

  const availableDays = useMemo(() => getNext7Days(), []);

  const handleClose = () => {
    resetForm();
    setProperties([{ address: "", notes: "" }]);
    setSelectedDates([]);
    setSelectedTimes({});
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

  const handleDateSelection = (dateString: string) => {
    if (selectedDates.length < maxPreferredTimes && !selectedDates.includes(dateString)) {
      setSelectedDates(prev => [...prev, dateString]);
    } else if (selectedDates.includes(dateString)) {
      setSelectedDates(prev => prev.filter(d => d !== dateString));
      setSelectedTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[dateString];
        return newTimes;
      });
    }
  };

  const handleTimeSelection = (dateString: string, time: string) => {
    setSelectedTimes(prev => ({
      ...prev,
      [dateString]: time
    }));
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    if (!date || !time) return false;
    
    try {
      const selectedDate = new Date(date);
      const today = new Date();
      
      // Reset time components for date-only comparison
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      // For free users (including guests): No same-day bookings, allow any time from tomorrow onwards
      if (!isPaidUser) {
        return selectedDateOnly > todayDateOnly;
      }
      
      // For paid users: No bookings within 2 hours of current time
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }
      
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(adjustedHours, minutes, 0, 0);
      
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
      
      return selectedDateTime >= twoHoursFromNow;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!properties[0].address.trim() || selectedDates.length === 0) {
      return;
    }

    // Convert to expected format
    const formData = {
      propertyAddress: properties[0].address,
      preferredDate1: selectedDates[0] || "",
      preferredTime1: selectedTimes[selectedDates[0]] || "",
      preferredDate2: selectedDates[1] || "",
      preferredTime2: selectedTimes[selectedDates[1]] || "",
      preferredDate3: selectedDates[2] || "",
      preferredTime3: selectedTimes[selectedDates[2]] || "",
      notes,
      properties,
      preferredOptions: selectedDates.map(date => ({ 
        date, 
        time: selectedTimes[date] || "" 
      })).filter(option => option.time),
      selectedProperties: properties.map(p => p.address).filter(Boolean)
    };

    await handleContinueToSubscriptions();
  };

  const canSubmit = properties[0].address.trim() && selectedDates.length > 0 && 
                   selectedDates.every(date => selectedTimes[date]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] bg-white border-0 shadow-2xl p-0 overflow-hidden">
          <div className="relative">
            {/* Minimal Header */}
            <DialogHeader className="px-8 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-light text-gray-900">
                      Schedule Your Tour
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {isPaidUser ? `Book up to ${maxProperties} properties` : "Book your tour"}
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

            <div className="px-8 pb-8 max-h-[75vh] overflow-y-auto">
              {/* User Notice */}
              {isGuest && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Guest Booking</p>
                      <p className="text-xs text-gray-600 mt-1">
                        No same-day tours. Sign up for more flexible scheduling.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isGuest && !isPaidUser && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Free Plan</p>
                      <p className="text-xs text-blue-600 mt-1">
                        No same-day tours. Upgrade for 2-hour advance booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isPaidUser && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Pro Plan</p>
                      <p className="text-xs text-green-600 mt-1">
                        Book tours with just 2 hours advance notice.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Properties */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {properties.length > 1 ? 'Properties' : 'Property'}
                      </h3>
                      {isPaidUser && properties.length < maxProperties && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleAddProperty}
                          className="text-gray-600 hover:text-black hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Property
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {properties.map((property, index) => (
                        <div key={index} className="relative">
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
                                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          <AddressAutocomplete
                            value={property.address}
                            onChange={(value) => handlePropertyChange(index, 'address', value)}
                            placeholder="Enter property address..."
                            className="mb-3 h-12 border-gray-300 focus:border-black focus:ring-0"
                          />
                          
                          <Textarea
                            value={property.notes}
                            onChange={(e) => handlePropertyChange(index, 'notes', e.target.value)}
                            placeholder="Any specific notes about this property..."
                            className="min-h-[60px] border-gray-300 focus:border-black focus:ring-0 resize-none"
                          />
                        </div>
                      ))}
                    </div>

                    {!isPaidUser && (
                      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Tour Multiple Properties</p>
                            <p className="text-xs text-gray-600 mt-1">Upgrade to book up to 3 properties at once</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-400 hover:border-black">
                            Upgrade
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Notes
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or questions..."
                      className="min-h-[80px] border-gray-300 focus:border-black focus:ring-0 resize-none"
                    />
                  </div>
                </div>

                {/* Right Column - Scheduling */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Preferred Times
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Select up to {maxPreferredTimes} preferred date/time combinations
                    </p>

                    {/* Date Selection */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Available Dates</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {availableDays.map((day) => (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => handleDateSelection(day.date)}
                            disabled={selectedDates.length >= maxPreferredTimes && !selectedDates.includes(day.date)}
                            className={`p-3 rounded-xl border transition-all text-center ${
                              selectedDates.includes(day.date)
                                ? 'bg-black text-white border-black'
                                : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            } ${selectedDates.length >= maxPreferredTimes && !selectedDates.includes(day.date) 
                                ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="text-xs font-medium">{day.dayName}</div>
                            <div className="text-sm font-semibold">{day.dayNumber}</div>
                            <div className="text-xs opacity-75">{day.monthName}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection for Selected Dates */}
                    {selectedDates.map((dateString, index) => {
                      const day = availableDays.find(d => d.date === dateString);
                      const availableTimes = timeSlots.filter(slot => isTimeSlotAvailable(dateString, slot.value));
                      
                      return (
                        <div key={dateString} className="mb-8">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">
                            Times for {day?.dayName} {day?.monthName} {day?.dayNumber}
                            <span className="ml-2 text-xs text-gray-500">
                              (Choice #{index + 1})
                            </span>
                          </h4>
                          
                          {availableTimes.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                              {availableTimes.map((slot) => (
                                <button
                                  key={slot.value}
                                  type="button"
                                  onClick={() => handleTimeSelection(dateString, slot.value)}
                                  className={`p-3 rounded-xl border transition-all text-center ${
                                    selectedTimes[dateString] === slot.value
                                      ? 'bg-black text-white border-black'
                                      : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="text-sm font-medium">{slot.label}</div>
                                  {slot.recommended && (
                                    <div className="text-xs text-gray-500 mt-1">Recommended</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                              <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">
                                {!isPaidUser 
                                  ? "No same-day bookings available. Please select a future date."
                                  : "No times available within 2-hour advance window."
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {selectedDates.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select dates above to choose times</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {canSubmit ? 
                    `${selectedDates.length} time${selectedDates.length !== 1 ? 's' : ''} selected` : 
                    "Complete the form to continue"}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium"
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
