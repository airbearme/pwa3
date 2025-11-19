import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppMode = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppMode);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setIsVisible(true);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('AirBear PWA installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the prompt
      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="eco-gradient text-white hover-lift animate-pulse-glow flex items-center gap-2 px-4 py-2 text-sm font-semibold"
      title="Install AirBear PWA"
    >
      <Download className="h-4 w-4" />
      <Smartphone className="h-4 w-4" />
      Install App
    </Button>
  );
}
