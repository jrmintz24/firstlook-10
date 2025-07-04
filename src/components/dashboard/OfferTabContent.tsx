
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, MessageCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferDetailModal from '@/components/offer-management/OfferDetailModal';

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
}

interface OfferTabContentProps {
  buyerId: string;
  onCreateOffer?: () => void;
}

const OfferTabContent = ({ buyerId, onCreateOffer }: OfferTabContentProps) => {
  const [offers, setOffers] = useState<OfferIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferIntent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOffers();
  }, [buyerId]);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offer_intents')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Offers Yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first offer to get started with your home buying journey.
          </p>
          {onCreateOffer && (
            <Button onClick={onCreateOffer} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Create Your First Offer
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const status = getOfferStatus(offer);
            const nextAction = getNextAction(offer);

            return (
              <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 leading-tight truncate">
                        {offer.property_address}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 capitalize">
                        {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
                      </p>
                    </div>
                    <Badge className={`ml-2 ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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

                  <div className="flex items-center justify-between">
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

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onUpdate={fetchOffers}
        />
      )}
    </div>
  );
};

export default OfferTabContent;
