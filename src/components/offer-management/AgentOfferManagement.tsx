import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, User, MessageCircle, Upload, FolderOpen, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferDetailModal from './OfferDetailModal';

interface OfferIntent {
  id: string;
  property_address: string;
  offer_type: string;
  created_at: string;
  buyer_id: string;
  agent_id?: string;
  consultation_scheduled_at?: string;
  questionnaire_completed_at?: string;
  agent_summary_generated_at?: string;
  consultation_requested: boolean;
  document_count?: number;
  required_documents_count?: number;
}

interface AgentOfferManagementProps {
  agentId: string;
}

const AgentOfferManagement = ({ agentId }: AgentOfferManagementProps) => {
  const [offers, setOffers] = useState<OfferIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferIntent | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentOffers();
  }, [agentId]);

  const fetchAgentOffers = async () => {
    try {
      // Fetch offers assigned to this agent
      const { data: offersData, error: offersError } = await supabase
        .from('offer_intents')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      // Fetch document counts for each offer
      const offersWithDocCounts = await Promise.all(
        (offersData || []).map(async (offer) => {
          const { data: docData, error: docError } = await supabase
            .from('offer_documents')
            .select('id, is_required')
            .eq('offer_intent_id', offer.id);

          if (docError) {
            console.warn('Error fetching document count for offer:', offer.id, docError);
            return { ...offer, document_count: 0, required_documents_count: 0 };
          }

          const documentCount = docData?.length || 0;
          const requiredDocumentsCount = docData?.filter(doc => doc.is_required).length || 0;

          return {
            ...offer,
            document_count: documentCount,
            required_documents_count: requiredDocumentsCount
          };
        })
      );

      setOffers(offersWithDocCounts);
    } catch (error) {
      console.error('Error fetching agent offers:', error);
      toast({
        title: "Error",
        description: "Failed to load offers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOfferStatus = (offer: OfferIntent) => {
    if (offer.agent_summary_generated_at) return 'ready';
    if (offer.questionnaire_completed_at) return 'under_review';
    if (offer.consultation_scheduled_at) return 'consultation_scheduled';
    if (offer.consultation_requested) return 'consultation_requested';
    return 'in_progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'consultation_scheduled': return 'bg-purple-100 text-purple-800';
      case 'consultation_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready for Submission';
      case 'under_review': return 'Under Review';
      case 'consultation_scheduled': return 'Consultation Scheduled';
      case 'consultation_requested': return 'Consultation Requested';
      default: return 'In Progress';
    }
  };

  const getNextAction = (offer: OfferIntent) => {
    const status = getOfferStatus(offer);
    switch (status) {
      case 'ready': return 'Submit Offer';
      case 'under_review': return 'Review & Approve';
      case 'consultation_scheduled': return 'Prepare for Meeting';
      case 'consultation_requested': return 'Schedule Consultation';
      default: return 'Review Details';
    }
  };

  const activeOffers = offers.filter(offer => 
    !offer.agent_summary_generated_at
  );

  const completedOffers = offers.filter(offer => 
    offer.agent_summary_generated_at
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Offers</h2>
          <p className="text-gray-600 mt-1">Manage offers from your clients</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Active ({activeOffers.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Completed ({completedOffers.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Offers Tab */}
        <TabsContent value="active" className="space-y-6">
          {activeOffers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Offers</h3>
                <p className="text-gray-600">
                  Offers from your clients will appear here when they request consultations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOffers.map((offer) => {
                const status = getOfferStatus(offer);
                const nextAction = getNextAction(offer);

                return (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight truncate">
                            {offer.property_address}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1 capitalize">
                            {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                          </p>
                        </div>
                        <Badge className={`ml-2 ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Client Request</span>
                        </div>
                      </div>

                      {/* Document Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {offer.document_count || 0} document{(offer.document_count || 0) !== 1 ? 's' : ''}
                          </span>
                          {(offer.required_documents_count || 0) > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {offer.required_documents_count} required
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOffer(offer);
                          }}
                        >
                          {nextAction}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle message client
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Completed Offers Tab */}
        <TabsContent value="completed" className="space-y-6">
          {completedOffers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Offers</h3>
                <p className="text-gray-600">
                  Completed offers will appear here after you finalize them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOffers.map((offer) => {
                const status = getOfferStatus(offer);

                return (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg leading-tight truncate">
                            {offer.property_address}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1 capitalize">
                            {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                          </p>
                        </div>
                        <Badge className={`ml-2 ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOffer(offer);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onUpdate={fetchAgentOffers}
          buyerId={selectedOffer.buyer_id}
        />
      )}
    </div>
  );
};

export default AgentOfferManagement;