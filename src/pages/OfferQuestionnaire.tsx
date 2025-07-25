
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SimpleAuth0Context';
import { useToast } from '@/hooks/use-toast';
import StreamlinedOfferPrep from '@/components/offer-workflow/StreamlinedOfferPrep';

const OfferQuestionnaire = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const propertyAddress = searchParams.get('property');
  const agentId = searchParams.get('agent');

  useEffect(() => {
    if (!user) {
      navigate('/buyer-auth');
      return;
    }

    if (!propertyAddress) {
      toast({
        title: "Missing Information",
        description: "Property address is required to schedule consultation.",
        variant: "destructive"
      });
      navigate('/buyer-dashboard');
      return;
    }
  }, [user, propertyAddress, agentId]);

  const handleClose = () => {
    navigate('/buyer-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !propertyAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Missing required information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StreamlinedOfferPrep
        isOpen={true}
        onClose={handleClose}
        propertyAddress={propertyAddress}
        buyerId={user.id}
        agentId={agentId || undefined}
      />
    </div>
  );
};

export default OfferQuestionnaire;
