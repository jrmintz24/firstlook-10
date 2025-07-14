
import { useEffect } from 'react';

interface DocumentHeadOptions {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
}

export const useDocumentHead = (options: DocumentHeadOptions) => {
  useEffect(() => {
    // Update document title
    if (options.title) {
      document.title = options.title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Update meta tags
    if (options.description) {
      updateMetaTag('description', options.description);
    }

    if (options.keywords) {
      updateMetaTag('keywords', options.keywords);
    }

    if (options.ogImage) {
      updateMetaTag('og:image', options.ogImage, true);
    }

    if (options.ogImageWidth) {
      updateMetaTag('og:image:width', options.ogImageWidth, true);
    }

    if (options.ogImageHeight) {
      updateMetaTag('og:image:height', options.ogImageHeight, true);
    }

    // Cleanup function to restore default values when component unmounts
    return () => {
      document.title = 'Home Finder Platform';
      const defaultDescription = 'Find and tour homes with professional real estate agents';
      updateMetaTag('description', defaultDescription);
    };
  }, [options.title, options.description, options.keywords, options.ogImage, options.ogImageWidth, options.ogImageHeight]);
};
