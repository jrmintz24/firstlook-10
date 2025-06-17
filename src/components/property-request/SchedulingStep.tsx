
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Preferred Tour Times
        </CardTitle>
        <CardDescription>
          Choose up to 3 time slots to increase your chances of quick scheduling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="space-y-2">
            <Label className="font-medium">Option {num}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`date${num}`} className="text-sm">Date</Label>
                <Input
                  id={`date${num}`}
                  type="date"
                  value={formData[`preferredDate${num}` as keyof PropertyRequestFormData]}
                  onChange={(e) => onInputChange(`preferredDate${num}`, e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor={`time${num}`} className="text-sm">Time</Label>
                <select
                  id={`time${num}`}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData[`preferredTime${num}` as keyof PropertyRequestFormData]}
                  onChange={(e) => onInputChange(`preferredTime${num}`, e.target.value)}
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
