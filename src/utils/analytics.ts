declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: 'whatsapp_click' | 'catalogue_download' | 'enquiry_submit',
  params?: Record<string, string | number | boolean>
) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  } catch {
    // Analytics must never interrupt UX
  }
}
