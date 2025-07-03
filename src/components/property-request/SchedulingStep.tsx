
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useAuth } from "@/contexts/AuthContext";

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
  
  // Calculate minimum date (23 hours from now for non-logged users, today for logged users)
  const getMinDate = () => {
    const minDate = new Date();
    if (!user) {
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
      return;
    }
    
    onInputChange(`preferredTime${optionNum}`, time);
  };

  return (
    <div className="space-y-6 max-h-[65vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Schedule Your Tours</h2>
        <p className="text-sm text-gray-600">Choose up to 3 preferred times to maximize scheduling success</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Tours must be scheduled 24+ hours in advance for guests. 
              <span className="font-medium"> Sign up for same-day booking!</span>
            </p>
          </div>
        </div>
      )}

      {/* Time Options - More Compact */}
      <div className="space-y-4">
        {[1, 2, 3].map((num) => {
          const selectedDate = formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string;
          const selectedTime = formData[`preferredTime${num}` as keyof PropertyRequestFormData] as string;
          const isRequired = num === 1;
          
          return (
            <Card key={num} className={`border ${selectedDate || selectedTime ? 'border-black' : 'border-gray-200'} transition-colors`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    num === 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {num}
                  </div>
                  <span className="text-sm font-medium">
                    Option {num} {isRequired && <span className="text-red-500">*</span>}
                  </span>
                </div>
                
                {/* Date and Time in Single Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Date</Label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        onInputChange(`preferredDate${num}`, e.target.value);
                        if (selectedTime && !isTimeSlotAvailable(e.target.value, selectedTime)) {
                          onInputChange(`preferredTime${num}`, '');
                        }
                      }}
                      min={getMinDate()}
                      className="w-full h-9 px-3 text-sm rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                    {selectedDate && (
                      <p className="text-xs text-gray-500 mt-1">{getDateDisplay(selectedDate)}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Time</Label>
                    <select
                      value={selectedTime}
                      onChange={(e) => handleTimeSelect(num, e.target.value)}
                      className="w-full h-9 px-3 text-sm rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white"
                    >
                      <option value="">Select time</option>
                      {timeSlots
                        .filter(slot => !selectedDate || isTimeSlotAvailable(selectedDate, slot.value))
                        .map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label} {slot.popular ? '(Popular)' : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                
                {selectedDate && timeSlots.filter(slot => isTimeSlotAvailable(selectedDate, slot.value)).length === 0 && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      No available times for this date. Please select a later date.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!formData.preferredDate1 || !formData.preferredTime1}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-medium disabled:bg-gray-300"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SchedulingStep;
