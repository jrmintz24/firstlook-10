import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Home, X, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { usePropertyRequest } from "@/hooks/usePropertyRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useDeviceInfo } from "@/hooks/use-mobile";
import HybridAddressInput from "@/components/HybridAddressInput";
import { useIDXPropertyExtractor } from "@/hooks/useIDXPropertyExtractor";
import QuickSignInModal from "@/components/property-request/QuickSignInModal";
import FreeShowingLimitModal from "@/components/showing-limits/FreeShowingLimitModal";
import MobileDateTimePicker from "@/components/mobile/MobileDateTimePicker";
import { cn } from "@/lib/utils";

interface ModernTourSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  skipNavigation?: boolean;
  initialAddress?: string;
  propertyId?: string;
  propertyDetails?: any;
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

// 30-minute interval time slots
const coreTimeSlots = [
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "9:30 AM", label: "9:30 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "10:30 AM", label: "10:30 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "11:30 AM", label: "11:30 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "12:30 PM", label: "12:30 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "1:30 PM", label: "1:30 PM" }
];

const allTimeSlots = [
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "9:30 AM", label: "9:30 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "10:30 AM", label: "10:30 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "11:30 AM", label: "11:30 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "12:30 PM", label: "12:30 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "1:30 PM", label: "1:30 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "2:30 PM", label: "2:30 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "3:30 PM", label: "3:30 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "4:30 PM", label: "4:30 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "5:30 PM", label: "5:30 PM" },
  { value: "6:00 PM", label: "6:00 PM" },
  { value: "6:30 PM", label: "6:30 PM" }
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

type ModalFlow = 'scheduling' | 'auth' | 'limit' | 'closed';

const ModernTourSchedulingModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  skipNavigation = false,
  initialAddress = "",
  propertyId = "",
  propertyDetails = null
}: ModernTourSchedulingModalProps) => {
  const { user } = useAuth();
  const { eligibility } = useShowingEligibility();
  const { isMobile, isTablet } = useDeviceInfo();
  const location = useLocation();
  const { listingId } = useParams<{ listingId: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  // Check if user is on the correct page for scheduling - same logic as PropertyToolbar
  const isPropertyDetailPage = !!listingId || !!queryId;

  // Use the IDX property extractor hook to get property data from current page
  const { propertyData: extractedData, isLoading: isExtractingData } = useIDXPropertyExtractor();
  
  const [propertyAddress, setPropertyAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [showAllTimes, setShowAllTimes] = useState(false);

  // Use extracted data as the primary property data source
  const propertyData = extractedData;

  const {
    isSubmitting,
    modalFlow,
    setModalFlow,
    handleContinueToSubscriptions,
    handleCancelPendingShowing,
    pendingShowingAddress,
    resetForm
  } = usePropertyRequest(onClose, onSuccess, skipNavigation);

  // Sync modal flow with isOpen prop - ensure modal flow resets when opened fresh
  useEffect(() => {
    console.log('Modal isOpen changed:', isOpen, 'Current modalFlow:', modalFlow);
    if (isOpen && modalFlow === 'closed') {
      console.log('Resetting modal flow to scheduling');
      setModalFlow('scheduling');
    } else if (!isOpen && modalFlow !== 'closed') {
      console.log('Setting modal flow to closed');
      setModalFlow('closed');
    }
  }, [isOpen, modalFlow, setModalFlow]);

  // Initialize form state when modal opens fresh (only once per open)
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (isOpen && modalFlow === 'scheduling' && !hasInitialized) {
      console.log('[ModernTourSchedulingModal] Initializing modal');
      console.log('[ModernTourSchedulingModal] extractedData:', extractedData);
      console.log('[ModernTourSchedulingModal] isExtractingData:', isExtractingData);
      console.log('[ModernTourSchedulingModal] initialAddress:', initialAddress);
      
      // Set address based on priority: extracted data > initial address > propertyId fallback
      // Handle case where extractedData.address might be "Address not found"
      const extractedAddress = extractedData?.address && extractedData.address !== "Address not found" 
        ? extractedData.address 
        : "";
      const addressToUse = extractedAddress || initialAddress || "";
      console.log('[ModernTourSchedulingModal] Using address:', addressToUse);
      
      setPropertyAddress(addressToUse);
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
      setShowAllTimes(false);
      setHasInitialized(true);
    }
  }, [isOpen, modalFlow, extractedData, initialAddress, hasInitialized]);

  // Update address when property data becomes available (without resetting other fields)
  useEffect(() => {
    if (isOpen && modalFlow === 'scheduling' && hasInitialized && extractedData?.address && extractedData.address !== "Address not found" && !propertyAddress) {
      console.log('[ModernTourSchedulingModal] Updating address from extracted data:', extractedData.address);
      setPropertyAddress(extractedData.address);
    }
  }, [extractedData, isOpen, modalFlow, hasInitialized, propertyAddress]);

  // Determine user capabilities
  const isGuest = !user;
  const isPaidUser = eligibility?.eligible && eligibility.reason === 'subscribed';

  const availableDays = useMemo(() => getNext7Days(), []);
  const timeSlotsToShow = showAllTimes ? allTimeSlots : coreTimeSlots;

  const handleClose = () => {
    console.log('Modal handleClose called');
    resetForm();
    setPropertyAddress("");
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setShowAllTimes(false);
    setHasInitialized(false);
    setModalFlow('closed');
    onClose();
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    if (!date || !time) return false;
    
    try {
      const [year, month, day] = date.split('-').map(Number);
      const selectedDateObj = new Date(year, month - 1, day);
      
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // For free users (including guests): No same-day bookings
      if (!isPaidUser) {
        return selectedDateObj.getTime() > todayDateOnly.getTime();
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

  const handleDateSelection = (dayDate: string) => {
    setSelectedDate(dayDate);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeSelection = (timeValue: string) => {
    setSelectedTime(timeValue);
  };

  const handleMobileDateTimeChange = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    console.log('DEBUG: handleSubmit called with:', {
      propertyAddress: propertyAddress.trim(),
      selectedDate,
      selectedTime,
      canSubmit: propertyAddress.trim() && selectedDate && selectedTime
    });

    if (!propertyAddress.trim() || !selectedDate || !selectedTime) {
      console.log('DEBUG: Validation failed - missing required fields');
      return;
    }

    console.log('DEBUG: Creating form data with address:', propertyAddress);
    console.log('DEBUG: Using extracted MLS ID:', extractedData?.mlsId);
    console.log('DEBUG: Full extracted data:', extractedData);
    console.log('DEBUG: Using propertyDetails from props:', propertyDetails);

    // Determine the best data source - prefer propertyDetails from props over extractedData
    const bestPropertyData = propertyDetails || extractedData;
    const idxId = propertyId || bestPropertyData?.listingId || bestPropertyData?.mlsId || '';

    // Create the form data object with current values including property details
    const currentFormData = {
      properties: [{ 
        address: propertyAddress.trim(), 
        notes: notes,
        mlsId: bestPropertyData?.mlsId || '',
        idxId: idxId,
        source: (bestPropertyData ? 'idx' : 'manual') as 'idx' | 'manual',
        // Include the complete property details for saving to backend
        propertyDetails: bestPropertyData
      }],
      preferredOptions: [{ date: selectedDate, time: selectedTime }],
      notes: notes,
      propertyAddress: propertyAddress.trim(),
      propertyId: idxId,
      mlsId: bestPropertyData?.mlsId || '',
      idxId: idxId,
      propertyDetails: bestPropertyData,
      preferredDate1: selectedDate,
      preferredTime1: selectedTime,
      preferredDate2: '',
      preferredTime2: '',
      preferredDate3: '',
      preferredTime3: '',
      selectedProperties: [propertyAddress.trim()]
    };

    console.log('DEBUG: Final form data being submitted:', currentFormData);

    // Pass the current form data directly to the submission handler
    await handleContinueToSubscriptions(currentFormData);
  };

  const handleAuthSuccess = async () => {
    console.log('Auth success - continuing with submission');
    // After successful auth, continue with the submission
    await handleContinueToSubscriptions();
  };

  const canSubmit = propertyAddress.trim() && selectedDate && selectedTime;

  // Calculate completion progress
  const hasAddress = propertyAddress.trim();
  const hasDate = selectedDate !== "";
  const hasTime = selectedTime !== "";
  const completionSteps = isMobile 
    ? [hasAddress, hasDate && hasTime] // On mobile, date and time are combined
    : [hasAddress, hasDate, hasTime];   // On desktop, they're separate steps
  const completedSteps = completionSteps.filter(Boolean).length;
  const totalSteps = completionSteps.length;

  // Get available times for selected date
  const availableTimesForSelectedDate = selectedDate 
    ? timeSlotsToShow.filter(slot => isTimeSlotAvailable(selectedDate, slot.value))
    : [];

  const selectedDay = availableDays.find(day => day.date === selectedDate);

  // Only show scheduling modal when flow is 'scheduling' and isOpen is true
  const showSchedulingModal = isOpen && modalFlow === 'scheduling';

  console.log('Modal render:', { isOpen, modalFlow, showSchedulingModal });

  return (
    <>
      <Dialog open={showSchedulingModal} onOpenChange={handleClose}>
        <DialogContent className={cn(
          "bg-white border-0 shadow-2xl p-0 flex flex-col",
          isMobile 
            ? "fixed bottom-0 left-0 right-0 top-auto max-h-[90vh] rounded-t-3xl rounded-b-none m-0 w-full sm:max-w-none" 
            : "sm:max-w-4xl max-h-[80vh]"
        )}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <DialogHeader className={cn(
              "flex-shrink-0",
              isMobile ? "px-6 pt-6 pb-4" : "px-8 pt-8 pb-6"
            )}>
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
            <div className={cn(
              "flex-1 overflow-y-auto",
              isMobile 
                ? "px-6 max-h-[calc(90vh-200px)] scroll-container-mobile" 
                : "px-8 max-h-[calc(80vh-240px)]"
            )}>
              {/* Wrong Page Notice */}
              {!isPropertyDetailPage && (
                <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Cannot Schedule From This Page</p>
                      <p className="text-xs text-red-600 mt-1">
                        Please click on a specific property from the search results to schedule a tour.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

              <div className="space-y-8 pb-8">
                {/* Step 1: Property Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Step 1: Property Address
                    {hasAddress && <span className="text-green-600 ml-2">✓</span>}
                  </h3>
                  
                  {/* Debug Info */}
                  {isExtractingData && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <p className="text-blue-800">🔍 Extracting property data from page...</p>
                    </div>
                  )}
                  
                  {propertyData && propertyData.address === "Address not found" && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                      <p className="text-yellow-800">⚠️ Could not auto-detect address. Please enter manually.</p>
                    </div>
                  )}
                  
                  <HybridAddressInput
                    value={propertyAddress}
                    onChange={setPropertyAddress}
                    placeholder="Enter property address..."
                    className="h-12 border-gray-300 focus:border-black focus:ring-0"
                  />
                </div>

                {/* Step 2: Choose Date & Time */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {isMobile ? 'Step 2: Choose Date & Time' : 'Step 2: Choose Your Date'}
                    {isMobile ? (hasDate && hasTime) && <span className="text-green-600 ml-2">✓</span> : hasDate && <span className="text-green-600 ml-2">✓</span>}
                  </h3>
                  
                  {isMobile ? (
                    /* Mobile: Use single combined date/time picker */
                    <MobileDateTimePicker
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onDateTimeChange={handleMobileDateTimeChange}
                      placeholder="Select date & time for your tour"
                    />
                  ) : (
                    /* Desktop: Use horizontal date picker */
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {availableDays.map((day) => {
                        const isSelected = selectedDate === day.date;
                        const hasAvailableTimes = timeSlotsToShow.some(slot => 
                          isTimeSlotAvailable(day.date, slot.value)
                        );
                        
                        return (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => hasAvailableTimes && handleDateSelection(day.date)}
                            disabled={!hasAvailableTimes}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                              isSelected
                                ? 'bg-black text-white border-black'
                                : hasAvailableTimes
                                ? 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="text-xs font-medium">{day.dayName}</div>
                            <div className="text-lg font-bold">{day.dayNumber}</div>
                            <div className="text-xs">{day.monthName}</div>
                            {day.isToday && (
                              <div className="text-xs mt-1 text-blue-600 font-medium">Today</div>
                            )}
                            {day.isTomorrow && (
                              <div className="text-xs mt-1 text-green-600 font-medium">Tomorrow</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Step 3: Choose Time (only show if date is selected and not mobile) */}
                {selectedDate && !isMobile && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Step 3: Choose Your Time
                      {hasTime && <span className="text-green-600 ml-2">✓</span>}
                    </h3>
                    
                    {selectedDay && (
                      <p className="text-sm text-gray-600 mb-4">
                        Available times for {selectedDay.dayName}, {selectedDay.monthName} {selectedDay.dayNumber}:
                      </p>
                    )}

                    {availableTimesForSelectedDate.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {availableTimesForSelectedDate.map((timeSlot) => {
                            const isSelected = selectedTime === timeSlot.value;
                            
                            return (
                              <button
                                key={timeSlot.value}
                                type="button"
                                onClick={() => handleTimeSelection(timeSlot.value)}
                                className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
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

                        {/* Show more/less times button */}
                        <div className="flex justify-center mb-6">
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
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-6">
                        <Clock className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No Available Times</p>
                        <p className="text-sm">
                          {!isPaidUser 
                            ? "Please select a future date for available time slots."
                            : "All slots are within the 2-hour advance notice window."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Notes */}
                <div>
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
            <div className={cn(
              "border-t border-gray-100 bg-white flex-shrink-0",
              isMobile ? "px-6 py-4" : "px-8 py-6"
            )}>
              <div className={cn(
                isMobile ? "space-y-3" : "flex items-center justify-between"
              )}>
                {!isMobile && (
                  <div className="text-sm text-gray-500">
                    {canSubmit ? 
                      `Ready to schedule your tour` : 
                      `Complete all steps: ${!hasAddress ? 'Add address' : ''}${!hasAddress && (!hasDate || !hasTime) ? ', ' : ''}${!hasDate ? 'Select date' : ''}${!hasDate && !hasTime ? ', ' : ''}${!hasTime && hasDate ? 'Select time' : ''}`}
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting || !isPropertyDetailPage}
                  className={cn(
                    "bg-black hover:bg-gray-800 text-white rounded-xl font-medium disabled:opacity-50",
                    isMobile ? "w-full h-12 text-base" : "px-8 py-3"
                  )}
                >
                  {!isPropertyDetailPage ? 'Select a Property First' : isSubmitting ? "Scheduling..." : "Schedule Tour"}
                  {isPropertyDetailPage && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
              
              {/* Mobile safe area */}
              {isMobile && (
                <div className="h-safe-area-inset-bottom" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuickSignInModal
        isOpen={modalFlow === 'auth'}
        onClose={() => setModalFlow('closed')}
        onSuccess={handleAuthSuccess}
      />

      <FreeShowingLimitModal
        isOpen={modalFlow === 'limit'}
        onClose={() => setModalFlow('closed')}
        onCancelPendingShowing={handleCancelPendingShowing}
        pendingShowingAddress={pendingShowingAddress}
      />
    </>
  );
};

export default ModernTourSchedulingModal;
