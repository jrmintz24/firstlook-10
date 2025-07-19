interface Window {
  ihfKestrel?: {
    render?: () => any;
    renderWithSearch?: (params: { search: string }) => any;
    config?: any;
  };
  currentListingDetails?: any;
}