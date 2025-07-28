
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, User, MessageCircle, Plus, Upload, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferDetailModal from './OfferDetailModal';
import DocumentUploadManager from '../offer-workflow/DocumentUploadManager';

interface OfferIntent {
  id: string;
  property_address: string;
  offer_type: string;
  created_at: string;
  agent_id?: string;
  consultation_scheduled_at?: string;
  questionnaire_completed_at?: string;
  agent_summary_generated_at?: string;
  consultation_requested: boolean;
  document_count?: number;
  required_documents_count?: number;
}

interface OfferManagementDashboardProps {
  buyerId: string;
  onCreateOffer?: () => void;
}

const OfferManagementDashboard = ({ buyerId, onCreateOffer }: OfferManagementDashboardProps) => {
  const [offers, setOffers] = useState<OfferIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferIntent | null>(null);
  const [selectedOfferForDocs, setSelectedOfferForDocs] = useState<OfferIntent | null>(null);
  const [activeTab, setActiveTab] = useState('offers');
  const { toast } = useToast();

  useEffect(() => {
    fetchOffers();
  }, [buyerId]);

  const fetchOffers = async () => {
    try {
      // Fetch offers with document counts
      const { data: offersData, error: offersError } = await supabase
        .from('offer_intents')
        .select('*')
        .eq('buyer_id', buyerId)
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
      console.error('Error fetching offers:', error);
      toast({
        title: "Error",
        description: "Failed to load your offers. Please try again.",
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
      case 'under_review': return 'View Summary';
      case 'consultation_scheduled': return 'Join Consultation';
      case 'consultation_requested': return 'Schedule Consultation';
      default: return 'Continue Setup';
    }
  };

  const handleDocumentUploaded = () => {
    // Refresh offers to update document counts
    fetchOffers();
  };

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
          <h2 className="text-2xl font-bold text-gray-900">My Offers</h2>
          <p className="text-gray-600 mt-1">Track and manage your property offers</p>
        </div>
        {onCreateOffer && (
          <Button onClick={onCreateOffer} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Offer
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Offers ({offers.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Offers Tab */}
        <TabsContent value="offers" className="space-y-6">
          {offers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Offers Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first offer to get started with your home buying journey.
                </p>
                {onCreateOffer && (
                  <Button onClick={onCreateOffer}>Create Your First Offer</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const status = getOfferStatus(offer);
                const nextAction = getNextAction(offer);

                return (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-3">
                          <CardTitle className="text-base font-bold leading-snug text-gray-900">
                            {offer.property_address}
                          </CardTitle>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge className={`${getStatusColor(status)} border-0 shadow-sm font-semibold`}>
                            {getStatusText(status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 capitalize font-medium">
                          {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                        </div>
                        {offer.agent_id && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Agent Assigned</span>
                          </div>
                        )}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOfferForDocs(offer);
                            setActiveTab('documents');
                          }}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
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
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOfferForDocs(offer);
                              setActiveTab('documents');
                            }}
                            title="Upload Documents"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          {offer.agent_id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle message agent
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {!selectedOfferForDocs ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    Document Management
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Select an offer below to upload and manage documents
                  </p>
                </CardHeader>
                <CardContent>
                  {offers.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No offers available. Create an offer first.</p>
                      {onCreateOffer && (
                        <Button onClick={onCreateOffer} className="mt-4">
                          Create Offer
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {offers.map((offer) => (
                        <Card 
                          key={offer.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200"
                          onClick={() => setSelectedOfferForDocs(offer)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-3">
                                <h4 className="font-medium text-gray-900 leading-snug">
                                  {offer.property_address}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {offer.document_count || 0} documents uploaded
                                </p>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-2">
                                <Badge className={`${getStatusColor(getOfferStatus(offer))} text-xs`}>
                                  {getStatusText(getOfferStatus(offer))}
                                </Badge>
                                <Upload className="w-4 h-4 text-blue-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Offer Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Documents for {selectedOfferForDocs.property_address}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload and manage documents for this offer
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedOfferForDocs(null)}
                    >
                      Select Different Offer
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Document Upload Manager */}
              <DocumentUploadManager
                offerIntentId={selectedOfferForDocs.id}
                buyerId={buyerId}
                agentId={selectedOfferForDocs.agent_id}
                onDocumentUploaded={handleDocumentUploaded}
              />
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
          onUpdate={fetchOffers}
          buyerId={buyerId}
          userType="buyer"
          currentUserId={buyerId}
        />
      )}
    </div>
  );
};

export default OfferManagementDashboard;
