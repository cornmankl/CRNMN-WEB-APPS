import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Truck } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { AnimatedButton } from './AnimatedButton';

interface MobileHeroSectionProps {
    onOrderNow: () => void;
    onWatchVideo: () => void;
}

export function MobileHeroSection({ onOrderNow, onWatchVideo }: MobileHeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { isMobile, isTablet } = useResponsive();

    const heroSlides = [
        {
            id: 1,
            title: "Premium Corn Delivered",
            subtitle: "Fresh, hot & delicious",
            description: "4 amazing flavors delivered to your door in 30 minutes",
            image: "https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=800&h=600&fit=crop",
            cta: "Order Now",
            badge: "Most Popular"
        },
        {
            id: 2,
            title: "Susu Pekat Classic",
            subtitle: "Traditional Malaysian",
            description: "Sweet corn with condensed milk - a local favorite",
            image: "https://images.unsplash.com/photo-1736605406266-dbb985ef3325?w=800&h=600&fit=crop",
            cta: "Try Now",
            badge: "Local Favorite"
        },
        {
            id: 3,
            title: "Cheddar Cheese Explosion",
            subtitle: "Cheesy goodness",
            description: "Premium corn loaded with aged cheddar cheese",
            image: "https://images.unsplash.com/photo-1651718543197-f567aeaa4fb0?w=800&h=600&fit=crop",
            cta: "Get Cheesy",
            badge: "Cheesy Goodness"
        }
    ];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    const getHeroHeight = () => {
        if (isMobile) return 'h-[70vh]';
        if (isTablet) return 'h-[60vh]';
        return 'h-[50vh]';
    };

    return (
        <section className={`relative ${getHeroHeight()} overflow-hidden`}>
            {/* Background Slides */}
            <div className="absolute inset-0">
                {heroSlides.map((slide, index) => (
                    <motion.div
                        key={slide.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: currentSlide === index ? 1 : 0,
                            scale: currentSlide === index ? 1 : 1.1
                        }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="px-4 pb-8">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-md"
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                        >
                            <Star className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">
                                {heroSlides[currentSlide].badge}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                            {heroSlides[currentSlide].title}
                        </h1>

                        {/* Subtitle */}
                        <h2 className="text-xl text-green-400 mb-3 font-semibold">
                            {heroSlides[currentSlide].subtitle}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-300 text-base mb-6 leading-relaxed">
                            {heroSlides[currentSlide].description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <AnimatedButton
                                onClick={onOrderNow}
                                className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-lg text-lg"
                            >
                                {heroSlides[currentSlide].cta}
                            </AnimatedButton>

                            <motion.button
                                className="flex items-center gap-2 text-white hover:text-green-400 transition-colors py-3 px-6"
                                onClick={onWatchVideo}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Play className="w-5 h-5" />
                                <span className="font-medium">Watch Video</span>
                            </motion.button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Clock className="w-4 h-4 text-green-400" />
                                <span className="text-sm">30 min delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Truck className="w-4 h-4 text-green-400" />
                                <span className="text-sm">Free delivery</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 pb-4">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                                    ? 'bg-green-400 w-6'
                                    : 'bg-gray-600 hover:bg-gray-400'
                                }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-4 w-8 h-8 bg-green-500/20 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                <motion.div
                    className="absolute top-32 right-8 w-6 h-6 bg-green-500/30 rounded-full"
                    animate={{
                        y: [0, 15, 0],
                        opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1
                    }}
                />
            </div>
        </section>
    );
}
