/**
 * PWA (Progressive Web App) Utilities
 * Handles service worker registration and install prompts
 */

let deferredPrompt: any = null;

/**
 * Register service worker
 * Call this once when the app starts
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully:', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('🔄 New version available! Please refresh.');
              showUpdateNotification();
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.warn('⚠️ Service Workers are not supported in this browser');
  }
};

/**
 * Unregister service worker (for development/testing)
 */
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Worker unregistered');
  }
};

/**
 * Show update notification
 */
const showUpdateNotification = () => {
  // You can integrate this with your toast notification system
  if (confirm('A new version of Drug GENIE is available! Would you like to update now?')) {
    window.location.reload();
  }
};

/**
 * Setup install prompt
 * Captures the beforeinstallprompt event
 */
export const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Save the event so it can be triggered later
    deferredPrompt = e;
    console.log('💾 Install prompt ready');
    
    // Show install button/banner in your UI
    showInstallButton();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
    hideInstallButton();
  });
};

/**
 * Trigger install prompt
 * Call this when user clicks your install button
 */
export const promptInstall = async () => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === 'accepted';
};

/**
 * Check if app is installed
 */
export const isAppInstalled = (): boolean => {
  // Check if running in standalone mode
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

/**
 * Check if install prompt is available
 */
export const canInstall = (): boolean => {
  return deferredPrompt !== null && !isAppInstalled();
};

/**
 * Show install button in UI
 * You should implement this in your component
 */
const showInstallButton = () => {
  // Dispatch custom event that your component can listen to
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
};

/**
 * Hide install button in UI
 */
const hideInstallButton = () => {
  // Dispatch custom event that your component can listen to
  window.dispatchEvent(new CustomEvent('pwa-install-completed'));
};

/**
 * Request notification permission
 * For push notifications (future feature)
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Check if browser supports PWA features
 */
export const checkPWASupport = () => {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    pushManager: 'PushManager' in window,
    cacheStorage: 'caches' in window,
  };
};
