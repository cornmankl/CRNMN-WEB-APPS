import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { MobileHeader } from './MobileHeader';
import { MobileHeroSection } from './MobileHeroSection';
import { MobileProductGrid } from './MobileProductGrid';
import { MobileCart } from './MobileCart';
import { PWAInstaller } from './PWAInstaller';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    badge?: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export function MobileFirstApp() {
    const { isMobile, isTablet } = useResponsive();
    const [activeSection, setActiveSection] = useState('home');
    const [showCart, setShowCart] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showVoiceOrdering, setShowVoiceOrdering] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [user, setUser] = useState(null);

    // Sample products data
    const products: Product[] = [
        {
            id: 1,
            name: 'CORNMAN Classic Cup',
            description: 'Sweet corn + butter + cheese',
            price: 'RM 7.90',
            badge: 'Most Popular',
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 2,
            name: 'Susu Pekat Classic',
            description: 'Traditional Malaysian corn with condensed milk',
            price: 'RM 8.50',
            badge: 'Local Favorite',
            image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?w=400&h=400&fit=crop'
        },
        {
            id: 3,
            name: 'Cheddar Cheese Explosion',
            description: 'Premium corn loaded with aged cheddar cheese',
            price: 'RM 10.90',
            badge: 'Cheesy Goodness',
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 4,
            name: 'Chocolate Delight',
            description: 'Sweet corn with rich chocolate sauce',
            price: 'RM 9.50',
            badge: 'Sweet Treat',
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        }
    ];

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const addToCart = (product: Product, quantity: number) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            );
        } else {
            setCartItems(prev => [...prev, {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price.replace('RM ', '')),
                quantity,
                image: product.image
            }]);
        }
    };

    const updateCartItem = (id: number, quantity: number) => {
        if (quantity <= 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        }
    };

    const removeCartItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        // Implement checkout logic
        console.log('Checking out:', cartItems);
        setCartItems([]);
        setShowCart(false);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'home':
                return (
                    <MobileHeroSection
                        onOrderNow={() => setActiveSection('menu')}
                        onWatchVideo={() => console.log('Play video')}
                    />
                );
            case 'menu':
                return (
                    <MobileProductGrid
                        products={products}
                        onAddToCart={addToCart}
                        onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
                    />
                );
            case 'tracking':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Track Your Order</h2>
                        <div className="mobile-card">
                            <p className="text-gray-400">No active orders</p>
                        </div>
                    </div>
                );
            case 'locations':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Our Locations</h2>
                        <div className="mobile-grid-1">
                            <div className="mobile-card">
                                <h3 className="text-white font-semibold mb-2">Klang Valley</h3>
                                <p className="text-gray-400 text-sm">Free delivery within 30 minutes</p>
                            </div>
                        </div>
                    </div>
                );
            case 'loyalty':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Loyalty Rewards</h2>
                        <div className="mobile-card">
                            <p className="text-gray-400">Earn points with every order</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white mobile-safe-area">
            {/* Mobile Header */}
            <MobileHeader
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                cartCount={cartCount}
                setShowCart={setShowCart}
                user={user}
                setShowAuth={setShowAuth}
                setShowVoiceOrdering={setShowVoiceOrdering}
                signOut={() => setUser(null)}
            />

            {/* Main Content */}
            <main className="pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderSection()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Mobile Cart */}
            <MobileCart
                isOpen={showCart}
                onClose={() => setShowCart(false)}
                items={cartItems}
                total={cartTotal}
                onUpdateQuantity={updateCartItem}
                onRemoveItem={removeCartItem}
                onCheckout={handleCheckout}
            />

            {/* PWA Installer */}
            <PWAInstaller />

            {/* Loading States */}
            <AnimatePresence>
                {false && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-gray-900 rounded-lg p-6 text-center">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white">Loading...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
