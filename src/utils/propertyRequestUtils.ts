
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
  return formData.selectedProperties.length > 0 
    ? formData.selectedProperties 
    : [formData.propertyAddress];
};

export const getPreferredOptions = (formData: any) => {
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
