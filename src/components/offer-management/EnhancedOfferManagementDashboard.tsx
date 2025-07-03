
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, MessageCircle, Plus, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EnhancedOfferDetailModal from './EnhancedOfferDetailModal';
import DocumentUpload from './DocumentUpload';

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
  buyer_qualification?: any;
  financing_details?: any;
  contingencies?: any;
  additional_terms?: any;
  has_consultation?: boolean;
}

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_category: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface EnhancedOfferManagementDashboardProps {
  buyerId: string;
  onCreateOffer?: () => void;
}

const EnhancedOfferManagementDashboard = ({ buyerId, onCreateOffer }: EnhancedOfferManagementDashboardProps) => {
  const [offers, setOffers] = useState<OfferIntent[]>([]);
  const [documents, setDocuments] = useState<Record<string, Document[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferIntent | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, [buyerId]);

  const fetchOffers = async () => {
    try {
      // Fetch offers with consultation booking status
      const { data: offersData, error: offersError } = await supabase
        .from('offer_intents')
        .select(`
          *,
          consultation_bookings!inner(
            id,
            scheduled_at,
            status
          )
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      // Transform the data to include consultation status
      const transformedOffers = offersData?.map(offer => ({
        ...offer,
        has_consultation: offer.consultation_bookings && offer.consultation_bookings.length > 0
      })) || [];

      setOffers(transformedOffers);

      // Fetch documents for each offer
      if (transformedOffers.length > 0) {
        const offerIds = transformedOffers.map(offer => offer.id);
        const { data: documentsData, error: documentsError } = await supabase
          .from('offer_documents')
          .select('*')
          .in('offer_intent_id', offerIds)
          .order('uploaded_at', { ascending: false });

        if (documentsError) throw documentsError;

        // Group documents by offer ID
        const groupedDocuments = documentsData?.reduce((acc, doc) => {
          if (!acc[doc.offer_intent_id]) {
            acc[doc.offer_intent_id] = [];
          }
          acc[doc.offer_intent_id].push(doc);
          return acc;
        }, {} as Record<string, Document[]>) || {};

        setDocuments(groupedDocuments);
      }
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
    if (!offer.has_consultation) return 'no_consultation';
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
      case 'no_consultation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready for Submission';
      case 'under_review': return 'Under Review';
      case 'consultation_scheduled': return 'Consultation Scheduled';
      case 'consultation_requested': return 'Consultation Requested';
      case 'no_consultation': return 'Consultation Required';
      default: return 'In Progress';
    }
  };

  const getNextAction = (offer: OfferIntent) => {
    const status = getOfferStatus(offer);
    switch (status) {
      case 'ready': return 'View Documents';
      case 'under_review': return 'View Summary';
      case 'consultation_scheduled': return 'Join Consultation';
      case 'consultation_requested': return 'Schedule Consultation';
      case 'no_consultation': return 'Book Consultation';
      default: return 'Continue Setup';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/buyer-dashboard');
  };

  const handleDocumentUpdate = () => {
    fetchOffers(); // Refresh offers and documents
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
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Offers</h2>
            <p className="text-gray-600 mt-1">Track and manage your property offers</p>
          </div>
        </div>
        {onCreateOffer && (
          <Button onClick={onCreateOffer} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Offer
          </Button>
        )}
      </div>

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Offers</h3>
            <p className="text-gray-600 mb-4">
              You need to book a consultation with an agent before your offers will appear here.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Complete a property tour and book a consultation session to start making offers.
            </p>
            <Button onClick={handleBackToDashboard} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const status = getOfferStatus(offer);
            const nextAction = getNextAction(offer);
            const offerDocuments = documents[offer.id] || [];

            return (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
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
                    {offer.agent_id && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Agent Assigned</span>
                      </div>
                    )}
                    {offerDocuments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{offerDocuments.length} docs</span>
                      </div>
                    )}
                  </div>

                  {/* Document Upload Section */}
                  <DocumentUpload
                    offerIntentId={offer.id}
                    documents={offerDocuments}
                    onDocumentUploaded={handleDocumentUpdate}
                    onDocumentDeleted={handleDocumentUpdate}
                  />

                  <div className="flex items-center justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      {nextAction}
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Enhanced Offer Detail Modal */}
      {selectedOffer && (
        <EnhancedOfferDetailModal
          offer={selectedOffer}
          documents={documents[selectedOffer.id] || []}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onUpdate={handleDocumentUpdate}
        />
      )}
    </div>
  );
};

export default EnhancedOfferManagementDashboard;
