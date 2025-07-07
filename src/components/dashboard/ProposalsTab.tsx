
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProposalCard from "./ProposalCard";
import EmptyStateCard from "./EmptyStateCard";
import { FileText } from "lucide-react";

interface ProposalsTabProps {
  agentId: string;
  title?: string;
}

interface ProposalWithBuyer {
  id: string;
  property_address: string;
  buyer_id: string;
  agent_id: string;
  created_at: string;
  consultation_requested: boolean;
  consultation_scheduled_at: string | null;
  questionnaire_completed_at: string | null;
  agent_summary_generated_at: string | null;
  offer_type: string | null;
  consultation_type: string | null;
  property_details: any;
  financing_details: any;
  contingencies: any;
  buyer_name?: string;
}

const ProposalsTab = ({ agentId, title = "Offer Proposals" }: ProposalsTabProps) => {
  const [proposals, setProposals] = useState<ProposalWithBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      // Get offer intents for this agent
      const { data: offerIntents, error: intentsError } = await supabase
        .from('offer_intents')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (intentsError) {
        throw intentsError;
      }

      if (!offerIntents || offerIntents.length === 0) {
        setProposals([]);
        return;
      }

      // Get buyer profiles separately
      const buyerIds = offerIntents.map(intent => intent.buyer_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', buyerIds);

      if (profilesError) {
        console.error('Error fetching buyer profiles:', profilesError);
      }

      // Combine the data
      const proposalsWithBuyers = offerIntents.map(intent => {
        const profile = profiles?.find(p => p.id === intent.buyer_id);
        return {
          ...intent,
          buyer_name: profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Buyer'
            : 'Unknown Buyer'
        };
      });

      setProposals(proposalsWithBuyers);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchProposals();
    }
  }, [agentId]);

  const handleViewQuestionnaire = (proposalId: string) => {
    // TODO: Implement questionnaire viewing modal
    console.log('View questionnaire for proposal:', proposalId);
    toast({
      title: "Coming Soon",
      description: "Questionnaire viewing will be available soon.",
    });
  };

  const handleScheduleConsultation = (proposalId: string) => {
    // TODO: Implement consultation scheduling
    console.log('Schedule consultation for proposal:', proposalId);
    toast({
      title: "Coming Soon",
      description: "Consultation scheduling will be available soon.",
    });
  };

  const handleUploadOffer = (proposalId: string) => {
    // TODO: Implement offer upload
    console.log('Upload offer for proposal:', proposalId);
    toast({
      title: "Coming Soon",
      description: "Offer upload will be available soon.",
    });
  };

  const handleUpdateStatus = (proposalId: string, status: string) => {
    // TODO: Implement status updates
    console.log('Update status for proposal:', proposalId, 'to:', status);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <EmptyStateCard
        title="No Offer Proposals"
        description="When buyers request help with offers, they'll appear here for you to manage."
        icon={FileText}
        buttonText=""
        onButtonClick={() => {}}
      />
    );
  }

  // Group proposals by status for better organization
  const groupedProposals = {
    new: proposals.filter(p => !p.questionnaire_completed_at),
    requested: proposals.filter(p => p.consultation_requested && !p.consultation_scheduled_at),
    scheduled: proposals.filter(p => p.consultation_scheduled_at && new Date(p.consultation_scheduled_at) > new Date()),
    inProgress: proposals.filter(p => p.consultation_scheduled_at && new Date(p.consultation_scheduled_at) <= new Date() && !p.agent_summary_generated_at),
    ready: proposals.filter(p => p.agent_summary_generated_at)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-500">
          {proposals.length} total proposal{proposals.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Status-based sections */}
      {Object.entries(groupedProposals).map(([status, statusProposals]) => {
        if (statusProposals.length === 0) return null;
        
        const statusLabels: Record<string, string> = {
          new: 'New Requests',
          requested: 'Consultation Requested',
          scheduled: 'Consultation Scheduled',
          inProgress: 'In Progress',
          ready: 'Ready for Review'
        };

        return (
          <div key={status} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
              {statusLabels[status]} ({statusProposals.length})
            </h3>
            <div className="space-y-4">
              {statusProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  buyerName={proposal.buyer_name}
                  onViewQuestionnaire={handleViewQuestionnaire}
                  onScheduleConsultation={handleScheduleConsultation}
                  onUploadOffer={handleUploadOffer}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProposalsTab;
