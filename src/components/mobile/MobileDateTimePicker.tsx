import React, { useState } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileDateTimePickerProps {
  selectedDate?: string;
  selectedTime?: string;
  onDateTimeChange: (date: string, time: string) => void;
  placeholder?: string;
  className?: string;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM"
];

const getNext7Days = () => {
  const today = startOfToday();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      display: format(date, 'EEE, MMM d'),
      dayName: format(date, 'EEEE'),
      isToday: i === 0,
      isTomorrow: i === 1
    };
  });
};

const MobileDateTimePicker: React.FC<MobileDateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onDateTimeChange,
  placeholder = "Select date & time",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState(selectedDate || '');

  const days = getNext7Days();

  const handleDateSelect = (date: string) => {
    setTempDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    onDateTimeChange(tempDate, time);
    setIsOpen(false);
    setStep('date');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('date');
    setTempDate(selectedDate || '');
  };

  const displayValue = selectedDate && selectedTime 
    ? `${format(new Date(selectedDate), 'MMM d')} at ${selectedTime}`
    : placeholder;

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full justify-start text-left font-normal h-12 px-4",
          !selectedDate && !selectedTime && "text-muted-foreground",
          className
        )}
      >
        <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
        <span className="flex-1 truncate">{displayValue}</span>
        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {step === 'date' ? 'Choose Date' : 'Choose Time'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose}
                  className="text-gray-500"
                >
                  Cancel
                </Button>
              </div>
              {step === 'time' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('date')}
                  className="mt-2 text-blue-600 p-0 h-auto font-medium"
                >
                  ← Back to dates
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {step === 'date' && (
                <div className="p-4 space-y-2">
                  {days.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => handleDateSelect(day.date)}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-colors flex items-center justify-between",
                        tempDate === day.date || selectedDate === day.date
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      )}
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {day.isToday ? 'Today' : day.isTomorrow ? 'Tomorrow' : day.dayName}
                        </div>
                        <div className="text-sm text-gray-600">{day.display}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {step === 'time' && (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={cn(
                          "p-4 rounded-xl text-center font-medium transition-colors",
                          selectedTime === time
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Safe Area */}
            <div className="h-safe-area-inset-bottom bg-white" />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileDateTimePicker;