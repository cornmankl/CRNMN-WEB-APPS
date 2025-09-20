import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Wifi, WifiOff, Battery, BatteryLow, Volume2, VolumeX } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export function AdvancedPWA() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const { hapticSuccess, hapticWarning } = useHapticFeedback();

    useEffect(() => {
        // Online/Offline detection
        const handleOnline = () => {
            setIsOnline(true);
            hapticSuccess();
        };

        const handleOffline = () => {
            setIsOnline(false);
            hapticWarning();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Battery API
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(Math.round(battery.level * 100));

                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                });
            });
        }

        // PWA Install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallPrompt(false);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [hapticSuccess, hapticWarning]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            hapticSuccess();
            setShowInstallPrompt(false);
        }

        setDeferredPrompt(null);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        hapticSuccess();
    };

    return (
        <>
            {/* Status Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-green-500/20"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2">
                            {isOnline ? (
                                <Wifi className="w-4 h-4 text-green-400" />
                            ) : (
                                <WifiOff className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-xs text-white">
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        {/* Battery Level */}
                        {batteryLevel !== null && (
                            <div className="flex items-center gap-2">
                                {batteryLevel < 20 ? (
                                    <BatteryLow className="w-4 h-4 text-red-400" />
                                ) : (
                                    <Battery className="w-4 h-4 text-green-400" />
                                )}
                                <span className="text-xs text-white">{batteryLevel}%</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mute Toggle */}
                        <motion.button
                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            onClick={toggleMute}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isMuted ? (
                                <VolumeX className="w-4 h-4 text-gray-400" />
                            ) : (
                                <Volume2 className="w-4 h-4 text-green-400" />
                            )}
                        </motion.button>

                        {/* PWA Install Button */}
                        {showInstallPrompt && (
                            <motion.button
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                onClick={handleInstall}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Download className="w-3 h-3" />
                                Install App
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Offline Banner */}
            <AnimatePresence>
                {!isOnline && (
                    <motion.div
                        className="fixed top-12 left-0 right-0 z-40 bg-red-500 text-white text-center py-2"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-sm font-medium">
                            You're offline. Some features may be limited.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Low Battery Warning */}
            <AnimatePresence>
                {batteryLevel !== null && batteryLevel < 20 && (
                    <motion.div
                        className="fixed bottom-20 left-4 right-4 z-40 bg-yellow-500 text-black p-3 rounded-lg shadow-lg"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <BatteryLow className="w-5 h-5" />
                            <p className="text-sm font-medium">
                                Low battery ({batteryLevel}%). Consider charging your device.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Enhanced PWA Installer with better UX
export function EnhancedPWAInstaller() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const { hapticSuccess } = useHapticFeedback();

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            hapticSuccess();
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [hapticSuccess]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            hapticSuccess();
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <motion.div
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="bg-black/95 backdrop-blur-md border border-green-500/30 rounded-xl p-4 shadow-2xl">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Download className="w-6 h-6 text-green-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">
                            Install THEFMSMKT App
                        </h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Get faster access, offline ordering, and exclusive app-only deals!
                        </p>

                        <div className="flex items-center gap-3">
                            <motion.button
                                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                                onClick={handleInstall}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Install Now
                            </motion.button>

                            <motion.button
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowPrompt(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
