
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
  sqft?: string;
}

export const extractPropertyDataFromPage = (): PropertyData => {
  // Try to extract property data from various selectors commonly used by iHomeFinder
  const addressSelectors = [
    '[data-address]',
    '.property-address',
    '.listing-address',
    '.address',
    '.street-address',
    'h1',
    '.property-title',
    '.listing-title'
  ];

  const priceSelectors = [
    '[data-price]',
    '.property-price',
    '.listing-price',
    '.price',
    '.cost'
  ];

  const bedsSelectors = [
    '[data-beds]',
    '.beds',
    '.bedrooms',
    '.bed-count'
  ];

  const bathsSelectors = [
    '[data-baths]',
    '.baths',
    '.bathrooms',
    '.bath-count'
  ];

  const mlsSelectors = [
    '[data-mls]',
    '.mls-id',
    '.mls-number',
    '.listing-id'
  ];

  const sqftSelectors = [
    '[data-sqft]',
    '.sqft',
    '.square-feet',
    '.sq-ft'
  ];

  const extractFromSelectors = (selectors: string[]): string => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    return '';
  };

  const address = extractFromSelectors(addressSelectors) || 'Property Details';
  const price = extractFromSelectors(priceSelectors);
  const beds = extractFromSelectors(bedsSelectors);
  const baths = extractFromSelectors(bathsSelectors);
  const mlsId = extractFromSelectors(mlsSelectors);
  const sqft = extractFromSelectors(sqftSelectors);

  return {
    address,
    price: price || undefined,
    beds: beds || undefined,
    baths: baths || undefined,
    mlsId: mlsId || undefined,
    sqft: sqft || undefined
  };
};
