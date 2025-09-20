import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Mic, MapPin } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { AnimatedButton } from './AnimatedButton';

interface MobileHeaderProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    cartCount: number;
    setShowCart: (show: boolean) => void;
    user: any;
    setShowAuth: (show: boolean) => void;
    setShowVoiceOrdering: (show: boolean) => void;
    signOut?: () => void;
}

export function MobileHeader({
    activeSection,
    setActiveSection,
    cartCount,
    setShowCart,
    user,
    setShowAuth,
    setShowVoiceOrdering,
    signOut
}: MobileHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isMobile, isTablet } = useResponsive();

    // Handle scroll for header background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigationItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'menu', label: 'Menu', icon: '🍿' },
        { id: 'tracking', label: 'Track', icon: '📍' },
        { id: 'locations', label: 'Stores', icon: '🏪' },
        { id: 'loyalty', label: 'Rewards', icon: '🎁' }
    ];

    return (
        <>
            {/* Mobile Header */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-black/95 backdrop-blur-md border-b border-green-500/20'
                        : 'bg-black/80 backdrop-blur-sm'
                    }`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.button
                            className="flex items-center gap-2"
                            onClick={() => setActiveSection('home')}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-sm">🌽</span>
                            </div>
                            <span className="text-white font-bold text-lg">THEFMSMKT</span>
                        </motion.button>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Voice Ordering */}
                            <motion.button
                                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                onClick={() => setShowVoiceOrdering(true)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Mic className="w-5 h-5 text-green-400" />
                            </motion.button>

                            {/* Cart */}
                            <motion.button
                                className="relative p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                onClick={() => setShowCart(true)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ShoppingCart className="w-5 h-5 text-green-400" />
                                {cartCount > 0 && (
                                    <motion.span
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* User Auth */}
                            <motion.button
                                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                onClick={() => user ? signOut?.() : setShowAuth(true)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <User className="w-5 h-5 text-green-400" />
                            </motion.button>

                            {/* Menu Toggle */}
                            <motion.button
                                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isMenuOpen ? <X className="w-5 h-5 text-green-400" /> : <Menu className="w-5 h-5 text-green-400" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            className="border-t border-green-500/20 bg-black/95 backdrop-blur-md"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigationItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeSection === item.id
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'hover:bg-green-500/10 text-white'
                                            }`}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsMenuOpen(false);
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Bottom Navigation for Mobile */}
            {isMobile && (
                <motion.nav
                    className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-green-500/20"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="flex items-center justify-around py-2">
                        {navigationItems.slice(0, 4).map((item) => (
                            <motion.button
                                key={item.id}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${activeSection === item.id
                                        ? 'text-green-400'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => setActiveSection(item.id)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-xs font-medium">{item.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.nav>
            )}

            {/* Spacer for fixed header */}
            <div className="h-16" />
            {isMobile && <div className="h-16" />}
        </>
    );
}
