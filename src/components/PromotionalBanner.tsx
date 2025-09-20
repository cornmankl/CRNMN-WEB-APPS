import { motion } from 'framer-motion';
import { Clock, Zap, Gift, Percent } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

const promotions = [
  {
    id: 1,
    title: 'FLASH SALE 24 JAM!',
    subtitle: 'Diskaun hingga 40% untuk semua variant',
    description: 'Beli 2 Free 1 untuk Chocolate & Cheddar Cheese variant',
    discount: '40%',
    timeLeft: 86400, // 24 hours in seconds
    type: 'flash',
    color: 'from-red-600 to-red-500',
    icon: Zap,
    buttonText: 'Grab Now!',
    originalPrice: 'RM 23.70',
    salePrice: 'RM 14.22'
  },
  {
    id: 2,
    title: 'WEEKEND SPECIAL',
    subtitle: 'Free delivery untuk order RM 30 ke atas',
    description: 'Berakhir hari Ahad tengah malam',
    discount: 'FREE',
    timeLeft: 172800, // 48 hours
    type: 'weekend',
    color: 'from-[var(--neon-green)] to-green-400',
    icon: Gift,
    buttonText: 'Order Sekarang',
    tag: 'POPULAR'
  },
  {
    id: 3,
    title: 'NEW CUSTOMER',
    subtitle: 'Welcome bonus untuk first-time buyer',
    description: 'Kod: WELCOME2024 - Valid untuk 7 hari',
    discount: '25%',
    timeLeft: 604800, // 7 days
    type: 'newbie',
    color: 'from-purple-600 to-purple-500',
    icon: Percent,
    buttonText: 'Claim Bonus',
    tag: 'NEW'
  }
];

export function PromotionalBanner() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(promotions[0].timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo(prev => (prev + 1) % promotions.length);
    }, 8000); // Change promo every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time = formatTime(timeLeft);
  const promo = promotions[currentPromo];
  const Icon = promo.icon;

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <motion.div
        key={currentPromo}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <Card className={`relative p-8 bg-gradient-to-r ${promo.color} border-0 shadow-2xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                <Icon className="w-6 h-6 text-white" />
                {promo.tag && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                    {promo.tag}
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {promo.title}
              </h3>
              
              <p className="text-white/90 text-lg mb-2">{promo.subtitle}</p>
              <p className="text-white/80 text-sm">{promo.description}</p>

              {promo.originalPrice && (
                <div className="flex items-center gap-3 justify-center lg:justify-start mt-4">
                  <span className="text-white/60 line-through text-lg">{promo.originalPrice}</span>
                  <span className="text-white font-bold text-2xl">{promo.salePrice}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold text-white mb-2">
                  {promo.discount}
                  {promo.discount !== 'FREE' && <span className="text-2xl">OFF</span>}
                </div>
                
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <Clock className="w-4 h-4 text-white" />
                  <div className="flex gap-1 text-white font-mono">
                    <span className="bg-white/30 px-2 py-1 rounded text-sm">{time.hours}</span>
                    <span>:</span>
                    <span className="bg-white/30 px-2 py-1 rounded text-sm">{time.minutes}</span>
                    <span>:</span>
                    <span className="bg-white/30 px-2 py-1 rounded text-sm">{time.seconds}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {promo.buttonText}
              </Button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPromo 
                    ? 'bg-white w-6' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Additional Small Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-4 bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--neon-green)]/10 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-[var(--neon-green)]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Loyalty Points</h4>
                <p className="text-sm text-[var(--neutral-400)]">Earn 2x points untuk setiap purchase</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-4 bg-gradient-to-r from-[var(--neutral-900)] to-[var(--neutral-800)] border-[var(--neutral-700)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">Express Delivery</h4>
                <p className="text-sm text-[var(--neutral-400)]">15 minit delivery dalam coverage area</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
