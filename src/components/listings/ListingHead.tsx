
import React from 'react';
import { useDocumentHead } from '@/hooks/useDocumentHead';

interface ListingHeadProps {
  listingAddress?: string;
  listingCity?: string;
  listingPhotoUrl?: string;
  listingPhotoWidth?: string;
  listingPhotoHeight?: string;
}

const ListingHead = ({
  listingAddress,
  listingCity,
  listingPhotoUrl,
  listingPhotoWidth,
  listingPhotoHeight
}: ListingHeadProps) => {
  const title = listingAddress 
    ? `${listingAddress} - Property Details & Photos`
    : 'Property Listings - Real Estate Search';

  const description = listingAddress
    ? `Photos and Property Details for ${listingAddress}. Get complete property information, maps, street view, schools, walk score and more. Request additional information, schedule a showing, save to your property organizer.`
    : 'Search and browse real estate listings. View photos, property details, maps, and schedule showings with professional agents.';

  const keywords = listingAddress && listingCity
    ? `${listingAddress}, ${listingCity} Real Estate, ${listingCity} Property for Sale`
    : 'Real Estate, Property Listings, Homes for Sale, MLS Search';

  useDocumentHead({
    title,
    description,
    keywords,
    ogImage: listingPhotoUrl,
    ogImageWidth: listingPhotoWidth,
    ogImageHeight: listingPhotoHeight
  });

  return null; // This component only manages document head
};

export default ListingHead;
