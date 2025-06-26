
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface ShowingDetails {
  id: string;
  property_address: string;
  preferred_date: string;
  preferred_time: string;
  assigned_agent_name: string;
  assigned_agent_phone: string;
}

const TourAgreement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [showingDetails, setShowingDetails] = useState<ShowingDetails | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid agreement link');
      setLoading(false);
      return;
    }

    fetchAgreementDetails();
  }, [token]);

  const fetchAgreementDetails = async () => {
    try {
      // Get agreement details by token
      const { data: agreementData, error: agreementError } = await supabase
        .from('tour_agreements')
        .select(`
          showing_request_id,
          signed,
          token_expires_at,
          showing_requests!inner(
            id,
            property_address,
            preferred_date,
            preferred_time,
            assigned_agent_name,
            assigned_agent_phone
          )
        `)
        .eq('email_token', token)
        .single();

      if (agreementError || !agreementData) {
        setError('Agreement not found or invalid');
        return;
      }

      // Check if token is expired
      if (new Date(agreementData.token_expires_at) < new Date()) {
        setError('Agreement link has expired');
        return;
      }

      // Check if already signed
      if (agreementData.signed) {
        setError('Agreement has already been signed');
        return;
      }

      setShowingDetails(agreementData.showing_requests);
    } catch (error: any) {
      console.error('Error fetching agreement:', error);
      setError('Failed to load agreement details');
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!agreementAccepted || !showingDetails) return;

    setSigning(true);
    try {
      // Update agreement as signed
      const { error: updateError } = await supabase
        .from('tour_agreements')
        .update({
          signed: true,
          signed_at: new Date().toISOString(),
          terms_accepted_at: new Date().toISOString()
        })
        .eq('email_token', token);

      if (updateError) throw updateError;

      // Update showing status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showingDetails.id);

      if (statusError) throw statusError;

      toast({
        title: "Agreement Signed Successfully! 🎉",
        description: "Your tour is now confirmed. You'll receive further details soon.",
      });

      // Redirect to success page or dashboard
      setTimeout(() => {
        navigate('/buyer-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agreement details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Agreement</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showingDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <CardTitle>Tour Agreement</CardTitle>
            </div>
            <p className="text-gray-600">Please review and sign this non-exclusive single tour agreement</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Tour Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Tour Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Property:</strong> {showingDetails.property_address}</p>
                <p><strong>Date:</strong> {showingDetails.preferred_date}</p>
                <p><strong>Time:</strong> {showingDetails.preferred_time}</p>
                <p><strong>Agent:</strong> {showingDetails.assigned_agent_name}</p>
                <p><strong>Agent Phone:</strong> {showingDetails.assigned_agent_phone}</p>
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Agreement Terms</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
                <p>
                  <strong>Non-Exclusive Single Tour Agreement:</strong> This agreement covers only the single property tour scheduled above. 
                  This is a non-exclusive arrangement, meaning you are free to work with other agents for other properties.
                </p>
                <p>
                  <strong>Tour Commitment:</strong> By signing this agreement, you commit to attending the scheduled tour at the specified 
                  date and time. If you need to reschedule, please contact your agent at least 2 hours in advance.
                </p>
                <p>
                  <strong>Professional Conduct:</strong> You agree to conduct yourself professionally during the tour and follow any 
                  safety guidelines provided by the agent or property owner.
                </p>
                <p>
                  <strong>Property Information:</strong> Any information shared during the tour is for your personal use in evaluating 
                  the property and should not be shared with unauthorized parties.
                </p>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreement"
                checked={agreementAccepted}
                onCheckedChange={setAgreementAccepted}
              />
              <label htmlFor="agreement" className="text-sm leading-5">
                I have read and agree to the terms of this non-exclusive single tour agreement. 
                I understand this covers only the property tour specified above.
              </label>
            </div>

            {/* Sign Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSignAgreement}
                disabled={!agreementAccepted || signing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {signing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing Agreement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sign Agreement & Confirm Tour
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourAgreement;
