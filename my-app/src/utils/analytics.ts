/**
 * Google Analytics Integration
 * 
 * Setup Instructions:
 * 1. Create a Google Analytics 4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Add it to your .env file as VITE_GA_MEASUREMENT_ID
 * 4. The analytics will automatically start tracking
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics
 * Call this once when the app starts
 */
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found. Analytics disabled.');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll send page views manually
  });

  console.log('Google Analytics initialized');
};

/**
 * Track page views
 * Call this on route changes
 */
export const trackPageView = (path: string, title?: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

/**
 * Track custom events
 * Use this for user interactions
 */
export const trackEvent = (
  eventName: string,
  parameters?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (!window.gtag) return;

  window.gtag('event', eventName, parameters);
};

/**
 * Track user properties
 * Use this to set user attributes
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Common event tracking helpers
 */
export const analytics = {
  // Authentication events
  login: (method: string) => {
    trackEvent('login', { method });
  },

  signup: (method: string) => {
    trackEvent('sign_up', { method });
  },

  logout: () => {
    trackEvent('logout');
  },

  // Feature usage events
  useFeature: (featureName: string) => {
    trackEvent('feature_used', {
      category: 'engagement',
      label: featureName,
    });
  },

  // Health tracking events
  addReminder: () => {
    trackEvent('add_reminder', {
      category: 'health_tracking',
    });
  },

  checkDrugInteraction: () => {
    trackEvent('check_drug_interaction', {
      category: 'health_tracking',
    });
  },

  searchMedicine: (query: string) => {
    trackEvent('search_medicine', {
      category: 'search',
      label: query,
    });
  },

  chatWithAI: () => {
    trackEvent('chat_with_ai', {
      category: 'ai_assistant',
    });
  },

  createBloodRequest: () => {
    trackEvent('create_blood_request', {
      category: 'blood_bank',
    });
  },

  // Error tracking
  trackError: (error: Error, context?: string) => {
    trackEvent('exception', {
      description: error.message,
      fatal: false,
      context,
    });
  },

  // Performance tracking
  trackTiming: (category: string, variable: string, value: number) => {
    trackEvent('timing_complete', {
      name: variable,
      value: Math.round(value),
      event_category: category,
    });
  },
};

/**
 * Hook for tracking page views on route changes
 * Use this in your router
 */
export const usePageTracking = () => {
  // This will be used in App.tsx to track route changes
  return { trackPageView };
};
