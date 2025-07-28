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
              {activeOffers.map((offer, index) => {
                const status = getOfferStatus(offer);
                const nextAction = getNextAction(offer);

                return (
                  <div
                    key={offer.id}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card 
                      className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:scale-[1.02] bg-gradient-to-br from-white via-white to-gray-50/50"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      {/* Status indicator bar */}
                      <div className={`h-1 w-full rounded-t-lg ${
                        status === 'ready' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        status === 'under_review' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        status === 'consultation_scheduled' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                        status === 'consultation_requested' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-gray-400 to-gray-600'
                      }`} />
                      
                      <CardHeader className="pb-4 pt-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold leading-tight truncate text-gray-900 group-hover:text-blue-700 transition-colors">
                              {offer.property_address}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1 capitalize font-medium">
                              {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                            </p>
                          </div>
                          <div className="ml-3">
                            <Badge className={`${getStatusColor(status)} border-0 shadow-sm font-semibold`}>
                              {getStatusText(status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-5 pb-6">
                        {/* Info row with enhanced styling */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="p-1.5 rounded-full bg-blue-50">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="font-medium">{new Date(offer.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="p-1.5 rounded-full bg-purple-50">
                              <User className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <span className="font-medium">Client</span>
                          </div>
                        </div>

                        {/* Document Status with enhanced styling */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-orange-50">
                                <FileText className="w-3.5 h-3.5 text-orange-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {offer.document_count || 0} document{(offer.document_count || 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {(offer.required_documents_count || 0) > 0 && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                                {offer.required_documents_count} required
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action buttons with enhanced styling */}
                        <div className="flex items-center justify-between pt-2">
                          <Button 
                            className={`font-semibold shadow-sm transition-all duration-200 ${
                              status === 'ready' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' :
                              status === 'under_review' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' :
                              'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300'
                            }`}
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
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-full p-2"
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
                  </div>
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
              {completedOffers.map((offer, index) => {
                const status = getOfferStatus(offer);

                return (
                  <div
                    key={offer.id}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card 
                      className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:scale-[1.02] bg-gradient-to-br from-white via-white to-green-50/30"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      {/* Completed status indicator bar */}
                      <div className="h-1 w-full rounded-t-lg bg-gradient-to-r from-green-400 to-green-600" />
                      
                      <CardHeader className="pb-4 pt-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold leading-tight truncate text-gray-900 group-hover:text-green-700 transition-colors">
                              {offer.property_address}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1 capitalize font-medium">
                              {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                            </p>
                          </div>
                          <div className="ml-3">
                            <Badge className="bg-green-100 text-green-800 border-0 shadow-sm font-semibold">
                              ✓ Completed
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-5 pb-6">
                        {/* Info row with enhanced styling */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="p-1.5 rounded-full bg-blue-50">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="font-medium">{new Date(offer.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <div className="p-1.5 rounded-full bg-green-50">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="font-medium">Finalized</span>
                          </div>
                        </div>

                        {/* Action button with enhanced styling */}
                        <div className="pt-2">
                          <Button 
                            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300 font-semibold shadow-sm transition-all duration-200"
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
                  </div>
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
          userType="agent"
          currentUserId={agentId}
        />
      )}
    </div>
  );
};

export default AgentOfferManagement;