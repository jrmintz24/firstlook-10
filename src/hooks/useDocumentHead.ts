
import { useEffect } from 'react';

interface UseDocumentHeadProps {
  title: string;
  description?: string;
}

export const useDocumentHead = ({ title, description }: UseDocumentHeadProps) => {
  useEffect(() => {
    document.title = title;
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.getElementsByTagName('head')[0].appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
};
