import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { LocationsSection } from './components/LocationsSection';
import { ProfileSection } from './components/ProfileSection';
import { CartSheet } from './components/CartSheet';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { RecommendationEngine } from './components/RecommendationEngine';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { LoyaltyProgram } from './components/LoyaltyProgram';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PromotionalBanner } from './components/PromotionalBanner';
import { DeliveryAreaMap } from './components/DeliveryAreaMap';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDashboardEnhanced } from './components/AdminDashboardEnhanced';
import { SettingsManager } from './components/SettingsManager';
import { RealTimeMonitoring } from './components/RealTimeMonitoring';
import { InventoryManagement } from './components/InventoryManagement';
import { DriverManagement } from './components/DriverManagement';
import { ReportingSystem } from './components/ReportingSystem';
import { AdminNavigation } from './components/AdminNavigation';
import { SEOHead, defaultStructuredData } from './components/SEOHead';
import { PWAInstaller, PWAUpdateNotifier } from './components/PWAInstaller';
import { VoiceOrdering } from './components/VoiceOrdering';
import { TranslationProvider, LanguageSelector, useTranslation } from './components/LanguageSelector';
import { PaymentGateway } from './components/PaymentGateway';
import { PushNotificationManager } from './components/PushNotificationManager';
import { CorporateCatering } from './components/CorporateCatering';
import { useAuth } from './hooks/useAuth';
import { useResponsive } from './hooks/useResponsive';
import { UltimateMobileApp } from './components/UltimateMobileApp';
import { MusicToggle } from './components/MusicToggle';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showVoiceOrdering, setShowVoiceOrdering] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [orderHistory, setOrderHistory] = useState([
    { id: 1, name: 'CORNMAN Classic Cup', price: 'RM 7.90', category: 'classic', date: '2024-01-15' },
    { id: 2, name: 'Chocolate Corn Delight', price: 'RM 9.50', category: 'dessert', date: '2024-01-10' },
    { id: 3, name: 'Susu Pekat Classic', price: 'RM 8.50', category: 'traditional', date: '2024-01-08' }
  ]);

  const { user, loading, setUser, signOut } = useAuth();
  const { isMobile, isTablet } = useResponsive();

  // Use Ultimate Mobile App for mobile devices
  if (isMobile || isTablet) {
    return (
      <TranslationProvider>
        <UltimateMobileApp />
        <Toaster />
      </TranslationProvider>
    );
  }

  // Use Enhanced Admin Dashboard for admin users
  if (user?.is_admin) {
    return (
      <TranslationProvider>
        <div className="min-h-screen bg-gray-900 flex">
          <AdminNavigation 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            user={user}
            onSignOut={signOut}
          />
          <div className="flex-1 lg:ml-64">
            {activeSection === 'admin' && <AdminDashboardEnhanced />}
            {activeSection === 'dashboard' && <AdminDashboardEnhanced />}
            {activeSection === 'monitoring' && <RealTimeMonitoring />}
            {activeSection === 'inventory' && <InventoryManagement />}
            {activeSection === 'drivers' && <DriverManagement />}
            {activeSection === 'reports' && <ReportingSystem />}
            {activeSection === 'settings' && <SettingsManager />}
          </div>
        </div>
        <Toaster />
      </TranslationProvider>
    );
  }

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id, quantity) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('RM ', ''));
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Payment success handler
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    clearCart();
    const orderId = `ord_${Date.now()}`;
    setActiveOrder({ id: orderId, status: 'preparing' });
    setTrackingOrderId(orderId);
    setShowLiveTracking(true);
    setShowPaymentGateway(false);
  };

  // Payment error handler
  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />
            <PromotionalBanner />
            {user && (
              <RecommendationEngine
                user={user}
                orderHistory={orderHistory}
                currentCart={cartItems}
                addToCart={addToCart}
              />
            )}
            <TestimonialsSection />
            <DeliveryAreaMap />
          </>
        );
      case 'menu':
        return <MenuSection addToCart={addToCart} />;
      case 'tracking':
        return <OrderTrackingSection activeOrder={activeOrder} />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} />;
      case 'loyalty':
        return <LoyaltyProgram user={user} orderHistory={orderHistory} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'catering':
        return <CorporateCatering />;
      default:
        return <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-black)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--neutral-400)]">Loading THEFMSMKT...</p>
        </div>
      </div>
    );
  }

  return (
    <TranslationProvider>
      <AppContent
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showCart={showCart}
        setShowCart={setShowCart}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        showVoiceOrdering={showVoiceOrdering}
        setShowVoiceOrdering={setShowVoiceOrdering}
        showPaymentGateway={showPaymentGateway}
        setShowPaymentGateway={setShowPaymentGateway}
        cartItems={cartItems}
        setCartItems={setCartItems}
        activeOrder={activeOrder}
        setActiveOrder={setActiveOrder}
        showLiveTracking={showLiveTracking}
        setShowLiveTracking={setShowLiveTracking}
        trackingOrderId={trackingOrderId}
        setTrackingOrderId={setTrackingOrderId}
        orderHistory={orderHistory}
        user={user}
        loading={loading}
        setUser={setUser}
        signOut={signOut}
        addToCart={addToCart}
        updateCartItem={updateCartItem}
        clearCart={clearCart}
        cartTotal={cartTotal}
        cartCount={cartCount}
        handlePaymentSuccess={handlePaymentSuccess}
        handlePaymentError={handlePaymentError}
      />
    </TranslationProvider>
  );
}

function AppContent({
  activeSection, setActiveSection, showCart, setShowCart, showAuth, setShowAuth,
  showVoiceOrdering, setShowVoiceOrdering, showPaymentGateway, setShowPaymentGateway,
  cartItems, setCartItems, activeOrder, setActiveOrder, showLiveTracking, setShowLiveTracking,
  trackingOrderId, setTrackingOrderId, orderHistory, user, loading, setUser, signOut,
  addToCart, updateCartItem, clearCart, cartTotal, cartCount, handlePaymentSuccess, handlePaymentError
}: any) {
  const { t } = useTranslation();

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />
            <PromotionalBanner />
            {user && (
              <RecommendationEngine
                user={user}
                orderHistory={orderHistory}
                currentCart={cartItems}
                addToCart={addToCart}
              />
            )}
            <TestimonialsSection />
            <DeliveryAreaMap />
          </>
        );
      case 'menu':
        return <MenuSection addToCart={addToCart} />;
      case 'tracking':
        return <OrderTrackingSection activeOrder={activeOrder} />;
      case 'locations':
        return <LocationsSection />;
      case 'profile':
        return <ProfileSection user={user} />;
      case 'loyalty':
        return <LoyaltyProgram user={user} orderHistory={orderHistory} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'catering':
        return <CorporateCatering />;
      default:
        return <HeroSection setActiveSection={setActiveSection} addToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
      <SEOHead
        title="THEFMSMKT CMNTYPLX - Premium Gourmet Corn Street Food Delivery Malaysia"
        description="Order premium gourmet corn snacks with 4 irresistible flavors: Chocolate, Cheddar Cheese, Susu Pekat & Caramel. Fast delivery across Klang Valley."
        structuredData={defaultStructuredData}
      />

      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cartCount={cartCount}
        setShowCart={setShowCart}
        user={user}
        setShowAuth={setShowAuth}
        activeOrder={activeOrder}
        signOut={signOut}
        setShowVoiceOrdering={setShowVoiceOrdering}
      />

      <main>
        {renderSection()}
      </main>

      <Footer />

      <CartSheet
        open={showCart}
        onOpenChange={setShowCart}
        items={cartItems}
        updateItem={updateCartItem}
        total={cartTotal}
        clearCart={clearCart}
        setActiveOrder={setActiveOrder}
        onOrderPlaced={(orderId) => {
          setTrackingOrderId(orderId);
          setShowLiveTracking(true);
        }}
        onCheckout={() => {
          setShowCart(false);
          setShowPaymentGateway(true);
        }}
      />

      <AuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        setUser={setUser}
      />

      {showLiveTracking && (
        <LiveOrderTracking
          orderId={trackingOrderId}
          onClose={() => setShowLiveTracking(false)}
        />
      )}

      <VoiceOrdering
        addToCart={addToCart}
        isOpen={showVoiceOrdering}
        onClose={() => setShowVoiceOrdering(false)}
      />

      <PaymentGateway
        isOpen={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        amount={cartTotal}
        cartItems={cartItems}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />

      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--neutral-900)',
            border: '1px solid var(--neutral-800)',
            color: 'var(--brand-white)',
          },
        }}
      />

      <PWAInstaller />
      <PWAUpdateNotifier />
      
      {/* Music Player */}
      <MusicToggle />
    </div>
  );
}
