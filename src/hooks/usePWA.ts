
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Check if app is already installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      toast({
        title: "App Installed",
        description: "FirstLook has been installed on your device!",
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for online/offline changes
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "Your connection has been restored.",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're Offline",
        description: "Some features may be limited while offline.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const installApp = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    installApp,
    requestNotificationPermission,
  };
};
