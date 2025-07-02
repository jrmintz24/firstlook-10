
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface SchedulingStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
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

const SchedulingStep = ({ formData, onInputChange, onNext, onBack }: SchedulingStepProps) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState(1);
  
  // Calculate minimum date (23 hours from now for non-logged users, today for logged users)
  const getMinDate = () => {
    const minDate = new Date();
    if (!user) {
      // Add 23 hours for non-authenticated users
      minDate.setHours(minDate.getHours() + 23);
    }
    return minDate.toISOString().split('T')[0];
  };

  const getMinDateTime = () => {
    if (!user) {
      const minDateTime = new Date();
      minDateTime.setHours(minDateTime.getHours() + 23);
      return minDateTime;
    }
    return new Date();
  };

  // Check if a time slot is available for the selected date
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
    
    const minDateTime = getMinDateTime();
    return selectedDateTime >= minDateTime;
  };

  // Get formatted date display
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

  const handleTimeSelect = (optionNum: number, time: string) => {
    const dateField = `preferredDate${optionNum}` as keyof PropertyRequestFormData;
    const selectedDate = formData[dateField] as string;
    
    if (selectedDate && !isTimeSlotAvailable(selectedDate, time)) {
      return; // Don't allow selection of unavailable times
    }
    
    onInputChange(`preferredTime${optionNum}`, time);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            Preferred Tour Times
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Choose up to 3 time slots to increase your chances of quick scheduling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {!user && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 text-sm">Guest Scheduling Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Tours must be scheduled at least 24 hours in advance for guest users. 
                    <span className="font-medium"> Sign up for immediate scheduling!</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {[1, 2, 3].map((num) => {
            const selectedDate = formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string;
            const selectedTime = formData[`preferredTime${num}` as keyof PropertyRequestFormData] as string;
            const isRequired = num === 1;
            
            return (
              <div key={num} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    num === 1 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                  }`}>
                    {num}
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-800 text-base">
                      Option {num} {isRequired && <span className="text-red-500">*</span>}
                    </Label>
                    {!isRequired && (
                      <p className="text-xs text-gray-500 mt-1">Optional - increases booking success</p>
                    )}
                  </div>
                </div>
                
                <div className="ml-13 space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      Select Date
                    </Label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          onInputChange(`preferredDate${num}`, e.target.value);
                          // Clear time if it's no longer available for the new date
                          if (selectedTime && !isTimeSlotAvailable(e.target.value, selectedTime)) {
                            onInputChange(`preferredTime${num}`, '');
                          }
                        }}
                        min={getMinDate()}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-sm font-medium"
                      />
                      {selectedDate && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {getDateDisplay(selectedDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Select Time
                      {selectedDate && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({timeSlots.filter(slot => isTimeSlotAvailable(selectedDate, slot.value)).length} available)
                        </span>
                      )}
                    </Label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => {
                        const isAvailable = !selectedDate || isTimeSlotAvailable(selectedDate, slot.value);
                        const isSelected = selectedTime === slot.value;
                        
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => isAvailable && handleTimeSelect(num, slot.value)}
                            disabled={!isAvailable}
                            className={`
                              relative p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
                              ${isSelected 
                                ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                                : isAvailable
                                  ? 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-102'
                                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                              }
                            `}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-semibold">{slot.label}</span>
                              {slot.popular && isAvailable && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  isSelected 
                                    ? 'bg-white bg-opacity-20 text-white' 
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  Popular
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <div className="absolute inset-0 rounded-xl border-2 border-white opacity-30"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedDate && timeSlots.filter(slot => isTimeSlotAvailable(selectedDate, slot.value)).length === 0 && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          No available times for this date. Please select a later date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={onNext} 
              disabled={!formData.preferredDate1 || !formData.preferredTime1}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingStep;
