
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Home, X, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
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

interface TimeSlot {
  date: string;
  time: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday?: boolean;
  isTomorrow?: boolean;
}

// Reduced time slots - only show core hours initially
const coreTimeSlots = [
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" }
];

const allTimeSlots = [
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "6:00 PM", label: "6:00 PM" }
];

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    days.push({
      date: dateString,
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
  const [propertyAddress, setPropertyAddress] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [showAllTimes, setShowAllTimes] = useState(false);

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

  const availableDays = useMemo(() => getNext7Days(), []);
  const timeSlotsToShow = showAllTimes ? allTimeSlots : coreTimeSlots;

  const handleClose = () => {
    resetForm();
    setPropertyAddress("");
    setSelectedTimeSlot(null);
    setNotes("");
    setShowAllTimes(false);
    onClose();
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    if (!date || !time) return false;
    
    try {
      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // For free users (including guests): No same-day bookings
      if (!isPaidUser) {
        return selectedDate.getTime() > todayDateOnly.getTime();
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
      
      const selectedDateTime = new Date(year, month - 1, day, adjustedHours, minutes);
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
      
      return selectedDateTime >= twoHoursFromNow;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return false;
    }
  };

  const handleTimeSlotSelection = (day: any, timeSlot: any) => {
    const newTimeSlot: TimeSlot = {
      date: day.date,
      time: timeSlot.value,
      dayName: day.dayName,
      dayNumber: day.dayNumber,
      monthName: day.monthName,
      isToday: day.isToday,
      isTomorrow: day.isTomorrow
    };
    
    setSelectedTimeSlot(newTimeSlot);
  };

  const handleSubmit = async () => {
    if (!propertyAddress.trim() || !selectedTimeSlot) {
      return;
    }

    // Convert to expected format for the existing handler
    const formData = {
      propertyAddress,
      preferredDate1: selectedTimeSlot.date,
      preferredTime1: selectedTimeSlot.time,
      preferredDate2: "",
      preferredTime2: "",
      preferredDate3: "",
      preferredTime3: "",
      notes,
      properties: [{ address: propertyAddress, notes: "" }],
      preferredOptions: [{ date: selectedTimeSlot.date, time: selectedTimeSlot.time }],
      selectedProperties: [propertyAddress]
    };

    await handleContinueToSubscriptions();
  };

  const canSubmit = propertyAddress.trim() && selectedTimeSlot;

  // Calculate completion progress
  const hasAddress = propertyAddress.trim();
  const hasTimeSlot = selectedTimeSlot !== null;
  const completionSteps = [hasAddress, hasTimeSlot];
  const completedSteps = completionSteps.filter(Boolean).length;
  const totalSteps = completionSteps.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white border-0 shadow-2xl p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col h-full">
            {/* Header */}
            <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0">
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
                      Choose your property and preferred time
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
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Progress: {completedSteps}/{totalSteps} steps completed</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable content */}
            <div className="px-8 flex-1 overflow-y-auto">
              {/* User Notice */}
              {isGuest && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Guest Booking</p>
                      <p className="text-xs text-gray-600 mt-1">
                        No same-day tours. Tomorrow and future dates are available.
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
                        No same-day tours. Tomorrow and future dates are available.
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

              <div className="space-y-8">
                {/* Step 1: Property Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Step 1: Property Address
                    {hasAddress && <span className="text-green-600 ml-2">✓</span>}
                  </h3>
                  
                  <AddressAutocomplete
                    value={propertyAddress}
                    onChange={setPropertyAddress}
                    placeholder="Enter property address..."
                    className="h-12 border-gray-300 focus:border-black focus:ring-0"
                  />
                </div>

                {/* Step 2: Choose Time */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Step 2: Choose Your Time
                    {hasTimeSlot && <span className="text-green-600 ml-2">✓</span>}
                  </h3>
                  
                  {selectedTimeSlot && (
                    <div className="mb-6 p-4 bg-black text-white rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {selectedTimeSlot.dayName}, {selectedTimeSlot.monthName} {selectedTimeSlot.dayNumber} at {selectedTimeSlot.time}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Available Time Slots Grid */}
                  <div className="space-y-6">
                    {availableDays.map((day) => {
                      const availableTimes = timeSlotsToShow.filter(slot => 
                        isTimeSlotAvailable(day.date, slot.value)
                      );
                      
                      if (availableTimes.length === 0) return null;

                      return (
                        <div key={day.date} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              {day.dayName}, {day.monthName} {day.dayNumber}
                            </h4>
                            {day.isToday && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Today
                              </span>
                            )}
                            {day.isTomorrow && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Tomorrow
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {availableTimes.map((timeSlot) => {
                              const isSelected = selectedTimeSlot?.date === day.date && 
                                               selectedTimeSlot?.time === timeSlot.value;
                              
                              return (
                                <button
                                  key={timeSlot.value}
                                  type="button"
                                  onClick={() => handleTimeSlotSelection(day, timeSlot)}
                                  className={`p-3 rounded-xl border-2 transition-all text-center font-medium ${
                                    isSelected
                                      ? 'bg-black text-white border-black'
                                      : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="text-sm">{timeSlot.label}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Show more/less times button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllTimes(!showAllTimes)}
                        className="text-sm"
                      >
                        {showAllTimes ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Show Fewer Times
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Show More Times
                          </>
                        )}
                      </Button>
                    </div>

                    {availableDays.every(day => 
                      timeSlotsToShow.filter(slot => isTimeSlotAvailable(day.date, slot.value)).length === 0
                    ) && (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Clock className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No Available Times</p>
                        <p className="text-sm">
                          {!isPaidUser 
                            ? "Please check back tomorrow for available time slots."
                            : "All slots are within the 2-hour advance notice window."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="pb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or questions..."
                    className="min-h-[80px] border-gray-300 focus:border-black focus:ring-0 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {canSubmit ? 
                    `Ready to schedule your tour` : 
                    `Complete both steps: ${!hasAddress ? 'Add property address' : ''}${!hasAddress && !hasTimeSlot ? ' and ' : ''}${!hasTimeSlot ? 'Select time slot' : ''}`}
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
