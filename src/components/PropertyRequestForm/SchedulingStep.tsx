
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SchedulingStepProps {
  formData: {
    preferredDates: (Date | null)[];
    preferredTimes: string[];
  };
  onDateChange: (index: number, date: Date | undefined) => void;
  onTimeChange: (index: number, time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const SchedulingStep = ({ formData, onDateChange, onTimeChange, onNext, onBack }: SchedulingStepProps) => {
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Preferred Showing Times
        </CardTitle>
        <CardDescription>
          Choose up to 3 preferred time slots to increase your chances of a quick match
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <Label className="font-medium text-blue-900">Option {index + 1}</Label>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor={`date${index}`} className="text-sm text-gray-700">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !formData.preferredDates[index] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.preferredDates[index] ? (
                        format(formData.preferredDates[index]!, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.preferredDates[index] || undefined}
                      onSelect={(date) => onDateChange(index, date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor={`time${index}`} className="text-sm text-gray-700">Preferred Time</Label>
                <select
                  id={`time${index}`}
                  className="w-full h-12 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.preferredTimes[index]}
                  onChange={(e) => onTimeChange(index, e.target.value)}
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
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulingStep;
