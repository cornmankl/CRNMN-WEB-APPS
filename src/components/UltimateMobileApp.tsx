import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { useActionHaptics } from '../hooks/useHapticFeedback';
import { MobileHeader } from './MobileHeader';
import { MobileHeroSection } from './MobileHeroSection';
import { UltimateProductGrid } from './UltimateProductGrid';
import { MobileCart } from './MobileCart';
import { AdvancedPWA, EnhancedPWAInstaller } from './AdvancedPWA';
import { SwipeableCarousel } from './SwipeableCarousel';
import { StaggerContainer, StaggerItem, FloatingElement } from './MobileAnimations';
import { VoiceSearch } from './VoiceSearch';
import { ARProductPreview } from './ARProductPreview';
import { LiveOrderTracking } from './LiveOrderTracking';
import { SocialSharing } from './SocialSharing';
import { UserAnalytics } from './UserAnalytics';
import Iridescence from './Iridescence';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    badge?: string;
    rating?: number;
    category: string;
    isFavorite?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export function UltimateMobileApp() {
    const { isMobile, isTablet } = useResponsive();
    const haptics = useActionHaptics();
    const [activeSection, setActiveSection] = useState('home');
    const [showCart, setShowCart] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showVoiceOrdering, setShowVoiceOrdering] = useState(false);
    const [showVoiceSearch, setShowVoiceSearch] = useState(false);
    const [showARPreview, setShowARPreview] = useState(false);
    const [showLiveTracking, setShowLiveTracking] = useState(false);
    const [showSocialSharing, setShowSocialSharing] = useState(false);
    const [showUserAnalytics, setShowUserAnalytics] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState<number[]>([]);

    // Enhanced products data with all features
    const products: Product[] = [
        {
            id: 1,
            name: 'CORNMAN Classic Cup',
            description: 'Sweet corn + butter + cheese - our signature flavor',
            price: 'RM 7.90',
            badge: 'Most Popular',
            rating: 4.8,
            category: 'classic',
            isFavorite: false,
            isPopular: true,
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 2,
            name: 'Susu Pekat Classic',
            description: 'Traditional Malaysian corn with condensed milk',
            price: 'RM 8.50',
            badge: 'Local Favorite',
            rating: 4.9,
            category: 'traditional',
            isFavorite: false,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1736605406266-dbb985ef3325?w=400&h=400&fit=crop'
        },
        {
            id: 3,
            name: 'Cheddar Cheese Explosion',
            description: 'Premium corn loaded with aged cheddar cheese',
            price: 'RM 10.90',
            badge: 'Cheesy Goodness',
            rating: 4.7,
            category: 'premium',
            isFavorite: false,
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 4,
            name: 'Chocolate Delight',
            description: 'Sweet corn with rich chocolate sauce',
            price: 'RM 9.50',
            badge: 'Sweet Treat',
            rating: 4.6,
            category: 'dessert',
            isFavorite: false,
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 5,
            name: 'Spicy Jalapeño',
            description: 'Hot corn with jalapeño peppers and spices',
            price: 'RM 8.90',
            badge: 'Spicy',
            rating: 4.5,
            category: 'spicy',
            isFavorite: false,
            isNew: true,
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        },
        {
            id: 6,
            name: 'Truffle Luxury',
            description: 'Premium corn with truffle oil and parmesan',
            price: 'RM 15.90',
            badge: 'Luxury',
            rating: 4.9,
            category: 'premium',
            isFavorite: false,
            image: 'https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=400&h=400&fit=crop'
        }
    ];

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const addToCart = (product: Product, quantity: number) => {
        haptics.onAddToCart();
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
        haptics.onToggle();
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
        haptics.onRemoveFromCart();
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleFavorite = (productId: number) => {
        haptics.onToggle();
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleCheckout = () => {
        haptics.onSuccess();
        console.log('Checking out:', cartItems);
        setCartItems([]);
        setShowCart(false);
    };

    const shareProduct = (product: Product) => {
        haptics.onButtonPress();
        setSelectedProduct(product);
        setShowSocialSharing(true);
    };

    const handleVoiceSearch = (query: string) => {
        console.log('Voice search query:', query);
        // Implement voice search logic here
        haptics.onSuccess();
    };

    const handleARPreview = (product: Product) => {
        setSelectedProduct(product);
        setShowARPreview(true);
        haptics.onButtonPress();
    };

    const handleLiveTracking = () => {
        // Mock active order for demo
        setActiveOrder({
            id: 'ORD-12345',
            status: 'picked_up',
            estimatedTime: 15,
            location: { lat: 3.1390, lng: 101.6869 },
            driver: {
                name: 'Ahmad Rahman',
                phone: '+60123456789',
                rating: 4.8,
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            },
            timeline: [
                { status: 'preparing', timestamp: new Date(Date.now() - 30 * 60 * 1000), description: 'Order confirmed and being prepared' },
                { status: 'ready', timestamp: new Date(Date.now() - 15 * 60 * 1000), description: 'Order ready for pickup' },
                { status: 'picked_up', timestamp: new Date(Date.now() - 5 * 60 * 1000), description: 'Driver picked up your order' }
            ]
        });
        setShowLiveTracking(true);
        haptics.onSuccess();
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'home':
                return (
                    <div>
                        <MobileHeroSection
                            onOrderNow={() => setActiveSection('menu')}
                            onWatchVideo={() => console.log('Play video')}
                        />

                        {/* Featured Products Carousel */}
                        <div className="px-4 py-8">
                            <h2 className="mobile-heading-2 text-white mb-6">Featured Products</h2>
                            <SwipeableCarousel
                                items={products.filter(p => p.isPopular)}
                                renderItem={(product) => (
                                    <div className="px-2">
                                        <div className="mobile-card">
                                            <div className="aspect-square rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                                            <p className="text-green-400 font-bold text-lg">{product.price}</p>
                                        </div>
                                    </div>
                                )}
                                autoPlay={true}
                                autoPlayInterval={4000}
                                showDots={true}
                                showArrows={!isMobile}
                            />
                        </div>
                    </div>
                );

            case 'menu':
                return (
                    <UltimateProductGrid
                        products={products.map(p => ({ ...p, isFavorite: favorites.includes(p.id) }))}
                        onAddToCart={addToCart}
                        onToggleFavorite={toggleFavorite}
                        onShare={shareProduct}
                        onARPreview={handleARPreview}
                        onVoiceSearch={() => setShowVoiceSearch(true)}
                    />
                );

            case 'tracking':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Track Your Order</h2>
                        <StaggerContainer>
                            <StaggerItem>
                                <div className="mobile-card">
                                    <p className="text-gray-400">No active orders</p>
                                </div>
                            </StaggerItem>
                        </StaggerContainer>
                    </div>
                );

            case 'locations':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Our Locations</h2>
                        <StaggerContainer className="mobile-grid-1">
                            <StaggerItem>
                                <div className="mobile-card">
                                    <h3 className="text-white font-semibold mb-2">Klang Valley</h3>
                                    <p className="text-gray-400 text-sm mb-2">Free delivery within 30 minutes</p>
                                    <p className="text-green-400 text-sm">Open 10 AM - 10 PM</p>
                                </div>
                            </StaggerItem>
                        </StaggerContainer>
                    </div>
                );

            case 'loyalty':
                return (
                    <div className="mobile-section mobile-container">
                        <h2 className="mobile-heading-2 text-white mb-6">Loyalty Rewards</h2>
                        <StaggerContainer>
                            <StaggerItem>
                                <div className="mobile-card">
                                    <p className="text-gray-400">Earn points with every order</p>
                                </div>
                            </StaggerItem>
                        </StaggerContainer>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white mobile-safe-area relative">
            {/* Iridescence Background */}
            <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
                <Iridescence
                    color={[0.1, 0.8, 0.2]}
                    mouseReact={true}
                    amplitude={0.1}
                    speed={0.5}
                />
            </div>
            
            {/* Advanced PWA Status Bar */}
            <AdvancedPWA />

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

            {/* Enhanced PWA Installer */}
            <EnhancedPWAInstaller />

            {/* Voice Search */}
            <VoiceSearch
                isOpen={showVoiceSearch}
                onClose={() => setShowVoiceSearch(false)}
                onSearch={handleVoiceSearch}
            />

            {/* AR Product Preview */}
            {selectedProduct && (
                <ARProductPreview
                    product={selectedProduct}
                    isOpen={showARPreview}
                    onClose={() => setShowARPreview(false)}
                />
            )}

            {/* Live Order Tracking */}
            <LiveOrderTracking
                order={activeOrder}
                isOpen={showLiveTracking}
                onClose={() => setShowLiveTracking(false)}
            />

            {/* Social Sharing */}
            <SocialSharing
                product={selectedProduct}
                order={cartItems.length > 0 ? { id: 'ORD-123', total: cartTotal, items: cartItems } : undefined}
                isOpen={showSocialSharing}
                onClose={() => setShowSocialSharing(false)}
            />

            {/* User Analytics */}
            <UserAnalytics
                userId={user?.id || 'guest'}
                isOpen={showUserAnalytics}
                onClose={() => setShowUserAnalytics(false)}
            />

            {/* Floating Decorative Elements */}
            <FloatingElement
                className="fixed top-20 left-4 w-8 h-8 bg-green-500/20 rounded-full pointer-events-none"
                duration={4}
                delay={0}
            />
            <FloatingElement
                className="fixed top-32 right-8 w-6 h-6 bg-green-500/30 rounded-full pointer-events-none"
                duration={3}
                delay={1}
            />
            <FloatingElement
                className="fixed bottom-32 left-8 w-4 h-4 bg-green-500/40 rounded-full pointer-events-none"
                duration={5}
                delay={2}
            />

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
