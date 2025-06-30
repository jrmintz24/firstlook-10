
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OfferProgressTrackerProps {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  stepTitles: string[];
}

const OfferProgressTracker = ({ 
  currentStep, 
  completedSteps, 
  totalSteps, 
  stepTitles 
}: OfferProgressTrackerProps) => {
  const progress = (completedSteps.length / totalSteps) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Offer Preparation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.includes(stepNumber);
              const isCurrent = currentStep === stepNumber;
              
              return (
                <div
                  key={stepNumber}
                  className={`flex items-center gap-2 p-2 rounded ${
                    isCurrent ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${
                    isCurrent ? 'font-medium text-blue-700' : 
                    isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {stepNumber}. {title}
                  </span>
                  {isCurrent && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferProgressTracker;
