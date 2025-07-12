
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
  // Use "Property Search" as default title per iHomeFinder requirements
  // Only use dynamic titles for specific property addresses
  const title = listingAddress 
    ? `${listingAddress} - Property Details & Photos`
    : 'Property Search';

  // Use empty description as default per iHomeFinder requirements
  // Only use dynamic descriptions for specific property addresses
  const description = listingAddress
    ? `Photos and Property Details for ${listingAddress}. Get complete property information, maps, street view, schools, walk score and more. Request additional information, schedule a showing, save to your property organizer.`
    : '';

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
