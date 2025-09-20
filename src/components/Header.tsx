import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Building2 } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import { AuthDebugPanel } from './AuthDebugPanel';
import { LanguageSelector, useTranslation } from './LanguageSelector';
import { PushNotificationManager } from './PushNotificationManager';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartCount: number;
  setShowCart: (show: boolean) => void;
  user: any;
  setShowAuth: (show: boolean) => void;
  activeOrder: any;
  signOut?: () => void;
  setShowVoiceOrdering: (show: boolean) => void;
}

export function Header({ 
  activeSection, 
  setActiveSection, 
  cartCount, 
  setShowCart, 
  user, 
  setShowAuth,
  activeOrder,
  signOut,
  setShowVoiceOrdering
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  
  // Show debug panel in development or when ?debug=true
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.search.includes('debug=true');

  return (
    <motion.header 
      className="sticky top-0 z-40 backdrop-blur bg-black/90 border-b border-[var(--neutral-800)]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button 
          className="flex items-center gap-3" 
          onClick={() => setActiveSection('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="h-10 w-10 rounded-full neon-bg"
            animate={{
              boxShadow: [
                '0 0 10px rgba(57, 255, 20, 0.3)',
                '0 0 20px rgba(57, 255, 20, 0.6)',
                '0 0 10px rgba(57, 255, 20, 0.3)'
              ],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div>
            <motion.p 
              className="text-sm tracking-[0.3em] neon-text font-semibold"
              animate={{
                textShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.5)',
                  '0 0 10px rgba(57, 255, 20, 0.8)',
                  '0 0 5px rgba(57, 255, 20, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              THEFMSMKT
            </motion.p>
            <p className="text-xs text-[var(--neutral-400)]">CMNTYPLX · CORNMAN</p>
          </div>
        </motion.button>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'home' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('home')}
          >
            {t('nav.home')}
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'menu' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('menu')}
          >
            {t('nav.menu')}
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'catering' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('catering')}
          >
            <Building2 className="w-4 h-4 mr-1 inline" />
            Catering
          </button>
          <button
            className={`hover:text-[var(--neutral-300)] transition-colors ${
              activeSection === 'locations' ? 'neon-text font-semibold' : ''
            }`}
            onClick={() => setActiveSection('locations')}
          >
            {t('nav.locations')}
          </button>
          {user && (
            <button
              className={`hover:text-[var(--neutral-300)] transition-colors flex items-center gap-1 ${
                activeSection === 'loyalty' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => setActiveSection('loyalty')}
            >
              <span className="material-icons text-sm">stars</span>
              {t('nav.loyalty')}
            </button>
          )}
          {activeOrder && (
            <button
              className={`hover:text-[var(--neutral-300)] transition-colors flex items-center gap-1 ${
                activeSection === 'tracking' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => setActiveSection('tracking')}
            >
              <span className="material-icons text-sm">delivery_dining</span>
              {t('nav.tracking')}
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Voice Ordering Button */}
          <motion.button 
            className="p-2 rounded-full hover:bg-[var(--neutral-800)] relative transition-colors"
            onClick={() => setShowVoiceOrdering(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Voice Ordering"
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Push Notifications */}
          {user && <PushNotificationManager user={user} />}

          {/* Language Selector */}
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
            className="hidden sm:block"
          />

          {/* Cart Button */}
          <motion.button 
            className="p-2 rounded-full hover:bg-[var(--neutral-800)] relative transition-colors"
            onClick={() => setShowCart(true)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="material-icons"
              animate={cartCount > 0 ? {
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5, repeat: cartCount > 0 ? Infinity : 0, repeatDelay: 2 }}
            >
              shopping_cart
            </motion.span>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--neon-green)] text-black text-xs rounded-full flex items-center justify-center font-bold"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    boxShadow: [
                      '0 0 10px rgba(57, 255, 20, 0.5)',
                      '0 0 15px rgba(57, 255, 20, 0.8)',
                      '0 0 10px rgba(57, 255, 20, 0.5)'
                    ]
                  }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200,
                    boxShadow: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User Menu */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 relative">
              <div className="flex items-center gap-3">
                <button
                  className={`hover:text-[var(--neutral-300)] transition-colors ${
                    activeSection === 'profile' ? 'neon-text' : ''
                  }`}
                  onClick={() => setActiveSection('profile')}
                >
                  <div className="h-8 w-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center font-bold">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      user.name?.charAt(0) || 'U'
                    )}
                  </div>
                </button>
                {signOut && (
                  <button
                    className="text-[var(--neutral-400)] hover:text-white transition-colors p-1"
                    onClick={signOut}
                    title="Sign Out"
                  >
                    <span className="material-icons text-sm">logout</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <AnimatedButton 
              variant="neon"
              size="sm"
              glow={true}
              className="hidden sm:block"
              onClick={() => setShowAuth(true)}
              icon={<span className="material-icons text-sm">login</span>}
            >
              Sign In
            </AnimatedButton>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-icons">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            className="md:hidden pb-4 border-t border-[var(--neutral-800)] px-4 bg-black/95"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
          <div className="flex flex-col gap-3 pt-3">
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'home' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('home');
                setIsMenuOpen(false);
              }}
            >
              Home
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'menu' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('menu');
                setIsMenuOpen(false);
              }}
            >
              Menu
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'catering' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('catering');
                setIsMenuOpen(false);
              }}
            >
              <Building2 className="w-4 h-4 mr-1 inline" />
              Catering
            </button>
            <button
              className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                activeSection === 'locations' ? 'neon-text font-semibold' : ''
              }`}
              onClick={() => {
                setActiveSection('locations');
                setIsMenuOpen(false);
              }}
            >
              Locations
            </button>
            {activeOrder && (
              <button
                className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                  activeSection === 'tracking' ? 'neon-text font-semibold' : ''
                }`}
                onClick={() => {
                  setActiveSection('tracking');
                  setIsMenuOpen(false);
                }}
              >
                Track Order
              </button>
            )}
            {user && (
              <>
                <button
                  className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                    activeSection === 'loyalty' ? 'neon-text font-semibold' : ''
                  }`}
                  onClick={() => {
                    setActiveSection('loyalty');
                    setIsMenuOpen(false);
                  }}
                >
                  Rewards
                </button>
                <button
                  className={`text-left py-2 hover:text-[var(--neutral-300)] transition-colors ${
                    activeSection === 'profile' ? 'neon-text font-semibold' : ''
                  }`}
                  onClick={() => {
                    setActiveSection('profile');
                    setIsMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                {signOut && (
                  <button
                    className="text-left py-2 text-[var(--neutral-400)] hover:text-white transition-colors"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                )}
              </>
            )}
            {!user && (
              <AnimatedButton 
                variant="neon"
                size="sm"
                glow={true}
                className="w-fit mt-2"
                onClick={() => {
                  setShowAuth(true);
                  setIsMenuOpen(false);
                }}
                icon={<span className="material-icons text-sm">login</span>}
              >
                Sign In
              </AnimatedButton>
            )}
          </div>
        </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}