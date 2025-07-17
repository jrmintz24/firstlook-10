import { initSimpleIDXExtractor } from './simpleIDXExtractor';

export function initIhfOverrides() {
  console.log('[IHF Override] Starting simplified initialization');
  
  // Initialize the simple property extractor
  initSimpleIDXExtractor();
  
  document.addEventListener('DOMContentLoaded', () => {
    hideIhfForms();

    const observer = new MutationObserver(() => {
      const tourBtn = document.querySelector(
        'button.ihf-btn-tour'
      ) as HTMLButtonElement | null;
      const contactBtn = document.querySelector(
        'button.ihf-btn-contact'
      ) as HTMLButtonElement | null;

      let rewired = false;

      if (tourBtn && !tourBtn.getAttribute('data-rewired')) {
        rewired = true;
        tourBtn.textContent = 'Schedule Tour';
        tourBtn.setAttribute('data-rewired', 'true');
        tourBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const listingId = extractListingId();
          window.location.href = `/schedule-tour?listing=${listingId}`;
        });
      }

      if (contactBtn && !contactBtn.getAttribute('data-rewired')) {
        rewired = true;
        contactBtn.textContent = 'Make an Offer';
        contactBtn.setAttribute('data-rewired', 'true');
        contactBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const listingId = extractListingId();
          window.location.href = `/make-offer?listing=${listingId}`;
        });
      }

      if (rewired) {
        injectToolbar();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export function extractListingId(): string {
  const match = window.location.href.match(/id=([^&]+)/);
  return match ? match[1] : '';
}

function injectToolbar() {
  const detailContainer = document.querySelector('.ihf-detail');
  if (detailContainer && !document.getElementById('custom-toolbar')) {
    const bar = document.createElement('div');
    bar.id = 'custom-toolbar';
    bar.style.background = '#f9f9f9';
    bar.style.padding = '12px';
    bar.style.borderBottom = '1px solid #ccc';
    bar.style.textAlign = 'center';

    const tour = document.createElement('button');
    tour.textContent = 'Schedule Tour';
    tour.addEventListener('click', () => {
      const id = extractListingId();
      window.location.href = `/schedule-tour?listing=${id}`;
    });

    const offer = document.createElement('button');
    offer.textContent = 'Make an Offer';
    offer.addEventListener('click', () => {
      const id = extractListingId();
      window.location.href = `/make-offer?listing=${id}`;
    });

    bar.append(tour, offer);
    detailContainer.prepend(bar);
  }
}

function hideIhfForms() {
  const style = document.createElement('style');
  style.textContent = `
    .ihf-request-form, 
    .ihf-tour-request-form { 
      display: none !important; 
    }
  `;
  document.head.append(style);
}