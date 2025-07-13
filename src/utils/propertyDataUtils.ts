
import { PropertyData } from "@/utils/idxCommunication";
import { Property } from "@/types/simplyrets";

export interface NormalizedPropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
  photos?: string[];
  sqft?: string;
  propertyType?: string;
}

export const normalizeIdxProperty = (property: PropertyData): NormalizedPropertyData => {
  return {
    address: property.address || '',
    price: property.price || '',
    beds: property.beds || '',
    baths: property.baths || '',
    mlsId: property.mlsId || '',
    photos: [],
    sqft: '',
    propertyType: ''
  };
};

export const normalizeApiProperty = (property: Property): NormalizedPropertyData => {
  return {
    address: property.address.full,
    price: property.listPrice.toString(),
    beds: property.property.bedrooms.toString(),
    baths: (property.property.bathsFull + (property.property.bathsHalf * 0.5)).toString(),
    mlsId: property.mlsId,
    photos: property.photos || [],
    sqft: property.property.area?.toString() || '',
    propertyType: property.property.type || ''
  };
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return price.toString();
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numPrice);
};
