import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    flag: '🇲🇾'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳'
  }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  className = '' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-[var(--neutral-700)] hover:border-[var(--neutral-600)]"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.nativeName}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 min-w-48"
            >
              <Card className="p-2 bg-[var(--neutral-900)] border-[var(--neutral-800)] shadow-2xl">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${currentLanguage === language.code 
                        ? 'bg-[var(--neon-green)]/10 text-[var(--neon-green)]' 
                        : 'hover:bg-[var(--neutral-800)] text-[var(--neutral-300)]'
                      }
                    `}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-[var(--neutral-500)]">{language.name}</div>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4 text-[var(--neon-green)]" />
                    )}
                  </button>
                ))}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Translation context and hook
import { createContext, useContext, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.tracking': 'Track Order',
    'nav.locations': 'Locations',
    'nav.profile': 'Profile',
    'nav.loyalty': 'Loyalty',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.title': 'Premium Gourmet Corn',
    'hero.subtitle': 'Street Food Redefined',
    'hero.description': 'Experience the authentic taste of Malaysian street food with our premium gourmet corn varieties. Freshly prepared, delivered hot to your doorstep.',
    'hero.orderNow': 'Order Now',
    'hero.exploreMenu': 'Explore Menu',
    
    // Menu
    'menu.title': 'Our Signature Flavors',
    'menu.chocolate': 'Chocolate Corn Delight',
    'menu.chocolate.desc': 'Premium corn kernels coated with rich chocolate flavor',
    'menu.cheddar': 'Cheddar Cheese Classic',
    'menu.cheddar.desc': 'Crispy corn with authentic cheddar cheese coating',
    'menu.susu': 'Susu Pekat Traditional',
    'menu.susu.desc': 'Local favorite with sweet condensed milk flavor',
    'menu.caramel': 'Caramel Crunch',
    'menu.caramel.desc': 'Sweet caramel coating on perfectly roasted corn',
    
    // Cart
    'cart.title': 'Your Order',
    'cart.empty': 'Your cart is empty',
    'cart.addMore': 'Add more items',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Voice Ordering
    'voice.title': 'Voice Ordering',
    'voice.description': 'Say your order naturally',
    'voice.startListening': 'Start Listening',
    'voice.stopListening': 'Stop Listening',
    'voice.listening': 'Listening...',
    'voice.processing': 'Processing order...',
    'voice.recognized': 'Order recognized!',
    'voice.tryAgain': 'Please try again',
    
    // Loyalty Program
    'loyalty.title': 'THEFMSMKT Rewards',
    'loyalty.points': 'Points',
    'loyalty.tier': 'Tier',
    'loyalty.nextReward': 'Next Reward',
    'loyalty.redeem': 'Redeem',
    
    // Order Tracking
    'tracking.title': 'Track Your Order',
    'tracking.preparing': 'Preparing',
    'tracking.cooking': 'Cooking',
    'tracking.ready': 'Ready for Pickup',
    'tracking.delivering': 'Out for Delivery',
    'tracking.delivered': 'Delivered'
  },
  
  ms: {
    // Navigation
    'nav.home': 'Laman Utama',
    'nav.menu': 'Menu',
    'nav.tracking': 'Jejak Pesanan',
    'nav.locations': 'Lokasi',
    'nav.profile': 'Profil',
    'nav.loyalty': 'Kesetiaan',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.title': 'Jagung Gourmet Premium',
    'hero.subtitle': 'Makanan Jalanan Ditakrifkan Semula',
    'hero.description': 'Rasai cita rasa autentik makanan jalanan Malaysia dengan pelbagai jagung gourmet premium kami. Disediakan segar, dihantar panas ke depan pintu anda.',
    'hero.orderNow': 'Pesan Sekarang',
    'hero.exploreMenu': 'Terokai Menu',
    
    // Menu
    'menu.title': 'Perisa Istimewa Kami',
    'menu.chocolate': 'Jagung Coklat Istimewa',
    'menu.chocolate.desc': 'Biji jagung premium disalut dengan perisa coklat yang kaya',
    'menu.cheddar': 'Keju Cheddar Klasik',
    'menu.cheddar.desc': 'Jagung rangup dengan salutan keju cheddar tulen',
    'menu.susu': 'Susu Pekat Tradisional',
    'menu.susu.desc': 'Kegemaran tempatan dengan perisa susu pekat manis',
    'menu.caramel': 'Karamel Rangup',
    'menu.caramel.desc': 'Salutan karamel manis pada jagung yang dipanggang sempurna',
    
    // Cart
    'cart.title': 'Pesanan Anda',
    'cart.empty': 'Troli anda kosong',
    'cart.addMore': 'Tambah lagi item',
    'cart.total': 'Jumlah',
    'cart.checkout': 'Bayar',
    'cart.remove': 'Buang',
    
    // Common
    'common.loading': 'Memuatkan...',
    'common.error': 'Ralat berlaku',
    'common.success': 'Berjaya!',
    'common.cancel': 'Batal',
    'common.confirm': 'Sahkan',
    'common.close': 'Tutup',
    'common.save': 'Simpan',
    'common.edit': 'Edit',
    'common.delete': 'Padam',
    
    // Voice Ordering
    'voice.title': 'Pesanan Suara',
    'voice.description': 'Sebut pesanan anda secara semula jadi',
    'voice.startListening': 'Mula Mendengar',
    'voice.stopListening': 'Berhenti Mendengar',
    'voice.listening': 'Mendengar...',
    'voice.processing': 'Memproses pesanan...',
    'voice.recognized': 'Pesanan dikenali!',
    'voice.tryAgain': 'Sila cuba lagi',
    
    // Loyalty Program
    'loyalty.title': 'Ganjaran THEFMSMKT',
    'loyalty.points': 'Mata',
    'loyalty.tier': 'Peringkat',
    'loyalty.nextReward': 'Ganjaran Seterusnya',
    'loyalty.redeem': 'Tebus',
    
    // Order Tracking
    'tracking.title': 'Jejak Pesanan Anda',
    'tracking.preparing': 'Menyediakan',
    'tracking.cooking': 'Memasak',
    'tracking.ready': 'Sedia untuk Diambil',
    'tracking.delivering': 'Sedang Dihantar',
    'tracking.delivered': 'Telah Dihantar'
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.menu': '菜单',
    'nav.tracking': '追踪订单',
    'nav.locations': '地点',
    'nav.profile': '个人资料',
    'nav.loyalty': '忠诚度',
    'nav.admin': '管理',
    
    // Hero Section
    'hero.title': '优质美食玉米',
    'hero.subtitle': '街头美食重新定义',
    'hero.description': '体验正宗的马来西亚街头美食，品尝我们优质美食玉米的多种口味。新鲜制作，热腾腾送到您家门口。',
    'hero.orderNow': '立即订购',
    'hero.exploreMenu': '探索菜单',
    
    // Menu
    'menu.title': '我们的招牌口味',
    'menu.chocolate': '巧克力玉米美味',
    'menu.chocolate.desc': '优质玉米粒配丰富巧克力味',
    'menu.cheddar': '经典切达奶酪',
    'menu.cheddar.desc': '脆玉米配正宗切达奶酪涂层',
    'menu.susu': '传统炼乳',
    'menu.susu.desc': '当地最爱的甜炼乳口味',
    'menu.caramel': '焦糖脆',
    'menu.caramel.desc': '完美烘烤玉米配甜焦糖涂层',
    
    // Cart
    'cart.title': '您的订单',
    'cart.empty': '购物车为空',
    'cart.addMore': '添加更多商品',
    'cart.total': '总计',
    'cart.checkout': '结账',
    'cart.remove': '移除',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '成功！',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.close': '关闭',
    'common.save': '保存',
    'common.edit': '编辑',
    'common.delete': '删除',
    
    // Voice Ordering
    'voice.title': '语音订购',
    'voice.description': '自然地说出您的订单',
    'voice.startListening': '开始聆听',
    'voice.stopListening': '停止聆听',
    'voice.listening': '聆听中...',
    'voice.processing': '处理订单中...',
    'voice.recognized': '订单已识别！',
    'voice.tryAgain': '请重试',
    
    // Loyalty Program
    'loyalty.title': 'THEFMSMKT 奖励',
    'loyalty.points': '积分',
    'loyalty.tier': '等级',
    'loyalty.nextReward': '下一个奖励',
    'loyalty.redeem': '兑换',
    
    // Order Tracking
    'tracking.title': '追踪您的订单',
    'tracking.preparing': '准备中',
    'tracking.cooking': '烹饪中',
    'tracking.ready': '准备取货',
    'tracking.delivering': '配送中',
    'tracking.delivered': '已送达'
  },
  
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.menu': 'மெனு',
    'nav.tracking': 'ஆர்டர் ட்ராக்',
    'nav.locations': 'இடங்கள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.loyalty': 'விசுவாசம்',
    'nav.admin': 'நிர்வாகி',
    
    // Hero Section
    'hero.title': 'பிரீமியம் கோர்ன்',
    'hero.subtitle': 'தெரு உணவு மறுவரையறை',
    'hero.description': 'எங்கள் பிரீமியம் கோர்ன் வகைகளுடன் உண்மையான மலேசிய தெரு உணவின் சுவையை அனுபவிக்கவும். புதிதாக தயாரிக்கப்பட்டு, உங்கள் வீட்டு வாசலுக்கு சூடாக வழங்கப்படுகிறது.',
    'hero.orderNow': 'இப்போது ஆர்டர் செய்யுங்கள்',
    'hero.exploreMenu': 'மெனுவை ஆராயுங்கள்',
    
    // Menu
    'menu.title': 'எங்கள் சிறப்பு சுவைகள்',
    'menu.chocolate': 'சாக்லேட் கோர்ன் டிலைட்',
    'menu.chocolate.desc': 'பணக்கார சாக்லேட் சுவையுடன் பிரீமியம் கோர்ன்',
    'menu.cheddar': 'செடார் சீஸ் கிளாசிக்',
    'menu.cheddar.desc': 'உண்மையான செடார் சீஸ் கோட்டிங்குடன் மொறுமொறுப்பான கோர்ன்',
    'menu.susu': 'சுசு பெகாத் பாரம்பரியம்',
    'menu.susu.desc': 'இனிப்பு கண்டென்ஸ்ட் மில்க் சுவையுடன் உள்ளூர் பிடித்தது',
    'menu.caramel': 'கேரமல் க்ரஞ்ச்',
    'menu.caramel.desc': 'சரியாக வறுத்த கோர்ன் மீது இனிப்பு கேரமல் கோட்டிங்',
    
    // Cart
    'cart.title': 'உங்கள் ஆர்டர்',
    'cart.empty': 'உங்கள் கார்ட் காலியாக உள்ளது',
    'cart.addMore': 'மேலும் பொருட்களைச் சேர்க்கவும்',
    'cart.total': 'மொத்தம்',
    'cart.checkout': 'செக்அவுட்',
    'cart.remove': 'அகற்று',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை ஏற்பட்டது',
    'common.success': 'வெற்றி!',
    'common.cancel': 'ரத்து செய்',
    'common.confirm': 'உறுதிப்படுத்து',
    'common.close': 'மூடு',
    'common.save': 'சேமி',
    'common.edit': 'திருத்து',
    'common.delete': 'நீக்கு',
    
    // Voice Ordering
    'voice.title': 'குரல் ஆர்டரிங்',
    'voice.description': 'உங்கள் ஆர்டரை இயல்பாகச் சொல்லுங்கள்',
    'voice.startListening': 'கேட்க ஆரம்பிக்கவும்',
    'voice.stopListening': 'கேட்பதை நிறுத்தவும்',
    'voice.listening': 'கேட்கிறது...',
    'voice.processing': 'ஆர்டரை செயலாக்குகிறது...',
    'voice.recognized': 'ஆர்டர் அங்கீகரிக்கப்பட்டது!',
    'voice.tryAgain': 'தயவுசெய்து மீண்டும் முயற்சிக்கவும்',
    
    // Loyalty Program
    'loyalty.title': 'THEFMSMKT வெகுமதிகள்',
    'loyalty.points': 'புள்ளிகள்',
    'loyalty.tier': 'அடுக்கு',
    'loyalty.nextReward': 'அடுத்த வெகுமதி',
    'loyalty.redeem': 'மீட்டெடுக்கவும்',
    
    // Order Tracking
    'tracking.title': 'உங்கள் ஆர்டரை கண்காணிக்கவும்',
    'tracking.preparing': 'தயாரிக்கிறது',
    'tracking.cooking': 'சமைக்கிறது',
    'tracking.ready': 'எடுக்க தயார்',
    'tracking.delivering': 'வழங்குகிறது',
    'tracking.delivered': 'வழங்கப்பட்டது'
  }
};

const TranslationContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => {
    // Try to get from localStorage first
    const saved = localStorage.getItem('thefmsmkt-language');
    if (saved && translations[saved]) {
      return saved;
    }
    
    // Then try browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('thefmsmkt-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}