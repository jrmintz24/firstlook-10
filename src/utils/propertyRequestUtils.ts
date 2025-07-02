
export const convertTo24Hour = (time: string): string => {
  const [t, modifier] = time.split(' ');
  let hours = t.split(':')[0];
  const minutes = t.split(':')[1];
  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
    hours = String(Number(hours) + 12);
  }
  if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  }
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

export const getPropertiesToSubmit = (formData: any): string[] => {
  // Handle new format first - properties array
  if (formData.properties && formData.properties.length > 0) {
    const addressesFromArray = formData.properties
      .map((prop: any) => prop.address)
      .filter((address: string) => address && address.trim());
    
    if (addressesFromArray.length > 0) {
      return addressesFromArray;
    }
  }
  
  // Handle legacy selectedProperties array
  if (formData.selectedProperties && formData.selectedProperties.length > 0) {
    return formData.selectedProperties.filter(Boolean);
  }
  
  // Handle single property address field
  if (formData.propertyAddress && formData.propertyAddress.trim()) {
    return [formData.propertyAddress.trim()];
  }
  
  return [];
};

export const getPreferredOptions = (formData: any) => {
  // Handle new format first
  if (formData.preferredOptions && formData.preferredOptions.length > 0) {
    return formData.preferredOptions
      .filter((option: any) => option.date || option.time)
      .map((option: any) => ({
        date: option.date,
        time: option.time ? convertTo24Hour(option.time) : ''
      }));
  }
  
  // Handle old format
  return [1, 2, 3]
    .map((num) => {
      const date = formData[`preferredDate${num}`] as string;
      const time = formData[`preferredTime${num}`] as string;
      if (!date && !time) return null;
      return {
        date,
        time: time ? convertTo24Hour(time) : ''
      };
    })
    .filter(Boolean) as { date: string; time: string }[];
};

export const getEstimatedConfirmationDate = (): string => {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 2);
  return estimatedDate.toISOString().split('T')[0];
};
