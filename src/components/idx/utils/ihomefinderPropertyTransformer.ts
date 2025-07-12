
import { Property } from '@/types/simplyrets';
import { IHomefinderProperty } from '../types/ihomefinder';

export const transformIHomefinderProperty = (ihfProperty: IHomefinderProperty): Property => {
  return {
    mlsId: `IHF${ihfProperty.mlsNumber || ihfProperty.id || Date.now()}`,
    listPrice: ihfProperty.listPrice || ihfProperty.price || 0,
    listDate: ihfProperty.listDate || new Date().toISOString(),
    modificationTimestamp: ihfProperty.modificationTimestamp || new Date().toISOString(),
    address: {
      streetNumber: ihfProperty.streetNumber || '',
      streetName: ihfProperty.streetName || '',
      city: ihfProperty.city || '',
      state: ihfProperty.state || '',
      postalCode: ihfProperty.postalCode || ihfProperty.zipCode || '',
      country: 'US',
      full: ihfProperty.fullAddress || `${ihfProperty.streetNumber || ''} ${ihfProperty.streetName || ''}, ${ihfProperty.city || ''}, ${ihfProperty.state || ''} ${ihfProperty.postalCode || ihfProperty.zipCode || ''}`.trim()
    },
    geo: {
      lat: ihfProperty.latitude || ihfProperty.lat || 0,
      lng: ihfProperty.longitude || ihfProperty.lng || 0
    },
    property: {
      bedrooms: ihfProperty.bedrooms || ihfProperty.beds || 0,
      bathsFull: ihfProperty.bathsFull || ihfProperty.baths || 0,
      bathsHalf: ihfProperty.bathsHalf || 0,
      area: ihfProperty.squareFeet || ihfProperty.area || 0,
      type: ihfProperty.propertyType || 'Single Family',
      subType: ihfProperty.propertySubType || 'Detached'
    },
    listingAgent: {
      name: ihfProperty.listingAgent?.name || 'iHomeFinder Agent',
      phone: ihfProperty.listingAgent?.phone || '',
      email: ihfProperty.listingAgent?.email || ''
    },
    office: {
      name: ihfProperty.listingOffice?.name || 'iHomeFinder Office'
    },
    photos: ihfProperty.photos || [],
    remarks: ihfProperty.remarks || ihfProperty.description || 'Property via iHomeFinder',
    status: ihfProperty.status || 'Active',
    mls: {
      status: ihfProperty.status || 'Active',
      area: ihfProperty.area || ihfProperty.city || '',
      daysOnMarket: ihfProperty.daysOnMarket || 0
    }
  };
};
