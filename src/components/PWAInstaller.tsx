import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a delay if not already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed && !standalone) {
        setTimeout(() => setShowInstallPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');

    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or no prompt available
  if (isStandalone || (!deferredPrompt && !isIOS) || !showInstallPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Install prompt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <Card className="p-6 bg-[var(--neutral-900)] border-[var(--neutral-800)] shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--neon-green)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-[var(--neon-green)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">
                    Install THEFMSMKT App
                  </h3>
                  <p className="text-sm text-[var(--neutral-400)] mb-4">
                    Get faster access, offline ordering, and exclusive app-only deals!
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-xs text-[var(--neutral-500)]">
                      <Zap className="w-3 h-3" />
                      Lightning fast
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--neutral-500)]">
                      <Download className="w-3 h-3" />
                      Works offline
                    </div>
                  </div>

                  {isIOS ? (
                    <div className="space-y-3">
                      <p className="text-xs text-[var(--neutral-400)]">
                        To install: Tap <span className="font-semibold">Share</span> →
                        <span className="font-semibold"> Add to Home Screen</span>
                      </p>
                      <Button
                        onClick={handleDismiss}
                        className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                      >
                        Got it!
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleInstallClick}
                        className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
                      >
                        Install App
                      </Button>
                      <Button
                        onClick={handleDismiss}
                        variant="outline"
                        size="sm"
                        className="border-[var(--neutral-700)] text-[var(--neutral-400)]"
                      >
                        Later
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 text-[var(--neutral-500)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// PWA Update notifier
export function PWAUpdateNotifier() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdatePrompt(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdatePrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <Card className="p-4 bg-[var(--neutral-900)] border-[var(--neutral-800)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white text-sm">App Update Available</h4>
            <p className="text-xs text-[var(--neutral-400)]">Restart to get the latest features</p>
          </div>
          <Button
            onClick={handleUpdate}
            size="sm"
            className="bg-[var(--neon-green)] text-black"
          >
            Update
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
