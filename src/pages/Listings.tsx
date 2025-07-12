
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ListingHead from '@/components/listings/ListingHead';
import ListingPageLayout from '@/components/listings/ListingPageLayout';
import IDXEmbedWidget from '@/components/listings/IDXEmbedWidget';

const Listings = () => {
  const { address } = useParams<{ address?: string }>();
  const [searchParams] = useSearchParams();
  
  // Extract listing data from URL parameters or route params
  const listingAddress = address || searchParams.get('address') || undefined;
  const listingCity = searchParams.get('city') || undefined;
  const listingPhotoUrl = searchParams.get('photo') || undefined;
  const listingPhotoWidth = searchParams.get('photoWidth') || '1200';
  const listingPhotoHeight = searchParams.get('photoHeight') || '800';

  return (
    <>
      {/* SEO Head Management */}
      <ListingHead
        listingAddress={listingAddress}
        listingCity={listingCity}
        listingPhotoUrl={listingPhotoUrl}
        listingPhotoWidth={listingPhotoWidth}
        listingPhotoHeight={listingPhotoHeight}
      />

      {/* Page Layout */}
      <ListingPageLayout>
        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {listingAddress || 'Property Listings'}
            </h1>
            {listingCity && (
              <p className="text-gray-600 mt-2">
                {listingCity} Real Estate
              </p>
            )}
          </div>

          {/* IDX Widget */}
          <IDXEmbedWidget className="w-full" />
        </div>
      </ListingPageLayout>
    </>
  );
};

export default Listings;
