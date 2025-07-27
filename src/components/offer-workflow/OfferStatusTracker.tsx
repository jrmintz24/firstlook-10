import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  FileText, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  DollarSign,
  Home
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OfferStatusTrackerProps {
  offerIntentId: string;
  buyerId: string;
  agentId?: string;
  onStatusUpdate?: () => void;
}

interface OfferStatus {
  stage: string;
  progress: number;
  nextStep?: string;
  completedSteps: string[];
  pendingSteps: string[];
  blockedSteps: string[];
}

interface StatusStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  estimatedTime?: string;
  dependencies?: string[];
}

const OfferStatusTracker: React.FC<OfferStatusTrackerProps> = ({
  offerIntentId,
  buyerId,
  agentId,
  onStatusUpdate
}) => {
  const [offerData, setOfferData] = useState<any>(null);
  const [consultationData, setConsultationData] = useState<any>(null);
  const [documentCount, setDocumentCount] = useState(0);
  const [requiredDocCount, setRequiredDocCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferStatus();
  }, [offerIntentId]);

  // Expose refresh function to parent component
  useEffect(() => {
    if (onStatusUpdate) {
      // This component can be refreshed by calling fetchOfferStatus
    }
  }, [onStatusUpdate]);

  const fetchOfferStatus = async () => {
    try {
      // Fetch offer intent data
      const { data: offerData, error: offerError } = await supabase
        .from('offer_intents')
        .select('*')
        .eq('id', offerIntentId)
        .single();

      if (offerError) throw offerError;
      setOfferData(offerData);

      // Fetch consultation booking data
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('offer_intent_id', offerIntentId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!consultationError && consultationData?.length > 0) {
        setConsultationData(consultationData[0]);
      }

      // Fetch document counts
      const { data: docData, error: docError } = await supabase
        .from('offer_documents')
        .select('id, is_required')
        .eq('offer_intent_id', offerIntentId);

      if (!docError) {
        setDocumentCount(docData?.length || 0);
        setRequiredDocCount(docData?.filter(doc => doc.is_required).length || 0);
      }

    } catch (error) {
      console.error('Error fetching offer status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOfferSteps = (): StatusStep[] => {
    const hasConsultation = !!consultationData;
    const hasDocuments = documentCount > 0;
    const hasRequiredDocs = requiredDocCount >= 2; // Assuming 2+ required docs needed
    const consultationCompleted = consultationData?.status === 'completed';
    const agentAssigned = !!agentId;

    return [
      {
        id: 'consultation_request',
        title: 'Consultation Requested',
        description: 'Initial consultation has been requested with an agent',
        icon: Calendar,
        status: hasConsultation ? 'completed' : 'pending',
        estimatedTime: '1 day'
      },
      {
        id: 'agent_assignment',
        title: 'Agent Assignment',
        description: 'A qualified agent has been assigned to your offer',
        icon: User,
        status: agentAssigned ? 'completed' : hasConsultation ? 'in_progress' : 'pending',
        estimatedTime: '1-2 days',
        dependencies: ['consultation_request']
      },
      {
        id: 'document_collection',
        title: 'Document Collection',
        description: 'Required documents are uploaded and verified',
        icon: FileText,
        status: hasRequiredDocs ? 'completed' : hasDocuments ? 'in_progress' : 'pending',
        estimatedTime: '2-3 days',
        dependencies: ['agent_assignment']
      },
      {
        id: 'consultation_completed',
        title: 'Consultation Meeting',
        description: 'Strategy meeting with your agent completed',
        icon: MessageSquare,
        status: consultationCompleted ? 'completed' : (agentAssigned && hasDocuments) ? 'in_progress' : 'pending',
        estimatedTime: '30-60 minutes',
        dependencies: ['agent_assignment', 'document_collection']
      },
      {
        id: 'offer_preparation',
        title: 'Offer Preparation',
        description: 'Agent prepares competitive offer based on consultation',
        icon: TrendingUp,
        status: consultationCompleted ? 'in_progress' : 'pending',
        estimatedTime: '1-2 hours',
        dependencies: ['consultation_completed']
      },
      {
        id: 'offer_submission',
        title: 'Offer Submission',
        description: 'Final offer is submitted to listing agent',
        icon: DollarSign,
        status: 'pending',
        estimatedTime: '30 minutes',
        dependencies: ['offer_preparation']
      },
      {
        id: 'negotiation',
        title: 'Negotiation & Closing',
        description: 'Navigate negotiations and move toward closing',
        icon: Home,
        status: 'pending',
        estimatedTime: '2-4 weeks',
        dependencies: ['offer_submission']
      }
    ];
  };

  const getOverallProgress = (steps: StatusStep[]) => {
    const completedCount = steps.filter(step => step.status === 'completed').length;
    return Math.round((completedCount / steps.length) * 100);
  };

  const getCurrentStage = (steps: StatusStep[]) => {
    const inProgressStep = steps.find(step => step.status === 'in_progress');
    if (inProgressStep) return inProgressStep.title;
    
    const lastCompletedIndex = steps.map(step => step.status).lastIndexOf('completed');
    if (lastCompletedIndex >= 0 && lastCompletedIndex < steps.length - 1) {
      return steps[lastCompletedIndex + 1].title;
    }
    
    return steps.find(step => step.status === 'pending')?.title || 'Getting Started';
  };

  const getStatusIcon = (status: StatusStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: StatusStep['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  const steps = getOfferSteps();
  const progress = getOverallProgress(steps);
  const currentStage = getCurrentStage(steps);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Offer Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Current Stage: {currentStage}</span>
              <span className="text-gray-500">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{steps.filter(s => s.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{steps.filter(s => s.status === 'in_progress').length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{steps.filter(s => s.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Details */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline & Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                          {step.status.replace('_', ' ')}
                        </Badge>
                        {step.estimatedTime && step.status !== 'completed' && (
                          <span className="text-xs text-gray-500">Est. {step.estimatedTime}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      {/* Action Button for In Progress Items */}
                      {step.status === 'in_progress' && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <div className="absolute left-2.5 top-7 w-0.5 h-6 bg-gray-200"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{documentCount}</div>
                <div className="text-sm text-gray-600">Documents Uploaded</div>
                {requiredDocCount > 0 && (
                  <div className="text-xs text-green-600">{requiredDocCount} required</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-lg font-semibold">
                  {consultationData ? 'Scheduled' : 'Pending'}
                </div>
                <div className="text-sm text-gray-600">Consultation</div>
                {consultationData?.scheduled_at && (
                  <div className="text-xs text-blue-600">
                    {new Date(consultationData.scheduled_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferStatusTracker;