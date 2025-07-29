import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  Calendar, 
  User, 
  FileText, 
  MessageSquare,
  TrendingUp,
  DollarSign,
  Home,
  Clock,
  CheckCircle,
  Circle,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface TimelineStep {
  id: string;
  title: string;
  icon: React.ElementType;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
}

interface ConsultationData {
  id: string;
  scheduled_at: string;
  meeting_link?: string;
  status: string;
}

interface AgentData {
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
}

interface DocumentData {
  id: string;
  document_type: string;
  file_name: string;
  created_at: string;
  storage_path: string;
}

interface OfferCardTimelineProps {
  offerIntentId: string;
  consultationRequested: boolean;
  agentId?: string;
  consultationScheduledAt?: string;
  questionnaireCompletedAt?: string;
  agentSummaryGeneratedAt?: string;
  onAction?: (action: string, data?: DocumentData | { agentId: string }) => void;
}

const OfferCardTimeline: React.FC<OfferCardTimelineProps> = ({
  offerIntentId,
  consultationRequested,
  agentId,
  consultationScheduledAt,
  questionnaireCompletedAt,
  agentSummaryGeneratedAt,
  onAction
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loadingData, setLoadingData] = useState<{ [key: string]: boolean }>({});

  // Define timeline steps based on current state
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [];

    // Step 1: Consultation Request
    steps.push({
      id: 'consultation_request',
      title: 'Consultation Request',
      icon: Calendar,
      status: consultationRequested ? 'completed' : 'active',
      timestamp: consultationRequested ? 'Completed' : undefined
    });

    // Step 2: Agent Assignment
    if (consultationRequested) {
      steps.push({
        id: 'agent_assignment',
        title: 'Agent Assignment',
        icon: User,
        status: agentId ? 'completed' : 'active',
        timestamp: agentId ? 'Assigned' : undefined
      });
    }

    // Step 3: Document Sharing (available after agent assignment)
    if (agentId) {
      steps.push({
        id: 'document_collection',
        title: 'Document Sharing',
        icon: FileText,
        status: documents.length > 0 ? 'active' : 'pending',
        timestamp: documents.length > 0 ? `${documents.length} documents` : 'Ready to share'
      });
    }

    // Step 4: Consultation Meeting
    if (agentId) {
      const consultationCompleted = consultationData?.status === 'completed';
      steps.push({
        id: 'consultation_meeting',
        title: 'Consultation Meeting',
        icon: MessageSquare,
        status: consultationCompleted ? 'completed' : consultationScheduledAt ? 'active' : 'pending',
        timestamp: consultationScheduledAt ? format(new Date(consultationScheduledAt), 'MMM d, h:mm a') : undefined
      });
    }

    // Step 5: Offer Preparation (available after consultation is completed)
    if (consultationData?.status === 'completed') {
      steps.push({
        id: 'offer_preparation',
        title: 'Offer Preparation',
        icon: TrendingUp,
        status: agentSummaryGeneratedAt ? 'completed' : 'active',
        timestamp: agentSummaryGeneratedAt ? 'Ready' : undefined
      });
    }

    // Step 6: Negotiation (if offer is ready)
    if (agentSummaryGeneratedAt) {
      steps.push({
        id: 'negotiation',
        title: 'Negotiation',
        icon: Home,
        status: 'pending',
        timestamp: undefined
      });
    }

    return steps;
  };

  const fetchConsultationData = useCallback(async () => {
    setLoadingData(prev => ({ ...prev, consultation_meeting: true }));
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('offer_intent_id', offerIntentId)
        .single();

      if (!error && data) {
        setConsultationData(data);
      }
    } catch (error) {
      console.error('Error fetching consultation:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, consultation_meeting: false }));
    }
  }, [offerIntentId]);

  const fetchAgentData = useCallback(async () => {
    if (!agentId) return;
    
    setLoadingData(prev => ({ ...prev, agent_assignment: true }));
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('full_name, email, phone, bio')
        .eq('id', agentId)
        .single();

      if (!error && data) {
        setAgentData(data);
      }
    } catch (error) {
      console.error('Error fetching agent:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, agent_assignment: false }));
    }
  }, [agentId]);

  const fetchDocuments = useCallback(async () => {
    setLoadingData(prev => ({ ...prev, document_collection: true }));
    try {
      const { data, error } = await supabase
        .from('offer_documents')
        .select('id, document_type, file_name, created_at, storage_path')
        .eq('offer_intent_id', offerIntentId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingData(prev => ({ ...prev, document_collection: false }));
    }
  }, [offerIntentId]);

  // Fetch expanded data when step is expanded
  useEffect(() => {
    if (expandedStep === 'consultation_meeting' && !consultationData && consultationScheduledAt) {
      fetchConsultationData();
    }
    if (expandedStep === 'agent_assignment' && !agentData && agentId) {
      fetchAgentData();
    }
    if (expandedStep === 'document_collection' && documents.length === 0) {
      fetchDocuments();
    }
  }, [expandedStep, consultationData, consultationScheduledAt, agentData, agentId, documents.length, fetchConsultationData, fetchAgentData, fetchDocuments]);

  // Also fetch consultation data to check if it's completed
  useEffect(() => {
    if (consultationScheduledAt && !consultationData) {
      fetchConsultationData();
    }
  }, [consultationScheduledAt, consultationData, fetchConsultationData]);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const renderExpandedContent = (step: TimelineStep) => {
    const isLoading = loadingData[step.id];

    if (isLoading) {
      return (
        <div className="p-3 bg-gray-50 rounded-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    }

    switch (step.id) {
      case 'consultation_request':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            <p className="text-sm text-gray-600">
              Your consultation request has been submitted. An agent will be assigned shortly.
            </p>
            {!consultationRequested && onAction && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAction('request_consultation')}
                className="text-xs"
              >
                Request Consultation
              </Button>
            )}
          </div>
        );

      case 'agent_assignment':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            {agentData ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{agentData.full_name}</p>
                    <p className="text-xs text-gray-600">{agentData.email}</p>
                    {agentData.phone && (
                      <p className="text-xs text-gray-600">{agentData.phone}</p>
                    )}
                  </div>
                </div>
                {agentData.bio && (
                  <p className="text-xs text-gray-600 line-clamp-2">{agentData.bio}</p>
                )}
                {onAction && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAction('contact_agent', { agentId })}
                    className="text-xs w-full"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Agent
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                An agent will be assigned to your offer soon.
              </p>
            )}
          </div>
        );

      case 'document_collection':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            <p className="text-sm text-gray-600 mb-2">
              Share documents with your agent for offer preparation and due diligence.
            </p>
            {documents.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {documents.slice(0, 4).map((doc) => (
                    <div 
                      key={doc.id} 
                      className="p-2 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={() => onAction?.('view_document', doc)}
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <p className="text-xs truncate flex-1">{doc.file_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {documents.length > 4 && (
                  <p className="text-xs text-center text-gray-500">
                    +{documents.length - 4} more documents
                  </p>
                )}
                {onAction && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAction('upload_document')}
                    className="text-xs w-full"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Share More Documents
                  </Button>
                )}
              </>
            ) : (
              <>
                {onAction && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAction('upload_document')}
                    className="text-xs w-full"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Share Documents
                  </Button>
                )}
              </>
            )}
          </div>
        );

      case 'consultation_meeting':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            {consultationData ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {format(new Date(consultationData.scheduled_at), 'EEEE, MMMM d')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(consultationData.scheduled_at), 'h:mm a')}
                  </p>
                </div>
                {consultationData.meeting_link && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(consultationData.meeting_link, '_blank')}
                    className="text-xs w-full"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Join Meeting
                  </Button>
                )}
                {consultationData.status === 'completed' && (
                  <Badge variant="secondary" className="text-xs">
                    Meeting Completed
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                Your consultation will be scheduled once all documents are collected.
              </p>
            )}
          </div>
        );

      case 'offer_preparation':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            <p className="text-sm text-gray-600">
              Your agent is preparing a competitive offer based on your consultation and market analysis.
            </p>
            {agentSummaryGeneratedAt && (
              <Badge variant="secondary" className="text-xs">
                Offer Ready for Review
              </Badge>
            )}
          </div>
        );

      case 'negotiation':
        return (
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            <p className="text-sm text-gray-600">
              Once your offer is submitted, your agent will handle negotiations and guide you through to closing.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = getTimelineSteps();

  return (
    <div className="mt-3 space-y-2">
      {steps.map((step, index) => {
        const isExpanded = expandedStep === step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative">
            <div 
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                "hover:bg-gray-50",
                isExpanded && "bg-gray-50"
              )}
              onClick={() => toggleStep(step.id)}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(step.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <div className="flex items-center gap-2">
                    {step.timestamp && (
                      <span className="text-xs text-gray-500">{step.timestamp}</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="ml-7 mt-1">
                {renderExpandedContent(step)}
              </div>
            )}

            {/* Connector Line */}
            {!isLast && (
              <div className="absolute left-2 top-8 w-0.5 h-4 bg-gray-200"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OfferCardTimeline;