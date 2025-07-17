import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleIDXIntegration } from '@/hooks/useSimpleIDXIntegration';

const MakeOffer = () => {
  const [searchParams] = useSearchParams();
  const { propertyData } = useSimpleIDXIntegration();
  
  // Get listing ID from URL params
  const listingId = searchParams.get('listing');
  
  const handleBack = () => {
    window.history.back();
  };

  const handleOfferQuestionnaire = () => {
    window.location.href = '/offer-questionnaire';
  };

  const handleContactAgent = () => {
    console.log('Contact agent functionality to be implemented');
    // TODO: Implement agent contact functionality
  };

  useEffect(() => {
    // If we have a listing ID but no property data, log for debugging
    if (listingId && !propertyData) {
      console.log('[Make Offer] Listing ID provided but no property data available:', listingId);
    }
  }, [listingId, propertyData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Make an Offer</CardTitle>
            </CardHeader>
            <CardContent>
              {propertyData && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    {propertyData.address}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {propertyData.price && (
                      <span className="font-medium text-green-600">
                        ${parseFloat(propertyData.price.replace(/[^0-9.]/g, '')).toLocaleString()}
                      </span>
                    )}
                    {propertyData.beds && <span>{propertyData.beds} beds</span>}
                    {propertyData.baths && <span>{propertyData.baths} baths</span>}
                    {propertyData.sqft && <span>{propertyData.sqft} sqft</span>}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-blue-200 hover:border-blue-300 transition-colors cursor-pointer">
                    <CardContent className="p-6" onClick={handleOfferQuestionnaire}>
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Start Offer Process</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Complete our offer questionnaire to get started with your offer.
                        </p>
                        <Button className="w-full">
                          Begin Offer Questionnaire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                    <CardContent className="p-6" onClick={handleContactAgent}>
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Contact Agent</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Speak directly with a real estate agent about this property.
                        </p>
                        <Button variant="outline" className="w-full">
                          Contact Agent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Making an Offer</h3>
                    <p className="text-blue-800 text-sm">
                      Our team will guide you through the entire offer process, from initial assessment 
                      to closing. We'll help you determine a competitive offer price and handle all 
                      the paperwork.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MakeOffer;