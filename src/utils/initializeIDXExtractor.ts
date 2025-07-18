// Initialize IDX property extractor when application loads
import { autoExtractOnPropertyPage } from './idxPropertyExtractor';

export const initializeIDXExtractor = () => {
  console.log('🚀 [IDX] Initializing IDX property extractor...');
  
  // Run extraction immediately
  autoExtractOnPropertyPage();
  
  // Listen for navigation changes (SPA routing)
  let currentURL = window.location.href;
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentURL) {
      currentURL = window.location.href;
      console.log('🔄 [IDX] URL changed, re-running extraction:', currentURL);
      setTimeout(() => {
        autoExtractOnPropertyPage();
      }, 1000);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also listen for popstate events (back/forward navigation)
  window.addEventListener('popstate', () => {
    console.log('🔄 [IDX] Popstate event, re-running extraction');
    setTimeout(() => {
      autoExtractOnPropertyPage();
    }, 1000);
  });
  
  console.log('✅ [IDX] IDX property extractor initialized');
};

// Auto-initialize if we're in a browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIDXExtractor);
  } else {
    initializeIDXExtractor();
  }
}