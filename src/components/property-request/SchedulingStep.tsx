
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useAuth } from "@/contexts/AuthContext";

interface SchedulingStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const SchedulingStep = ({ formData, onInputChange, onNext, onBack }: SchedulingStepProps) => {
  const { user } = useAuth();
  
  // Calculate minimum date (tomorrow for non-logged users, today for logged users)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + (user ? 0 : 1));
    return tomorrow.toISOString().split('T')[0];
  };

  const isDateRestricted = (dateValue: string) => {
    if (!user && dateValue) {
      const selectedDate = new Date(dateValue);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selectedDate < tomorrow;
    }
    return false;
  };

  return (
    <Card className="border-0 shadow-lg">
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
      <CardContent className="space-y-6 p-6">
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

        {[1, 2, 3].map((num) => (
          <div key={num} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">{num}</span>
              </div>
              <Label className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Option {num} {num === 1 && "(Required)"}
              </Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
              <div className="space-y-2">
                <Label htmlFor={`date${num}`} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Date
                </Label>
                <Input
                  id={`date${num}`}
                  type="date"
                  value={formData[`preferredDate${num}` as keyof PropertyRequestFormData]}
                  onChange={(e) => onInputChange(`preferredDate${num}`, e.target.value)}
                  min={getMinDate()}
                  className={`rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${
                    isDateRestricted(formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string) 
                      ? 'border-red-300 bg-red-50' 
                      : ''
                  }`}
                />
                {isDateRestricted(formData[`preferredDate${num}` as keyof PropertyRequestFormData] as string) && (
                  <p className="text-xs text-red-600 mt-1">Please select a date at least 24 hours in advance</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`time${num}`} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Time
                </Label>
                <select
                  id={`time${num}`}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-sm"
                  value={formData[`preferredTime${num}` as keyof PropertyRequestFormData]}
                  onChange={(e) => onInputChange(`preferredTime${num}`, e.target.value)}
                >
                  <option value="" className="text-gray-500">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Back
          </Button>
          <Button 
            onClick={onNext} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulingStep;
