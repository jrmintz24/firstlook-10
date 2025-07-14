// Ultra-minimal IDX communication - no DOM interference
export interface PropertyData {
  address: string;
  price?: string;
  beds?: string;
  baths?: string;
  mlsId?: string;
}

// Commented out all functionality to avoid any DOM interference
// We'll gradually re-introduce these functions later if needed

// export const IDX_BUTTON_HIDING_CSS = `...`;
// export const isPropertyDetailPage = (): boolean => {...};
// export const extractPropertyData = (): PropertyData => {...};
