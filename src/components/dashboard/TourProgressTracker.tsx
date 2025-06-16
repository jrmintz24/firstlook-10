
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, User, Calendar } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: React.ReactNode;
}

interface TourProgressTrackerProps {
  showing: any;
  userType: 'buyer' | 'agent';
}

const TourProgressTracker = ({ showing, userType }: TourProgressTrackerProps) => {
  const getProgressSteps = (): ProgressStep[] => {
    const status = showing.status;
    
    const steps: ProgressStep[] = [
      {
        id: 'requested',
        label: 'Tour Requested',
        description: 'Tour request submitted',
        completed: true,
        current: status === 'pending',
        icon: <Calendar className="h-4 w-4" />
      },
      {
        id: 'assigned',
        label: 'Agent Assigned',
        description: showing.assigned_agent_name ? `${showing.assigned_agent_name} assigned` : 'Waiting for agent',
        completed: !!showing.assigned_agent_name,
        current: status === 'agent_assigned' || (status === 'pending' && !showing.assigned_agent_name),
        icon: <User className="h-4 w-4" />
      },
      {
        id: 'confirmed',
        label: 'Tour Confirmed',
        description: 'Ready for tour day',
        completed: ['confirmed', 'scheduled', 'completed'].includes(status),
        current: status === 'confirmed',
        icon: <CheckCircle className="h-4 w-4" />
      },
      {
        id: 'scheduled',
        label: 'Tour Day',
        description: showing.preferred_date ? new Date(showing.preferred_date).toLocaleDateString() : 'Date TBD',
        completed: status === 'completed',
        current: status === 'scheduled',
        icon: <Clock className="h-4 w-4" />
      },
      {
        id: 'completed',
        label: 'Completed',
        description: 'Tour finished successfully',
        completed: status === 'completed',
        current: false,
        icon: <CheckCircle className="h-4 w-4" />
      }
    ];

    return steps;
  };

  const steps = getProgressSteps();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800">Tour Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-green-100 text-green-600' 
                  : step.current 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  step.completed 
                    ? 'text-green-800' 
                    : step.current 
                      ? 'text-blue-800' 
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {step.description}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`absolute left-4 mt-8 w-0.5 h-6 ${
                  step.completed ? 'bg-green-200' : 'bg-gray-200'
                }`} style={{ marginLeft: '15px' }} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TourProgressTracker;
