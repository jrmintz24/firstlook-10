
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface JourneyStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface JourneyProgressBarProps {
  currentStep: string;
  completedTours: number;
  activeShowings: number;
}

const JourneyProgressBar = ({ currentStep, completedTours, activeShowings }: JourneyProgressBarProps) => {
  const steps: JourneyStep[] = [
    {
      id: "account",
      label: "Account Created",
      completed: true,
      active: false
    },
    {
      id: "scheduled",
      label: "Tour Scheduled",
      completed: activeShowings > 0 || completedTours > 0,
      active: currentStep === "scheduled"
    },
    {
      id: "completed",
      label: "Tour Complete",
      completed: completedTours > 0,
      active: currentStep === "completed"
    },
    {
      id: "offer",
      label: "Offer Made",
      completed: false,
      active: currentStep === "offer"
    },
    {
      id: "closing",
      label: "Closing",
      completed: false,
      active: currentStep === "closing"
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Home Buying Journey</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">View All Steps</button>
      </div>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.active 
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-4 h-4" fill={step.active ? 'currentColor' : 'none'} />
                )}
              </div>
              <span className={`text-xs mt-2 text-center ${
                step.active ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-16 mx-4 ${
                steps[index + 1].completed || steps[index + 1].active 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default JourneyProgressBar;
