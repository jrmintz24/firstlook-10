
import React from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isListingRoute = location.pathname.startsWith('/listing');
  const isListingsRoute = location.pathname.startsWith('/listings');

  // Different SEO logic based on route
  let title: string;
  let description: string;

  if (isListingRoute) {
    // For /listing route: use {listingAddress} directly as title
    title = listingAddress || 'Property Listing';
    // Always use full description template for /listing route
    description = listingAddress
      ? `Photos and Property Details for ${listingAddress}. Get complete property information, maps, street view, schools, walk score and more. Request additional information, schedule a showing, save to your property organizer.`
      : 'Photos and Property Details. Get complete property information, maps, street view, schools, walk score and more. Request additional information, schedule a showing, save to your property organizer.';
  } else if (isListingsRoute) {
    // For /listings route: use "Property Search" as default per iHomeFinder requirements
    title = listingAddress 
      ? `${listingAddress} - Property Details & Photos`
      : 'Property Search';
    // Use empty description as default for /listings route
    description = listingAddress
      ? `Photos and Property Details for ${listingAddress}. Get complete property information, maps, street view, schools, walk score and more. Request additional information, schedule a showing, save to your property organizer.`
      : '';
  } else {
    // Fallback for other routes
    title = 'Property Search';
    description = '';
  }

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
